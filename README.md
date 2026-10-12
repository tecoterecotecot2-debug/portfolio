# Portfólio — João Siegloch

Site pessoal de desenvolvedor web com estudos de caso de quatro projetos: Plataforma Deload, We Love Gastrobar, Natto Bistrô & Café e MetaTracker.

Cada projeto tem uma página própria com visão geral, telas, decisões de engenharia e design.

## Tecnologias

- React 19 + TypeScript
- Vite
- Framer Motion (animações) e Lenis (rolagem suave)
- Lucide (ícones)

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha o contato
npm run dev                  # http://127.0.0.1:4700
npm run build                # gera dist/ para publicar
```

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `src/data.ts` | todos os textos e dados dos projetos |
| `src/App.tsx` | rotas, página inicial e página de cada projeto |
| `src/motion.tsx` | componentes de movimento (`RevealLines`, `StaggerChars`, `Reveal`, `Shot`, `ScrollWords`, `Preloader`) |
| `src/scroll.ts` | integração da rolagem suave |
| `src/styles.css` | visual; cada projeto usa as cores do próprio cliente |
| `public/projetos/` | capturas de tela (computador e celular) e miniaturas em `mini/` |

## Rotas

- `/`: abertura, apresentação, vitrine de projetos, processo de trabalho e ferramentas.
- `/projeto/deload`, `/projeto/welove`, `/projeto/natto`, `/projeto/metatracker`: páginas dos projetos.

`vercel.json` e `public/.htaccess` redirecionam essas rotas para o `index.html` em hospedagem estática.

## Acessibilidade

O rodapé tem um botão "Reduzir animações" que desliga os movimentos do site.

## Privacidade

As capturas usam dados de demonstração. Nomes, telefones e informações confidenciais dos clientes foram cobertos antes da captura.
