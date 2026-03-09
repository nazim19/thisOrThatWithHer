import React, { useEffect, useRef } from 'react';

const COLORS = ['#e8547a','#f7a8bf','#f0c27f','#a8d8ff','#c8f5b0','#ffffff','#ffcef3'];

export default function Confetti({ active }) {
  const ref = useRef();

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const pieces = [];

    for (let i = 0; i < 120; i++) {
      const el = document.createElement('div');
      const size = 5 + Math.random() * 7;
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-12px;
        width:${size}px;
        height:${size}px;
        background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        opacity:1;
        animation: confettiFall ${1.8 + Math.random() * 2.2}s ${Math.random() * 1.2}s cubic-bezier(.25,.46,.45,.94) forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(el);
      pieces.push(el);
    }

    const timeout = setTimeout(() => pieces.forEach(p => { try { p.remove(); } catch(e){} }), 5500);
    return () => { clearTimeout(timeout); pieces.forEach(p => { try { p.remove(); } catch(e){} }); };
  }, [active]);

  return (
    <div
      ref={ref}
      style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:200, overflow:'hidden' }}
    />
  );
}
