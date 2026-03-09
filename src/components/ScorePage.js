import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

const MESSAGES = [
  { min: 10, text: 'She knows you better than you know yourself. 💍' },
  { min: 8,  text: 'She\'s basically a mind reader. Almost perfect! 💕' },
  { min: 6,  text: 'She knows you pretty well — more dates will fix the rest. 😄' },
  { min: 4,  text: 'You two are still learning each other — that\'s the fun part. 🌱' },
  { min: 0,  text: 'Plenty more to discover about each other. The adventure continues! 🗺️' },
];

export default function ScorePage({ player1Answers, player2Answers, onReplay }) {
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(0);

  const score = player1Answers.reduce((acc, a, i) => {
    return acc + (player2Answers[i]?.choice === a.choice ? 1 : 0);
  }, 0);
  const total = player1Answers.length;
  const pct = Math.round((score / total) * 100);
  const msg = MESSAGES.find(m => score >= m.min)?.text ?? '';

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t1);
  }, []);

  // Stagger row reveals
  useEffect(() => {
    if (!visible) return;
    if (revealed >= total) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 120);
    return () => clearTimeout(t);
  }, [visible, revealed, total]);

  const heartsFill = Math.round((score / total) * 10);

  return (
    <div className="page score-page">
      <FloatingHearts />

      <div className={`score-content ${visible ? 'fade-in' : ''}`}>

        {/* Score hero */}
        <div className="score-hero">
          <p className="score-label">she got</p>
          <div className="score-number">
            <span className="score-big">{score}</span>
            <span className="score-sep">/</span>
            <span className="score-total">{total}</span>
          </div>
          <p className="score-pct">{pct}% match</p>
          <div className="score-hearts">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={i < heartsFill ? 'heart-filled' : 'heart-empty'}>
                {i < heartsFill ? '♥' : '♡'}
              </span>
            ))}
          </div>
          <p className="score-msg">{msg}</p>
        </div>

        {/* Answer breakdown */}
        <div className="score-table">
          <div className="score-table-header">
            <span>Question</span>
            <span>His answer</span>
            <span>Her guess</span>
            <span></span>
          </div>
          {player1Answers.map((a, i) => {
            const correct = player2Answers[i]?.choice === a.choice;
            return (
              <div
                key={i}
                className={`score-row ${correct ? 'score-row--correct' : 'score-row--wrong'} ${i < revealed ? 'score-row--visible' : ''}`}
              >
                <span className="sr-question">{a.question}</span>
                <span className="sr-p1">{a.choice}</span>
                <span className="sr-p2">{player2Answers[i]?.choice ?? '—'}</span>
                <span className="sr-icon">{correct ? '✓' : '✗'}</span>
              </div>
            );
          })}
        </div>

        <button className="start-btn" onClick={onReplay} style={{ marginTop: '0.5rem' }}>
          <span>Play Again</span>
          <span className="btn-heart">♥</span>
        </button>

        <p className="exit-sign">made with ♥ just for you</p>
      </div>
    </div>
  );
}
