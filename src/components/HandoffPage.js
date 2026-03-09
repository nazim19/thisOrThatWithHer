import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

export default function HandoffPage({ onReady, p1Name = 'Him', p2Name = 'Her', isWYR = false }) {
  const [visible, setVisible]     = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleReady = () => setCountdown(3);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) { onReady(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [countdown, onReady]);

  return (
    <div className="page handoff-page">
      <FloatingHearts />
      <div className={`handoff-content ${visible ? 'fade-in' : ''}`}>
        {countdown === null ? (
          <>
            <div className="handoff-icon">{isWYR ? '🎲' : '📱'}</div>
            <h2 className="handoff-title">
              {isWYR ? 'Bonus round locked in!' : `${p1Name}'s answers are locked in!`}
            </h2>
            <p className="handoff-desc">
              {isWYR
                ? <>Now pass the phone to <strong>{p2Name}</strong>.<br />Can she read his mind on the bonus round?</>
                : <>Now pass the phone to <strong>{p2Name}</strong>.<br />She'll try to guess every answer {p1Name} gave.<br /></>
              }
              <span className="handoff-hint">No peeking! 👀</span>
            </p>
            <button className="start-btn" onClick={handleReady}>
              <span>{isWYR ? `I'm ready, ${p2Name}!` : `I'm ready to guess`}</span>
              <span className="btn-heart">💕</span>
            </button>
          </>
        ) : (
          <div className="countdown">
            {countdown > 0 && (
              <span key={countdown} className="countdown-num">{countdown}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
