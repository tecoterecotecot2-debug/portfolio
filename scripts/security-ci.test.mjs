import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bundleManifest, validateAudit, validateRevision } from './security-ci.mjs';

const cleanAudit = () => ({ metadata: { vulnerabilities: {
  info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0,
} }, vulnerabilities: {} });

test('missing or inconsistent advisory data blocks CI', () => {
  assert.throws(() => validateAudit({}));
  assert.throws(() => validateAudit({ error: { code: 'NETWORK' } }));
  const incomplete = cleanAudit();
  incomplete.metadata.vulnerabilities.total = 1;
  assert.throws(() => validateAudit(incomplete));
});
test('high and critical advisories block; moderate findings stay visible', () => {
  for (const severity of ['high', 'critical']) {
    const report = cleanAudit();
    report.metadata.vulnerabilities[severity] = 1;
    report.metadata.vulnerabilities.total = 1;
    report.vulnerabilities.example = { severity };
    assert.throws(() => validateAudit(report));
  }
  const report = cleanAudit();
  report.metadata.vulnerabilities.moderate = 1;
  report.metadata.vulnerabilities.total = 1;
  report.vulnerabilities.example = { severity: 'moderate' };
  assert.equal(validateAudit(report).moderate, 1);
});
test('missing or different revision blocks evidence', () => {
  assert.throws(() => validateRevision('a'.repeat(40), undefined));
  assert.throws(() => validateRevision('a'.repeat(40), 'b'.repeat(40)));
  validateRevision('a'.repeat(40), 'a'.repeat(40));
});
test('bundle content changes its evidence hash; missing build is rejected', () => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-manifest-test-'));
  try {
    assert.throws(() => bundleManifest(join(root, 'absent')));
    assert.throws(() => bundleManifest(root));
    writeFileSync(join(root, 'index.html'), '<script src="app.js"></script>');
    writeFileSync(join(root, 'app.js'), 'console.log(1);');
    const before = bundleManifest(root);
    writeFileSync(join(root, 'app.js'), 'console.log(2);');
    assert.notEqual(before.manifest_sha256, bundleManifest(root).manifest_sha256);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('a symbolic link cannot import files from outside the build', { skip: process.platform === 'win32' }, () => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-symlink-test-'));
  try {
    const dist = join(root, 'dist');
    mkdirSync(dist);
    writeFileSync(join(dist, 'index.html'), '<script src="app.js"></script>');
    writeFileSync(join(root, 'outside.js'), 'private');
    symlinkSync(join(root, 'outside.js'), join(dist, 'app.js'));
    assert.throws(() => bundleManifest(dist));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
