import React, { useEffect, useState, useCallback } from 'react';
import FloatingHearts from './FloatingHearts';
import Confetti from './Confetti';

const MESSAGES = [
  { min: 15, text: 'Absolutely flawless. She knows you like a book. 💍' },
  { min: 12, text: 'She basically lives in your head. Almost perfect! 💕' },
  { min: 9,  text: 'She knows you really well — a few more dates away from perfect. 😄' },
  { min: 6,  text: 'You two are still learning each other — that\'s the best part. 🌱' },
  { min: 0,  text: 'Plenty left to discover. The adventure is just beginning! 🗺️' },
];

export default function ScorePage({
  player1Answers,
  player2Answers,
  names = { p1: 'Him', p2: 'Her' },
  hiddenMessage = '',
  onReplay,
  onBonusRound,
  isBonus = false,
}) {
  const [visible, setVisible]       = useState(false);
  const [revealed, setRevealed]     = useState(0);
  const [msgUnlocked, setMsgUnlocked] = useState(false);
  const [copied, setCopied]         = useState(false);

  const score  = player1Answers.reduce((acc, a, i) =>
    acc + (player2Answers[i]?.choice === a.choice ? 1 : 0), 0);
  const total  = player1Answers.length;
  const pct    = Math.round((score / total) * 100);
  const msg    = MESSAGES.find(m => score >= m.min)?.text ?? '';
  const heartsFill = Math.round((score / total) * 10);
  const isPerfect  = score === total;
  const unlockThreshold = 10;
  const messageIsUnlockable = hiddenMessage.length > 0;
  const canUnlock = score >= unlockThreshold;

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  useEffect(() => {
    if (!visible || revealed >= total) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 110);
    return () => clearTimeout(t);
  }, [visible, revealed, total]);

  const handleShare = useCallback(() => {
    const header = `🎮 This or That — ${names.p1} & ${names.p2}\nScore: ${score}/${total} (${pct}% match)\n\n`;
    const rows = player1Answers.map((a, i) => {
      const guess   = player2Answers[i]?.choice ?? '—';
      const correct = guess === a.choice;
      return `${correct ? '✓' : '✗'} ${a.question}\n  His: ${a.choice} | Her guess: ${guess}`;
    }).join('\n');
    const text = header + rows + '\n\nmade with ♥';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [player1Answers, player2Answers, names, score, total, pct]);

  return (
    <div className="page score-page">
      <FloatingHearts />
      <Confetti active={isPerfect} />

      <div className={`score-content ${visible ? 'fade-in' : ''}`}>

        {/* Hero */}
        <div className="score-hero">
          {isBonus && <p className="bonus-label">✨ Bonus Round</p>}
          <p className="score-label">{names.p2} got</p>
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

        {/* Hidden message */}
        {messageIsUnlockable && (
          <div className={`secret-card ${canUnlock ? 'secret-card--unlocked' : 'secret-card--locked'}`}>
            {canUnlock ? (
              <>
                <p className="secret-card-label">💌 {names.p1} left you a message</p>
                {msgUnlocked
                  ? <p className="secret-card-text">{hiddenMessage}</p>
                  : <button className="secret-reveal-btn" onClick={() => setMsgUnlocked(true)}>
                      Tap to read ♥
                    </button>
                }
              </>
            ) : (
              <>
                <p className="secret-card-label">🔒 Secret message locked</p>
                <p className="secret-card-hint">Score {unlockThreshold}+ to unlock {names.p1}'s message</p>
              </>
            )}
          </div>
        )}

        {/* Answer breakdown */}
        <div className="score-table">
          <div className="score-table-header">
            <span>Question</span>
            <span>{names.p1}</span>
            <span>{names.p2}'s guess</span>
            <span></span>
          </div>
          {player1Answers.map((a, i) => {
            const guess   = player2Answers[i]?.choice ?? '—';
            const correct = guess === a.choice;
            return (
              <div
                key={i}
                className={`score-row ${correct ? 'score-row--correct' : 'score-row--wrong'} ${i < revealed ? 'score-row--visible' : ''}`}
              >
                <span className="sr-question">{a.question}</span>
                <span className="sr-p1">{a.choice}</span>
                <span className="sr-p2">{guess}</span>
                <span className="sr-icon">{correct ? '✓' : '✗'}</span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="score-actions">
          <button className="score-share-btn" onClick={handleShare}>
            {copied ? '✓ Copied!' : '📋 Share results'}
          </button>
          {!isBonus && onBonusRound && (
            <button className="start-btn" onClick={onBonusRound}>
              <span>🎲 Bonus Round</span>
              <span className="btn-heart">✨</span>
            </button>
          )}
          <button className="start-btn start-btn--ghost" onClick={onReplay}>
            <span>Play Again</span>
            <span className="btn-heart">♥</span>
          </button>
        </div>

        <p className="exit-sign">made with ♥ just for you</p>
      </div>
    </div>
  );
}
