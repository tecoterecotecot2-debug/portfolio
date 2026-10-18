import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceDir = '.ci-evidence';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const execute = (command, args, options = {}) => spawnSync(command, args, {
  encoding: 'utf8', timeout: 180_000, maxBuffer: 16 * 1024 * 1024, ...options,
});

export function validateAudit(report) {
  assert(report && !report.error, 'Dependency audit unavailable');
  const counts = report.metadata?.vulnerabilities;
  assert(counts && typeof report.vulnerabilities === 'object' && report.vulnerabilities !== null,
    'Incomplete dependency audit');
  for (const key of ['info', 'low', 'moderate', 'high', 'critical', 'total']) {
    assert(Number.isSafeInteger(counts[key]) && counts[key] >= 0, 'Invalid advisory counts');
  }
  assert.equal(counts.total, counts.info + counts.low + counts.moderate + counts.high + counts.critical,
    'Inconsistent advisory counts');
  assert.equal(Object.keys(report.vulnerabilities).length, counts.total, 'Missing advisory details');
  assert.equal(counts.high + counts.critical, 0, 'High or critical dependency advisories block CI');
  return counts;
}

export function bundleManifest(directory) {
  assert(lstatSync(directory).isDirectory(), 'Production bundle missing');
  const files = [];
  function walk(folder) {
    for (const name of readdirSync(folder).sort()) {
      const path = join(folder, name);
      const stat = lstatSync(path);
      assert(!stat.isSymbolicLink(), 'Symlinks are not accepted in production evidence');
      if (stat.isDirectory()) walk(path);
      else {
        assert(stat.isFile(), 'Unexpected production artifact');
        files.push({ path: relative(directory, path).replaceAll('\\', '/'), size: stat.size,
          sha256: sha256(readFileSync(path)) });
      }
    }
  }
  walk(directory);
  assert(files.some((f) => f.path === 'index.html'), 'Production index missing');
  assert(files.some((f) => f.path.endsWith('.js')), 'Production JavaScript missing');
  return { files, manifest_sha256: sha256(JSON.stringify(files)) };
}

export function validateRevision(actual, expected) {
  assert(/^[a-f0-9]{40}$/.test(expected ?? ''), 'Expected revision required');
  assert.equal(actual, expected, 'Checked-out revision differs from CI revision');
}

function save(name, data) {
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(join(evidenceDir, name + '.json'), JSON.stringify(data, null, 2) + '\n');
}
function load(name) { return JSON.parse(readFileSync(join(evidenceDir, name + '.json'), 'utf8')); }

function audit() {
  const scan = execute('npm', ['audit', '--package-lock-only', '--ignore-scripts', '--json',
    '--audit-level=high', '--registry=https://registry.npmjs.org']);
  assert(!scan.error && [0, 1].includes(scan.status), 'Dependency audit could not finish');
  const report = JSON.parse(scan.stdout);
  const counts = validateAudit(report);
  assert.equal(scan.status, 0, 'npm audit reported a blocking result');
  save('dependencies', { status: 'passed', checked_at: new Date().toISOString(), counts,
    package_lock_sha256: sha256(readFileSync('package-lock.json')),
    command: 'npm audit --package-lock-only --ignore-scripts --json --audit-level=high --registry=https://registry.npmjs.org' });
  console.log('Dependency audit passed; high=0 critical=0.');
}

function withScanner(action) {
  const binary = process.env.GITLEAKS_BINARY;
  assert(binary, 'Verified Gitleaks executable required');
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-secret-check-'));
  try {
    const config = join(folder, 'config.toml');
    const ignore = join(folder, 'ignore');
    writeFileSync(config, 'title = "CI default rules; no repository overrides"\n[extend]\nuseDefault = true\n');
    writeFileSync(ignore, '');
    const env = { ...process.env };
    delete env.GITLEAKS_CONFIG;
    delete env.GITLEAKS_CONFIG_TOML;
    const options = ['--config', config, '--gitleaks-ignore-path', ignore, '--ignore-gitleaks-allow',
      '--redact=100', '--log-level=error', '--no-banner', '--no-color',
      '--max-decode-depth=2', '--max-archive-depth=2', '--timeout=120'];
    const version = execute(binary, ['version'], { env });
    assert.equal(version.status, 0, 'Secret scanner unavailable');
    assert.equal(version.stdout.trim(), '8.30.1', 'Unexpected secret scanner version');
    action({ binary, folder, env, options });
  } finally { rmSync(folder, { recursive: true, force: true }); }
}
function scan(binary, args, env) {
  const result = execute(binary, args, { env });
  // Scanner output remains in memory; no finding text, secret, author or email is emitted.
  assert(!result.error && result.status === 0,
    'Secret scan failed; a finding or scanner error requires investigation (output withheld).');
}
function source() {
  withScanner(({ binary, folder, env, options }) => {
    const fixture = join(folder, 'fixture');
    mkdirSync(fixture);
    const synthetic = ['gh', 'p_'].join('') + randomBytes(24).toString('hex').slice(0, 36);
    writeFileSync(join(fixture, 'sample.txt'), 'token = "' + synthetic + '"\n');
    const report = join(folder, 'synthetic.json');
    const negative = execute(binary, ['dir', ...options, '--report-format=json', '--report-path', report, fixture], { env });
    assert(!negative.error && negative.status === 1, 'Scanner failed to reject synthetic secret');
    const reportText = readFileSync(report, 'utf8');
    assert(!reportText.includes(synthetic), 'Scanner report did not redact synthetic secret');
    assert(JSON.parse(reportText).some((item) => item.RuleID === 'github-pat'),
      'Expected secret rule did not detect synthetic fixture');
    scan(binary, ['git', ...options, '--log-opts=--all', '.'], env);
    scan(binary, ['dir', ...options, '.'], env);
    save('source-secrets', { status: 'passed', scanner: 'gitleaks 8.30.1',
      checked_at: new Date().toISOString(), scopes: ['all fetched Git history', 'working tree'],
      synthetic_detection_and_redaction: 'passed', repository_allowlists: 'disabled' });
  });
  console.log('History/source secret checks and synthetic rejection passed.');
}
function bundle() {
  bundleManifest('dist'); // Reject an absent/empty bundle before invoking the scanner.
  withScanner(({ binary, env, options }) => scan(binary, ['dir', ...options, 'dist'], env));
  save('bundle-secrets', { status: 'passed', scanner: 'gitleaks 8.30.1',
    checked_at: new Date().toISOString(), scope: 'dist', repository_allowlists: 'disabled' });
  console.log('Production bundle secret check passed.');
}
function evidence() {
  const git = execute('git', ['rev-parse', 'HEAD']);
  assert.equal(git.status, 0, 'Git revision unavailable');
  const revision = git.stdout.trim();
  validateRevision(revision, process.env.EXPECTED_REVISION);
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  assert([22, 24].includes(nodeMajor), 'Unsupported CI Node major');
  assert.equal(String(nodeMajor), process.env.CI_NODE_VERSION, 'CI Node matrix differs from runtime');
  const lockHash = sha256(readFileSync('package-lock.json'));
  const checks = {};
  if (nodeMajor === 24) {
    for (const name of ['dependencies', 'source-secrets', 'bundle-secrets']) {
      checks[name] = load(name);
      assert.equal(checks[name].status, 'passed', 'Required security evidence missing');
    }
    assert.equal(checks.dependencies.package_lock_sha256, lockHash, 'Lockfile changed after audit');
  }
  save('build', {
    schema_version: 1, tested_revision: revision, pr_head_revision: process.env.PR_HEAD_REVISION || null,
    run_url: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY + '/actions/runs/' + process.env.GITHUB_RUN_ID : null,
    checked_at: new Date().toISOString(), node: process.version, package_lock_sha256: lockHash,
    build: 'passed', bundle: bundleManifest('dist'), security_checks: checks,
    production_release_status: 'NÃO VERIFICADO',
    limits: 'Compilation, known dependency advisories and pattern-based secret detection only; no production, authentication, infrastructure or business-logic audit.',
  });
  console.log('Build evidence recorded for revision ' + revision + '. Production release remains unverified.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const actions = { audit, source, bundle, evidence };
    assert(Object.hasOwn(actions, process.argv[2]), 'Use source, audit, bundle or evidence');
    actions[process.argv[2]]();
  } catch (error) {
    console.error(error instanceof SyntaxError ? 'Invalid audit data; CI blocked.' : error.message);
    process.exitCode = 1;
  }
}
