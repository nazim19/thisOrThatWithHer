import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

export default function HandoffPage({ onReady }) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleReady = () => {
    setCountdown(3);
  };

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
            <div className="handoff-icon">📱</div>
            <h2 className="handoff-title">Your answers are locked in!</h2>
            <p className="handoff-desc">
              Now pass the phone to her.<br />
              She'll try to guess every answer you gave.<br />
              <span className="handoff-hint">No peeking at your answers! 👀</span>
            </p>
            <button className="start-btn" onClick={handleReady}>
              <span>I'm ready to guess</span>
              <span className="btn-heart">💕</span>
            </button>
          </>
        ) : (
          <div className="countdown">
            {countdown > 0 ? (
              <span key={countdown} className="countdown-num">{countdown}</span>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
