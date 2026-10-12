import { useEffect, useRef } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';

/*
  Progresso de rolagem barato para muitas animações ao mesmo tempo.

  O useScroll do Framer Motion mede a posição de cada elemento a cada quadro. Com dezenas de títulos e textos
  animados pela rolagem, isso forçava o navegador a recalcular estilos várias vezes por quadro e a rolagem travava.
  Aqui as posições são medidas só quando o tamanho da página muda; durante a rolagem, a conta usa apenas o scrollY
  e nenhum layout é lido.

  Um ponto de encontro [borda, linha] diz: "quando a borda do elemento (0 = topo, 1 = base) encontra a linha da
  tela (0 = topo, 1 = base)". O progresso vai de 0 no primeiro ponto a 1 no segundo.
*/
export type Encontro = [borda: number, linha: number];

type Item = { el: HTMLElement; de: Encontro; ate: Encontro; valor: MotionValue<number>; topo: number; altura: number };

const itens = new Set<Item>();
let alturaTela = typeof window !== 'undefined' ? window.innerHeight : 0;
let iniciado = false;
let pendente = false;

// Posição pela cadeia de offsetTop: ignora transformações, então o próprio movimento não altera a medida.
function topoNoDocumento(el: HTMLElement) {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

function medir(item: Item) { item.topo = topoNoDocumento(item.el); item.altura = item.el.offsetHeight; }

function calcular(item: Item, y: number) {
  const inicio = item.topo + item.de[0] * item.altura - item.de[1] * alturaTela;
  const fim = item.topo + item.ate[0] * item.altura - item.ate[1] * alturaTela;
  const p = fim === inicio ? (y >= fim ? 1 : 0) : (y - inicio) / (fim - inicio);
  item.valor.set(p < 0 ? 0 : p > 1 ? 1 : p);
}

function atualizarTudo() { const y = window.scrollY; itens.forEach((i) => calcular(i, y)); }

function remedirTudo() {
  pendente = false;
  alturaTela = window.innerHeight;
  itens.forEach(medir);
  atualizarTudo();
  progressoPagina.set(paginaProgresso());
}

// Mudou o tamanho da página (imagem carregou, aba trocou, janela redimensionou): mede de novo no próximo quadro.
function agendarMedida() { if (pendente) return; pendente = true; requestAnimationFrame(remedirTudo); }

function paginaProgresso() { const max = document.documentElement.scrollHeight - window.innerHeight; return max > 0 ? window.scrollY / max : 0; }

/** Progresso da página inteira (barra de leitura). */
export const progressoPagina = motionValue(0);
let alturaDocumento = 0;

function iniciar() {
  if (iniciado) return;
  iniciado = true;
  window.addEventListener('scroll', () => {
    atualizarTudo();
    const max = alturaDocumento - alturaTela;
    progressoPagina.set(max > 0 ? window.scrollY / max : 0);
  }, { passive: true });
  window.addEventListener('resize', agendarMedida);
  new ResizeObserver(() => { alturaDocumento = document.documentElement.scrollHeight; agendarMedida(); }).observe(document.body);
  alturaDocumento = document.documentElement.scrollHeight;
}

/** Valor de 0 a 1 que acompanha a rolagem entre dois pontos de encontro do elemento com a tela. */
export function useProgresso(ref: React.RefObject<HTMLElement | null>, de: Encontro, ate: Encontro) {
  const valor = useRef<MotionValue<number>>(null);
  if (!valor.current) valor.current = motionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    iniciar();
    const item: Item = { el, de, ate, valor: valor.current!, topo: 0, altura: 0 };
    itens.add(item);
    medir(item);
    calcular(item, window.scrollY);
    // Ao desmontar, volta a 0. Sem isso, quando o React remonta o efeito (modo estrito), o valor já estaria
    // no ponto certo, o "mudou" não seria avisado de novo e a animação ficaria presa no começo.
    return () => { itens.delete(item); item.valor.set(0); };
    // Os pontos de encontro são constantes em cada uso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
  return valor.current;
}
