import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Monitor, Smartphone } from 'lucide-react';
import { useSiteReducedMotion, MotionToggle } from './MotionPreference';
import { Preloader, Reveal, RevealLines, ScrollWords, StaggerChars, ease, cinema } from './motion';
import { img, mini, numeros, passos, projetos, stack, whatsapp, type Projeto } from './data';
import { progressoPagina, useProgresso } from './scroll';

function firstVisit() { try { if (sessionStorage.getItem('js-intro')) return false; sessionStorage.setItem('js-intro', '1'); return true; } catch { return true; } }
// Calculado uma vez ao carregar: no modo estrito do React o inicializador do estado roda duas vezes.
const FIRST_VISIT = firstVisit();

/* ───────────────────────── Navegação entre páginas ─────────────────────────
   Página inicial em "/" e uma página por projeto em "/projeto/<id>". Âncoras (#projetos)
   funcionam nas duas: se a seção não existe na página atual, volta para a inicial e rola até ela. */

const Router = createContext<{ path: string; go: (to: string) => void }>({ path: '/', go: () => {} });
const useRouter = () => useContext(Router);

function Link({ to, className, children, ...rest }: { to: string; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { go } = useRouter();
  return <a href={to} className={className} {...rest} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); go(to); }}>{children}</a>;
}

function WhatsApp({ className, children }: { className?: string; children: React.ReactNode }) {
  return <a className={className} href={whatsapp.link} target="_blank" rel="noreferrer">{children}</a>;
}

/* ───────────────────────── Cabeçalho e rodapé ───────────────────────── */

function Header({ start, projeto }: { start: number; projeto?: Projeto }) {
  const reduced = useSiteReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const on = () => setScrolled(window.scrollY > 30); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);
  return <motion.header className={`header ${scrolled ? 'solid' : ''} ${projeto ? `theme-${projeto.id}` : ''}`} initial={reduced ? false : { y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease, delay: start + 0.3 }}>
    <Link to="/" className="brand" aria-label="João Siegloch, página inicial">João Siegloch</Link>
    <nav className="nav" aria-label="Navegação principal"><Link to="/#projetos">Projetos</Link></nav>
    <WhatsApp className="nav-cta">Fale comigo <ArrowUpRight size={13} /></WhatsApp>
    <motion.div className="reading-progress" style={{ scaleX: progressoPagina }} />
  </motion.header>;
}

function Rodape() {
  return <footer className="footer" id="contato">
    <WhatsApp className="footer-whats">WhatsApp {whatsapp.texto} <ArrowUpRight size={14} /></WhatsApp>
    <span>© 2026 João Siegloch</span>
    <MotionToggle />
    <a className="link-line" href="#topo" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('ir-topo')); }}>Voltar ao topo <ArrowUpRight size={12} /></a>
  </footer>;
}

/* ───────────────────────── Página inicial ───────────────────────── */

const parede = [
  ['natto-abertura', 'welove-cardapio', 'deload-login-claro', 'metatracker-admin'],
  ['welove-abertura', 'metatracker-painel', 'natto-cozinha', 'natto-amazonia'],
  ['deload-inicio', 'welove-atmosfera', 'natto-cardapio', 'metatracker-novo'],
  ['natto-local', 'deload-flashcards', 'welove-horarios', 'natto-momentos'],
];

function Hero({ start }: { start: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useSiteReducedMotion();
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width:720px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width:720px)');
    const update = () => setCompact(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  // Do topo da abertura no topo da tela até a base dela sair por cima.
  const progresso = useProgresso(ref, [0, 0], [1, 0]);
  const wallY = useTransform(progresso, [0, 1], ['0%', '12%']);
  const copyY = useTransform(progresso, [0, 1], ['0%', '-22%']);
  const fade = useTransform(progresso, [0, 0.7], [1, 0]);
  // A parede só se mexe enquanto a abertura está visível.
  const [visivel, setVisivel] = useState(true);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, []);
  const fadeIn = (delay: number) => ({ initial: reduced ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease, delay: start + delay } });
  return <section ref={ref} className={`hero ${visivel ? '' : 'parado'}`} aria-labelledby="hero-title">
    {/* Cortinas transformadas preservam a abertura central sem recortar 32 imagens a cada quadro. */}
    <motion.div className="hero-media" aria-hidden="true" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease, delay: start }}>
      <motion.div className="wall" style={reduced || compact ? undefined : { y: wallY }} initial={reduced || compact ? false : { scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease, delay: start }}>
        {(compact ? parede.slice(0, 2) : parede).map((col, i) => <div key={i} className={`wall-col ${i % 2 ? 'down' : 'up'}`}>
          {(compact ? col : [...col, ...col]).map((name, j) => <img key={j} src={mini(name)} alt="" width={760} height={475} loading={j < 4 ? 'eager' : 'lazy'} decoding="async" />)}
        </div>)}
      </motion.div>
      <span className="hero-shade" />
    </motion.div>
    {!reduced && !compact && ['top', 'bottom', 'left', 'right'].map((side) => <motion.span key={side} aria-hidden="true" className={`hero-curtain ${side}`} initial={side === 'top' || side === 'bottom' ? { scaleY: 1 } : { scaleX: 1 }} animate={side === 'top' || side === 'bottom' ? { scaleY: 0 } : { scaleX: 0 }} transition={{ duration: 1.6, ease: cinema, delay: start }} />)}
    <motion.div className="hero-copy-wrap" style={reduced || compact ? undefined : { y: copyY, opacity: fade }}>
      <div className="hero-copy">
        <h1 id="hero-title"><StaggerChars text="João Siegloch" delay={start + 0.15} /></h1>
        <motion.p className="hero-role" {...fadeIn(0.9)}>Desenvolvedor web, do front ao backend.</motion.p>
        <motion.p {...fadeIn(1.2)}>Faço sites e sistemas sob medida para empresas e para a área da saúde, incluindo pesquisa avançada de congressos médicos. Você acompanha o trabalho e fala direto comigo.</motion.p>
        <motion.div className="hero-actions" {...fadeIn(1.45)}><Link className="button light" to="#projetos">Ver projetos <ArrowDown size={14} /></Link><WhatsApp className="button liquid-glass">Fale comigo <ArrowUpRight size={14} /></WhatsApp></motion.div>
      </div>
    </motion.div>
  </section>;
}

function Sobre() {
  return <section className="about section-pad" id="sobre" aria-label="Apresentação">
    <ScrollWords className="about-text" text="Cuido do projeto inteiro, da tela ao banco de dados, e também faço sistemas para a saúde. Você fala direto comigo do começo ao fim." />
    <ul className="numbers">
      {numeros.map((n, i) => <Reveal key={n.titulo} as="li" delay={i * 0.08}>
        <strong>{n.valor}</strong><span className="numbers-title">{n.titulo}</span><p>{n.texto}</p>
      </Reveal>)}
    </ul>
  </section>;
}

/** Vitrine: os projetos lado a lado. Cada um abre a própria página. */
function Vitrine() {
  const reduced = useSiteReducedMotion();
  return <section className="showcase section-pad" id="projetos" aria-labelledby="showcase-title">
    <div className="showcase-head">
      <h2 id="showcase-title"><RevealLines lines={['Projetos']} /></h2>
      <Reveal><p>Clique em um projeto para ver as telas e os detalhes.</p></Reveal>
    </div>
    <ul className="showcase-grid">
      {projetos.map((p, i) => <motion.li key={p.id} className={`showcase-item theme-${p.id} ${p.destaque ? 'featured' : ''}`} initial={reduced ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease, delay: i * 0.12 }}>
        <Link to={`/projeto/${p.id}`} aria-label={`Ver o projeto ${p.nome}`}>
          <span className="showcase-cover"><img src={mini(p.capa)} alt="" loading="lazy" /><span className="showcase-open">Ver projeto <ArrowUpRight size={14} /></span></span>
          <h3>{p.nome}</h3>
          <p>{p.chamada}</p>
          <span className="showcase-type">{p.tipo}</span>
        </Link>
      </motion.li>)}
    </ul>
  </section>;
}

function Processo() {
  return <section className="process section-pad" id="processo" aria-labelledby="process-title">
    <h2 id="process-title"><RevealLines lines={['Como eu trabalho']} /></h2>
    {/* A numeração aqui é a ordem real das etapas. */}
    <ol className="steps">{passos.map(([t, d], i) => <Reveal key={t} as="li" delay={i * 0.05}>
      <span className="steps-num">{i + 1}</span><h3>{t}</h3><p>{d}</p>
    </Reveal>)}</ol>
  </section>;
}

function Ferramentas() {
  return <section className="tools section-pad" id="ferramentas" aria-labelledby="tools-title">
    <h2 id="tools-title"><RevealLines lines={['Ferramentas que uso']} /></h2>
    <div className="tools-grid">{stack.map((g, i) => <Reveal key={g.grupo} delay={i * 0.06} className="tools-group">
      <h3>{g.grupo}</h3><ul>{g.itens.map((it) => <li key={it}>{it}</li>)}</ul>
    </Reveal>)}</div>
  </section>;
}

function Inicio({ start }: { start: number }) {
  return <main id="conteudo"><Hero start={start} /><Sobre /><Vitrine /><Processo /><Ferramentas /></main>;
}

/* ───────────────────────── Página de cada projeto ───────────────────────── */

function ProjetoHero({ p, start }: { p: Projeto; start: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useSiteReducedMotion();
  const progresso = useProgresso(ref, [0, 0], [1, 0]);
  const frameY = useTransform(progresso, [0, 1], ['0%', '-10%']);
  // A moldura segue a proporção da capa: uma tela mais baixa que 16:10 não perde as laterais.
  const [proporcao, setProporcao] = useState(16 / 10);
  useEffect(() => {
    const im = new Image();
    im.onload = () => setProporcao(im.naturalWidth / im.naturalHeight);
    im.src = img(p.capa);
  }, [p.capa]);
  const fadeIn = (delay: number) => ({ initial: reduced ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay: start + delay } });
  return <section ref={ref} className="pj-hero" aria-labelledby="pj-title">
    {/* A tela do projeto abre do centro como cartão de cinema, numa moldura de navegador ao lado do título. */}
    <motion.div className="pj-hero-media" style={reduced ? undefined : { y: frameY }}>
      <motion.div className="browser" initial={reduced ? false : { clipPath: 'inset(18% 22% 18% 22% round 24px)', opacity: 0 }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 16px)', opacity: 1 }} transition={{ duration: 1.4, ease: cinema, delay: start }}>
        <div className="browser-bar" aria-hidden="true"><span /><span /><span /><i>{p.link?.texto ?? p.nome}</i></div>
        <div className="viewer-frame" style={{ aspectRatio: proporcao }}><motion.img src={img(p.capa)} alt={`Tela principal de ${p.nome}`} initial={reduced ? false : { scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2, ease, delay: start }} fetchPriority="high" /></div>
      </motion.div>
    </motion.div>
    <div className="pj-hero-copy">
      <motion.div {...fadeIn(0.2)}><Link to="/#projetos" className="back-link"><ArrowLeft size={14} /> Todos os projetos</Link></motion.div>
      <h1 id="pj-title"><span className="hero-line"><StaggerChars text={p.titulo[0]} delay={start + 0.3} step={0.03} /></span><span className="hero-line"><StaggerChars text={p.titulo[1]} delay={start + 0.7} step={0.03} /></span></h1>
      <motion.dl className="pj-meta" {...fadeIn(1.1)}>
        <div><dt>Projeto</dt><dd>{p.nome}</dd></div>
        <div><dt>Tipo</dt><dd>{p.tipo}</dd></div>
        <div><dt>Onde</dt><dd>{p.local}</dd></div>
      </motion.dl>
    </div>
  </section>;
}

const abas = ['Visão geral', 'Telas', 'Engenharia', 'Design'] as const;
type Aba = typeof abas[number];

function VisaoGeral({ p }: { p: Projeto }) {
  return <div className="overview">
    {p.destaques && <section className="project-highlights" aria-label={`Destaques de ${p.nome}`}>
      {p.destaques.map(([titulo, texto], i) => <article key={titulo}><Reveal delay={i * 0.06}>
        <h2>{titulo}</h2><p>{texto}</p>
      </Reveal></article>)}
    </section>}
    <div className="overview-text">
      {p.resumo.map((t, i) => <Reveal key={i} delay={i * 0.06}><p>{t}</p></Reveal>)}
      {p.nota && <Reveal delay={0.12}><p className="overview-note">{p.nota}</p></Reveal>}
      {p.link && <Reveal delay={0.16}><a className="button accent" href={p.link.href} target="_blank" rel="noreferrer">Visitar o site <ArrowUpRight size={14} /></a></Reveal>}
    </div>
    <div className="overview-lists">
      <Reveal><h3>O que eu fiz</h3><ul className="tags">{p.escopo.map((e) => <li key={e}>{e}</li>)}</ul></Reveal>
      {p.tecnologias && <Reveal delay={0.06}><h3>Tecnologias</h3><ul className="tags">{p.tecnologias.map((e) => <li key={e}>{e}</li>)}</ul></Reveal>}
    </div>
  </div>;
}

/** Visualizador de telas: escolhe computador/celular e navega pelas telas (lista, setas ou teclado). */
function Telas({ p }: { p: Projeto }) {
  const reduced = useSiteReducedMotion();
  const [aparelho, setAparelho] = useState<'computador' | 'celular'>('computador');
  const [atual, setAtual] = useState(0);
  const lista = p.telas[aparelho];
  const tela = lista[atual];
  const mudar = useCallback((passo: number) => setAtual((a) => (a + passo + lista.length) % lista.length), [lista.length]);
  // Cada captura do computador mostra uma seção inteira, sem pedaço da seguinte, então a altura varia.
  // As proporções são lidas antes para a moldura já abrir no tamanho certo de cada tela.
  const [proporcoes, setProporcoes] = useState<Record<string, number>>({});
  useEffect(() => {
    p.telas.computador.forEach((t) => {
      const im = new Image();
      im.onload = () => setProporcoes((atuais) => ({ ...atuais, [t.imagem]: im.naturalWidth / im.naturalHeight }));
      im.src = img(t.imagem);
    });
  }, [p]);
  const proporcao = proporcoes[tela.imagem] ?? 16 / 10;
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') mudar(1); if (e.key === 'ArrowLeft') mudar(-1); };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [mudar]);
  return <div className="viewer">
    <div className="viewer-side">
      <div className="device-switch" role="group" aria-label="Aparelho">
        {(['computador', 'celular'] as const).map((a) => <button key={a} className={aparelho === a ? 'active' : ''} aria-pressed={aparelho === a} onClick={() => { setAparelho(a); setAtual(0); }}>
          {a === 'computador' ? <Monitor size={14} /> : <Smartphone size={14} />} {a === 'computador' ? 'Computador' : 'Celular'}
          {aparelho === a && <motion.span layoutId="device-pill" className="device-pill" transition={{ duration: 0.45, ease }} />}
        </button>)}
      </div>
      <ul className="screen-list">
        {lista.map((t, i) => <li key={t.imagem}><button className={i === atual ? 'active' : ''} aria-current={i === atual} onClick={() => setAtual(i)}>{t.nome}</button></li>)}
      </ul>
    </div>
    <div className="viewer-stage">
      <div className={aparelho === 'computador' ? 'browser' : 'phone'}>
        {aparelho === 'computador' && <div className="browser-bar" aria-hidden="true"><span /><span /><span /><i>{p.link?.texto ?? p.nome}</i></div>}
        <motion.div className="viewer-frame" style={aparelho === 'computador' ? { aspectRatio: 'auto' } : undefined} initial={false}
          animate={aparelho === 'computador' ? { paddingBottom: `${100 / proporcao}%` } : { paddingBottom: '0%' }} transition={{ duration: reduced ? 0 : 0.6, ease }}>
          <AnimatePresence initial={false}>
            <motion.img key={tela.imagem} src={img(tela.imagem)} alt={`${p.nome}: ${tela.nome}`} initial={reduced ? false : { opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }} />
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="viewer-caption">
        <AnimatePresence mode="wait"><motion.div key={tela.imagem} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }}>
          <h3>{tela.nome}</h3><p>{tela.texto}</p>
        </motion.div></AnimatePresence>
        <div className="viewer-nav">
          <button onClick={() => mudar(-1)} aria-label="Tela anterior"><ArrowLeft size={16} /></button>
          <span>{atual + 1} de {lista.length}</span>
          <button onClick={() => mudar(1)} aria-label="Próxima tela"><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  </div>;
}

/** Lista das abas Engenharia e Design: título e explicação de cada decisão. */
function Lista({ itens }: { itens: [string, string][] }) {
  return <ul className="features">{itens.map(([t, d], i) => <Reveal key={t} as="li" delay={(i % 2) * 0.07}>
    <h3>{t}</h3><p>{d}</p>
  </Reveal>)}</ul>;
}

function ProjetoPagina({ p, start }: { p: Projeto; start: number }) {
  const reduced = useSiteReducedMotion();
  const [aba, setAba] = useState<Aba>('Visão geral');
  const tabsRef = useRef<HTMLDivElement>(null);
  const proximo = projetos[(projetos.indexOf(p) + 1) % projetos.length];
  const trocar = (a: Aba) => {
    setAba(a);
    // Se a barra de abas já está presa no topo, volta ao começo do conteúdo novo.
    // A posição natural da barra é o fim da abertura (presa, ela "mente" a própria posição).
    const el = tabsRef.current, hero = el?.previousElementSibling as HTMLElement | null;
    if (el && hero) {
      const topo = hero.offsetTop + hero.offsetHeight - parseFloat(getComputedStyle(el).top);
      if (window.scrollY > topo) window.dispatchEvent(new CustomEvent('ir-para', { detail: topo }));
    }
  };
  return <main id="conteudo" className={`project-page theme-${p.id}`}>
    <ProjetoHero p={p} start={start} />
    <div className="pj-tabs" ref={tabsRef}>
      <div className="pj-tabs-inner" role="tablist" aria-label={`Seções de ${p.nome}`}>
        {abas.map((a) => <button key={a} role="tab" aria-selected={aba === a} className={aba === a ? 'active' : ''} onClick={() => trocar(a)}>
          {a}{aba === a && <motion.span layoutId="pj-tab-line" className="tab-line" transition={{ duration: 0.45, ease }} />}
        </button>)}
      </div>
    </div>
    <section className="pj-panel section-pad" role="tabpanel" aria-label={aba}>
      <AnimatePresence mode="wait">
        <motion.div key={aba} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }}>
          {aba === 'Visão geral' && <VisaoGeral p={p} />}
          {aba === 'Telas' && <Telas p={p} />}
          {aba === 'Engenharia' && <Lista itens={p.engenharia} />}
          {aba === 'Design' && <Lista itens={p.design} />}
        </motion.div>
      </AnimatePresence>
    </section>
    <section className={`next-project theme-${proximo.id}`} aria-label="Próximo projeto">
      <Link to={`/projeto/${proximo.id}`}>
        <span className="next-label">Próximo projeto</span>
        <span className="next-name">{proximo.nome} <ArrowRight className="next-arrow" size={28} /></span>
        <img src={mini(proximo.capa)} alt="" loading="lazy" />
      </Link>
    </section>
  </main>;
}

/* ───────────────────────── Aplicação ───────────────────────── */

export default function App() {
  const reduced = useSiteReducedMotion();
  const [intro] = useState(() => !reduced && FIRST_VISIT);
  const [loading, setLoading] = useState(intro);
  const [path, setPath] = useState(() => window.location.pathname);
  const [start, setStart] = useState(intro ? 2 : 0.15);
  const lenis = useRef<Lenis | null>(null);
  const pendingHash = useRef<string | null>(null);

  const scrollTo = useCallback((alvo: number | HTMLElement, immediate = false) => {
    if (lenis.current) lenis.current.scrollTo(alvo, { offset: typeof alvo === 'number' ? 0 : -48, immediate });
    else if (typeof alvo === 'number') window.scrollTo(0, alvo);
    else window.scrollTo(0, alvo.getBoundingClientRect().top + window.scrollY - 48);
  }, []);

  const go = useCallback((to: string) => {
    const [rota, hash] = to.split('#');
    const destino = rota || window.location.pathname;
    if (destino === window.location.pathname) {
      if (hash) { const el = document.getElementById(hash); if (el) scrollTo(el); history.replaceState(null, '', `${destino}#${hash}`); }
      else scrollTo(0);
      return;
    }
    history.pushState(null, '', to);
    pendingHash.current = hash ?? null;
    setStart(0.15);
    setPath(destino);
  }, [scrollTo]);

  useEffect(() => { const on = () => { setStart(0.15); setPath(window.location.pathname); }; window.addEventListener('popstate', on); return () => window.removeEventListener('popstate', on); }, []);
  useEffect(() => {
    const topo = () => scrollTo(0);
    const para = (e: Event) => scrollTo((e as CustomEvent<number>).detail);
    window.addEventListener('ir-topo', topo); window.addEventListener('ir-para', para);
    return () => { window.removeEventListener('ir-topo', topo); window.removeEventListener('ir-para', para); };
  }, [scrollTo]);

  // Ao trocar de página: vai para a seção pedida ou para o topo, sem animar a rolagem.
  useLayoutEffect(() => {
    const hash = pendingHash.current; pendingHash.current = null;
    const el = hash ? document.getElementById(hash) : null;
    if (el) requestAnimationFrame(() => scrollTo(el, true)); else scrollTo(0, true);
  }, [path, scrollTo]);

  useEffect(() => {
    if (reduced || loading) return;
    const l = new Lenis({ lerp: 0.1, autoRaf: true });
    lenis.current = l;
    return () => { l.destroy(); lenis.current = null; };
  }, [reduced, loading]);

  const id = path.match(/^\/projeto\/([\w-]+)/)?.[1];
  const projeto = projetos.find((p) => p.id === id);
  useEffect(() => { document.title = projeto ? `${projeto.nome} | João Siegloch` : 'João Siegloch | Desenvolvedor web'; }, [projeto]);

  return <Router.Provider value={{ path, go }}>
    {loading && <Preloader onDone={() => setLoading(false)} />}
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <Header start={start} projeto={projeto} />
    {projeto ? <ProjetoPagina key={projeto.id} p={projeto} start={start} /> : <Inicio start={start} />}
    <Rodape />
  </Router.Provider>;
}
