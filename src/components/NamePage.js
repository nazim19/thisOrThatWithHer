import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

export default function NamePage({ onStart }) {
  const [visible, setVisible] = useState(false);
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [message, setMessage] = useState('');
  const [timerEnabled, setTimerEnabled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({
      p1Name: p1Name.trim() || 'Him',
      p2Name: p2Name.trim() || 'Her',
      hiddenMessage: message.trim(),
      timerEnabled,
    });
  };

  return (
    <div className="page entry-page">
      <FloatingHearts />
      <form
        className={`name-form ${visible ? 'fade-in' : ''}`}
        onSubmit={handleSubmit}
      >
        <p className="entry-subtitle">before we begin</p>
        <h2 className="name-form-title">Who's playing?</h2>

        <div className="name-inputs">
          <div className="name-field">
            <label>💙 His name</label>
            <input
              className="name-input"
              placeholder="Your name"
              value={p1Name}
              onChange={e => setP1Name(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="name-field">
            <label>💕 Her name</label>
            <input
              className="name-input"
              placeholder="Her name"
              value={p2Name}
              onChange={e => setP2Name(e.target.value)}
              maxLength={20}
            />
          </div>
        </div>

        <div className="secret-msg-wrap">
          <label className="secret-label">
            💌 Secret message <span className="optional">(optional)</span>
          </label>
          <p className="secret-hint">
            She'll unlock this only if she scores 10 or more — don't make it too easy.
          </p>
          <textarea
            className="secret-input"
            placeholder="Write something only she should read…"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            maxLength={300}
          />
        </div>

        <label className="timer-toggle">
          <div className={`toggle-track ${timerEnabled ? 'toggle-on' : ''}`} onClick={() => setTimerEnabled(v => !v)}>
            <div className="toggle-thumb" />
          </div>
          <div className="toggle-label">
            <span>⏱ Timer mode</span>
            <span className="toggle-sub">10 seconds per question</span>
          </div>
        </label>

        <div className="pulse-ring" />
        <button className="start-btn" type="submit">
          <span>Let's Play</span>
          <span className="btn-heart">♥</span>
        </button>
      </form>
    </div>
  );
}
