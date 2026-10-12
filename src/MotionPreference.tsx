import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

// Mesmo padrão do Natto: rolagem suave e construção pela rolagem valem sempre;
// quem quiser parar tudo usa o botão "Reduzir animações" do rodapé.
const MotionContext = createContext<{ reduced: boolean; toggle: () => void }>({ reduced: false, toggle: () => {} });

export function MotionPreference({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { document.documentElement.dataset.motion = reduced ? 'off' : 'on'; }, [reduced]);
  return <MotionContext.Provider value={{ reduced, toggle: () => setReduced(!reduced) }}>
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
  </MotionContext.Provider>;
}

export const useSiteReducedMotion = () => useContext(MotionContext).reduced;

export function MotionToggle() {
  const { reduced, toggle } = useContext(MotionContext);
  return <button className="motion-toggle" onClick={toggle} aria-pressed={!reduced}>
    {reduced ? 'Ativar animações' : 'Reduzir animações'}
  </button>;
}
