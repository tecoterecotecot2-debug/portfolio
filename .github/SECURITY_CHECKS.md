# Verificações de CI

Este repositório mantém o workflow CI existente, com compilação em Node 22 e 24.
Cada push em main e pull request executa os controles. Não existe agendamento.

## Controles e evidências

- TypeScript e build Vite com dependências do lockfile e scripts de instalação desativados.
- npm audit consulta o registro oficial; avisos altos/críticos e dados inválidos/indisponíveis bloqueiam. Demais severidades ficam nas contagens da evidência.
- Gitleaks 8.30.1, conferido por SHA-256 do release oficial, verifica todo histórico obtido, árvore de trabalho e dist. Configurações locais, comentários de exclusão e ignore lists do repositório não dispensam o controle. Uma credencial sintética inválida, criada apenas no temporário do runner, precisa ser detectada e ocultada pelo scanner.
- Evidência registra revisão efetivamente compilada, revisão de origem do PR, lockfile, arquivos do bundle e seus hashes, ambiente e URL do run. O hash do manifesto representa a lista de arquivos; não é assinatura de autoria.
- Artefatos e evidências ficam 14 dias no GitHub Actions. Logs não incluem conteúdo dos achados, segredos ou identidade dos autores de commits.
- Testes exercitam rejeição de auditoria inválida, avisos bloqueantes, revisão divergente, build ausente/alterado e links simbólicos no bundle.

Actions oficiais estão fixadas por commit, com permissão contents: read e sem persistir credenciais no checkout.
Os jobs não recebem credenciais de produção, não publicam e não comentam em PRs.

## Uso e limites

O check estável CI gate só passa quando toda a matriz passa. Para bloquear integração, o responsável deve exigir esse check na proteção/ruleset de main, sem bypass geral. A existência do workflow sozinho não protege a branch nem impede publicação por outro caminho. Conferir a proteção efetiva e o aplicativo produtor do check no GitHub; não inferir pela configuração local.

A política global de segurança tem versão 1.0.0. Estes controles cobrem compilação, dependências e padrões de segredos; autenticação, pagamentos, infraestrutura, dados, restauração e lógica de negócio exigem a avaliação aplicável ao projeto. O estado de liberação de produção permanece NÃO VERIFICADO. Uma alteração no próprio workflow ou nos validadores precisa de revisão independente; uma contribuição pode tentar falsificar seu próprio check.

Achado exige investigação sem copiar valores para logs ou documentos. Rotacionar/revogar uma credencial real com autorização e corrigir o histórico conforme impacto; não acrescentar uma exclusão só para obter resultado verde.

## Fontes verificadas em 18/10/2026

- https://docs.github.com/en/actions/reference/security/secure-use
- https://github.com/actions/checkout/releases/tag/v7.0.1
- https://github.com/actions/setup-node/releases/tag/v7.1.0
- https://github.com/actions/upload-artifact/releases/tag/v7.0.2
- https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1
- https://nodejs.org/en/about/previous-releases
