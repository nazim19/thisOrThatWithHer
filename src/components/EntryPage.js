import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

export default function EntryPage({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page entry-page">
      <FloatingHearts />
      <div className={`entry-content ${visible ? 'fade-in' : ''}`}>
        <p className="entry-subtitle">a game for two</p>
        <h1 className="entry-title">
          This<span className="or-divider"> or </span>That
        </h1>
        <p className="entry-desc">
          You answer 10 questions honestly.<br />
          Then she guesses every single one.<br />
          <span style={{ color: 'var(--rose-light)', fontStyle: 'italic' }}>How well does she know you?</span>
        </p>
        <div className="pulse-ring" />
        <button className="start-btn" onClick={onStart}>
          <span>Start Game</span>
          <span className="btn-heart">♥</span>
        </button>
      </div>
    </div>
  );
}
