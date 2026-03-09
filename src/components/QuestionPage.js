import React, { useState, useEffect, useCallback } from 'react';
import FloatingHearts from './FloatingHearts';
import { QUESTIONS } from '../questions';

const RADIUS = 20;
const CIRC = 2 * Math.PI * RADIUS;

export default function QuestionPage({
  questions = QUESTIONS,
  index,
  onAnswer,
  isGuessing = false,
  p1Answer = null,
  streak = 0,
  timerEnabled = false,
  timeLimit = 10,
  p1Name = 'Him',
  p2Name = 'Her',
}) {
  const q = questions[index];
  const [selected, setSelected]   = useState(null);
  const [feedback, setFeedback]   = useState(null); // 'correct' | 'wrong'
  const [entered, setEntered]     = useState(false);
  const [timeLeft, setTimeLeft]   = useState(timeLimit);

  // Reset on question change
  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    setTimeLeft(timeLimit);
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [index, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (!timerEnabled || selected || feedback) return;
    if (timeLeft <= 0) {
      onAnswer({ question: q.question, choice: null });
      return;
    }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerEnabled, selected, feedback, q, onAnswer]);

  const handleChoice = useCallback((choice) => {
    if (selected || feedback) return;
    setSelected(choice);

    if (isGuessing && p1Answer !== null) {
      const correct = choice === p1Answer;
      setFeedback(correct ? 'correct' : 'wrong');
      setTimeout(() => onAnswer({ question: q.question, choice }), 1100);
    } else {
      setTimeout(() => onAnswer({ question: q.question, choice }), 550);
    }
  }, [selected, feedback, isGuessing, p1Answer, q, onAnswer]);

  const progress = index / questions.length;
  const dashOffset = CIRC * (1 - timeLeft / timeLimit);
  const timerDanger = timeLeft <= 3;

  return (
    <div className="page question-page">
      <FloatingHearts />

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="progress-label">{index} / {questions.length}</span>
      </div>

      {/* Player banner */}
      <div className={`player-banner ${isGuessing ? 'player-banner--guess' : 'player-banner--you'}`}>
        {isGuessing
          ? `💕 ${p2Name}'s Turn — Guess his answer`
          : `💙 ${p1Name}'s Turn — Answer honestly`}
      </div>

      {/* Streak badge */}
      {isGuessing && streak >= 2 && (
        <div key={streak} className="streak-badge">🔥 {streak} in a row!</div>
      )}

      <div className={`question-card ${entered ? 'card-enter' : 'card-hidden'}`}>
        <p className="question-number">Question {index + 1}</p>
        <h2 className="question-text">{q.question}</h2>

        {isGuessing && !feedback && (
          <p className="guess-hint">What do you think {p1Name} picked?</p>
        )}

        {/* Timer */}
        {timerEnabled && !selected && (
          <div className="timer-wrap">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="26" cy="26" r={RADIUS}
                fill="none"
                stroke={timerDanger ? 'var(--rose)' : 'var(--rose-light)'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.95s linear, stroke 0.3s' }}
              />
              <text x="26" y="31" textAnchor="middle" fill="white" fontSize="13" fontFamily="Lato,sans-serif"
                style={{ fontWeight: timerDanger ? 700 : 400 }}>
                {timeLeft}
              </text>
            </svg>
          </div>
        )}

        <div className="choices" style={{ position: 'relative' }}>
          <button
            className={`choice-btn choice-a
              ${selected === q.a ? 'chosen' : ''}
              ${selected && selected !== q.a ? 'unchosen' : ''}
              ${feedback && p1Answer === q.a ? 'correct-answer' : ''}`}
            onClick={() => handleChoice(q.a)}
          >
            <span className="choice-emoji">{q.emoji[0]}</span>
            <span className="choice-label">{q.a}</span>
          </button>

          <div className="or-badge">or</div>

          <button
            className={`choice-btn choice-b
              ${selected === q.b ? 'chosen' : ''}
              ${selected && selected !== q.b ? 'unchosen' : ''}
              ${feedback && p1Answer === q.b ? 'correct-answer' : ''}`}
            onClick={() => handleChoice(q.b)}
          >
            <span className="choice-emoji">{q.emoji[1]}</span>
            <span className="choice-label">{q.b}</span>
          </button>

          {/* Inline feedback overlay */}
          {feedback && (
            <div className={`feedback-overlay feedback-overlay--${feedback}`}>
              {feedback === 'correct' ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <span className="feedback-text">You got it!</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <span className="feedback-text">{p1Name} picked <strong>{p1Answer}</strong></span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
