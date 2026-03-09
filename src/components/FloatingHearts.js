import React, { useEffect, useState } from 'react';

const HEARTS = ['♥', '♡', '❤', '💕', '💗', '💖', '💝'];

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const create = () => ({
      id: Math.random(),
      left: Math.random() * 100,
      size: 10 + Math.random() * 20,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
      symbol: HEARTS[Math.floor(Math.random() * HEARTS.length)],
      opacity: 0.08 + Math.random() * 0.18,
    });

    setHearts(Array.from({ length: 20 }, create));

    const interval = setInterval(() => {
      setHearts(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = create();
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hearts-bg" aria-hidden="true">
      {hearts.map(h => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
