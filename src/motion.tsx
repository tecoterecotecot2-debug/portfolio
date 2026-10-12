import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion';
import { useSiteReducedMotion } from './MotionPreference';
import { useProgresso } from './scroll';

// Sistema de movimento reaproveitado do site do Natto.
export const ease = [0.22, 1, 0.36, 1] as const;
export const cinema = [0.76, 0, 0.24, 1] as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * O site se constrói com a rolagem: o bloco anda junto com o scroll enquanto entra na tela
 * (do topo aparecendo embaixo até ~65% da altura) e se desfaz se o visitante voltar.
 */
function useBuild(ref: React.RefObject<HTMLElement | null>, lag = 0) {
  // Do topo do elemento aparecendo na base da tela até ele chegar a 65% da altura.
  const progresso = useProgresso(ref, [0, 1], [0, 0.65]);
  const start = Math.min(lag, 0.5);
  return useTransform(progresso, [start, Math.min(start + 0.6, 1)], [0, 1], { ease: easeOut });
}

// Quem observa a entrada é a moldura de fora: o que a máscara esconde nunca "aparece" para o navegador.
function Line({ children, delay, onLoad }: { children: React.ReactNode; delay: number; onLoad: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useSiteReducedMotion();
  const built = useBuild(ref, delay * 1.4);
  const y = useTransform(built, [0, 1], ['108%', '0%']);
  if (onLoad) return <span ref={ref} className="line"><motion.span className="line-inner" initial={reduced ? false : { y: '108%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease, delay }}>{children}</motion.span></span>;
  return <span ref={ref} className="line"><motion.span className="line-inner" style={reduced ? undefined : { y }}>{children}</motion.span></span>;
}

/** Linhas de título que sobem por trás de uma máscara, uma depois da outra. */
export function RevealLines({ lines, delay = 0, onLoad = false }: { lines: React.ReactNode[]; delay?: number; onLoad?: boolean }) {
  return <>{lines.map((line, i) => <Line key={i} delay={delay + i * 0.09} onLoad={onLoad}>{line}</Line>)}</>;
}

/** Texto que surge letra por letra com opacidade e movimento. As palavras não quebram no meio. */
export function StaggerChars({ text, delay = 0, step = 0.04 }: { text: string; delay?: number; step?: number }) {
  const reduced = useSiteReducedMotion();
  let i = 0;
  // O espaço fica fora da palavra: dentro de um inline-block ele some no fim da linha.
  return <span className="stagger" aria-label={text}>{text.split(' ').map((word, w, words) => <Fragment key={w}><span className="stagger-word" aria-hidden="true">
    {word.split('').map((ch, c) => {
      const d = delay + (i++) * step;
      return <motion.span key={c} className="stagger-char" initial={reduced ? false : { opacity: 0, y: '0.35em' }} animate={{ opacity: 1, y: '0em' }} transition={{ duration: 0.8, ease, delay: d }}>{ch}</motion.span>;
    })}
  </span>{w < words.length - 1 ? ' ' : ''}</Fragment>)}</span>;
}

/** Bloco que sobe e aparece conforme a rolagem o traz para a tela. */
// A medida é feita na moldura de fora; quem se move é o bloco de dentro.
export function Reveal({ children, className = '', delay = 0, as = 'div' }: { children: React.ReactNode; className?: string; delay?: number; as?: 'div' | 'li' }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useSiteReducedMotion();
  const built = useBuild(ref, delay * 1.4);
  const y = useTransform(built, [0, 1], [60, 0]);
  const Tag = as;
  return <Tag ref={ref as never} className={className}><motion.div className="reveal-inner" style={reduced ? undefined : { opacity: built, y }}>{children}</motion.div></Tag>;
}

/** Palavras que acendem uma a uma conforme a rolagem (texto de apresentação). */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useSiteReducedMotion();
  // Termina quando a base do texto chega a 75% da tela: com o texto em foco, todas as palavras já acenderam.
  const progresso = useProgresso(ref, [0, 0.9], [1, 0.75]);
  const words = text.split(' ');
  return <p ref={ref} className={`scroll-words ${className}`}>
    {words.map((w, i) => <Word key={i} progress={progresso} range={[i / words.length, (i + 1) / words.length]} reduced={reduced}>{w}</Word>)}
  </p>;
}
function Word({ children, progress, range, reduced }: { children: string; progress: MotionValue<number>; range: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <><motion.span style={reduced ? undefined : { opacity }}>{children}</motion.span>{' '}</>;
}

/** Abertura: o nome se monta e a cortina sobe. Só na primeira visita da sessão. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    document.documentElement.classList.add('is-loading');
    const timer = window.setTimeout(() => setShow(false), 1900);
    return () => { window.clearTimeout(timer); document.documentElement.classList.remove('is-loading'); };
  }, []);
  return <AnimatePresence onExitComplete={() => { document.documentElement.classList.remove('is-loading'); onDone(); }}>
    {show && <motion.div className="preloader" aria-hidden="true" initial={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 1, ease: cinema }}>
      <div className="preloader-mark">
        <span className="preloader-word">{'Siegloch'.split('').map((letter, i) => <span key={i} className="line"><motion.span className="line-inner" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.06 }}>{letter}</motion.span></span>)}</span>
        <motion.span className="preloader-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease, delay: 0.5 }} />
        <motion.small initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.85 }}>DESENVOLVEDOR WEB</motion.small>
      </div>
    </motion.div>}
  </AnimatePresence>;
}
