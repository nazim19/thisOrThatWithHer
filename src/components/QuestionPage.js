import React, { useState, useEffect } from 'react';
import FloatingHearts from './FloatingHearts';

const QUESTIONS = [
  { question: 'Pizza or Burger?',         emoji: ['🍕', '🍔'], a: 'Pizza',          b: 'Burger'         },
  { question: 'Netflix or YouTube?',     emoji: ['🎬', '▶️'],  a: 'Netflix',         b: 'YouTube'        },
  { question: 'Late nights or Early mornings?', emoji: ['🌙', '⏰'], a: 'Late nights', b: 'Early mornings' },
  { question: 'Texting or Calling?',     emoji: ['💬', '📞'], a: 'Texting',         b: 'Calling'        },
  { question: 'Road trip or Flight?',    emoji: ['🚗', '✈️'],  a: 'Road trip',       b: 'Flight'         },
  { question: 'Spicy or Sweet?',         emoji: ['🌶️', '🍬'], a: 'Spicy',           b: 'Sweet'          },
  { question: 'City or Countryside?',    emoji: ['🌆', '🌿'], a: 'City',            b: 'Countryside'    },
  { question: 'Cuddles or Adventures?',  emoji: ['🤗', '🧗'], a: 'Cuddles',         b: 'Adventures'     },
  { question: 'Surprises or Plans?',     emoji: ['🎉', '📅'], a: 'Surprises',       b: 'Plans'          },
  { question: 'Heart or Mind?',          emoji: ['❤️', '🧠'], a: 'Heart',           b: 'Mind'           },
  { question: 'Stability or Excitement?',emoji: ['🏠', '🎢'], a: 'Stability',       b: 'Excitement'     },
  { question: 'Always honest or Always kind?', emoji: ['💬', '💕'], a: 'Always honest', b: 'Always kind' },
  { question: 'Give up music or Give up movies?', emoji: ['🎵', '🎬'], a: 'Give up music', b: 'Give up movies' },
  { question: 'Forgive easily or Hold your ground?', emoji: ['🕊️', '💪'], a: 'Forgive easily', b: 'Hold your ground' },
  { question: 'Dream big or Play it safe?', emoji: ['🌟', '🛡️'], a: 'Dream big',     b: 'Play it safe'   },
];

export default function QuestionPage({ index, onAnswer, isGuessing }) {
  const q = QUESTIONS[index];
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [index]);

  const handleChoice = (choice) => {
    if (selected || animating) return;
    setSelected(choice);
    setAnimating(true);
    setTimeout(() => {
      onAnswer({ question: q.question, choice });
      setAnimating(false);
    }, 750);
  };

  const progress = (index / QUESTIONS.length) * 100;

  return (
    <div className="page question-page">
      <FloatingHearts />

      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{index} / {QUESTIONS.length}</span>
      </div>

      {/* Player label banner */}
      <div className={`player-banner ${isGuessing ? 'player-banner--guess' : 'player-banner--you'}`}>
        {isGuessing ? '💕 Her Turn — Guess his answer' : '💙 His Turn — Answer honestly'}
      </div>

      <div className={`question-card ${entered ? 'card-enter' : 'card-hidden'}`}>
        <p className="question-number">Question {index + 1}</p>
        <h2 className="question-text">{q.question}</h2>

        {isGuessing && (
          <p className="guess-hint">What do you think he picked?</p>
        )}

        <div className="choices">
          <button
            className={`choice-btn choice-a ${selected === q.a ? 'chosen' : ''} ${selected && selected !== q.a ? 'unchosen' : ''}`}
            onClick={() => handleChoice(q.a)}
          >
            <span className="choice-emoji">{q.emoji[0]}</span>
            <span className="choice-label">{q.a}</span>
          </button>

          <div className="or-badge">or</div>

          <button
            className={`choice-btn choice-b ${selected === q.b ? 'chosen' : ''} ${selected && selected !== q.b ? 'unchosen' : ''}`}
            onClick={() => handleChoice(q.b)}
          >
            <span className="choice-emoji">{q.emoji[1]}</span>
            <span className="choice-label">{q.b}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { QUESTIONS };
