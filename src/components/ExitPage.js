import React, { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts';

export default function ExitPage({ answers }) {
  const [visible, setVisible] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowAnswers(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="page exit-page">
      <FloatingHearts />
      <div className={`exit-content ${visible ? 'fade-in' : ''}`}>
        <div className="exit-heart-big">♥</div>
        <h1 className="exit-title">That's so you.</h1>
        <p className="exit-desc">
          Every answer, a little window into your beautiful mind.
          <br />I love every single thing about you.
        </p>

        {showAnswers && (
          <div className="answers-grid fade-in">
            {answers.map((a, i) => (
              <div key={i} className="answer-chip">
                <span className="answer-q">{a.question}</span>
                <span className="answer-divider">→</span>
                <span className="answer-choice">{a.choice}</span>
              </div>
            ))}
          </div>
        )}

        <p className="exit-sign">made with ♥ just for you</p>
      </div>
    </div>
  );
}
