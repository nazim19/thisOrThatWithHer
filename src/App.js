import React, { useState } from 'react';
import './App.css';
import EntryPage from './components/EntryPage';
import QuestionPage from './components/QuestionPage';
import HandoffPage from './components/HandoffPage';
import ScorePage from './components/ScorePage';

const TOTAL = 15;

export default function App() {
  // phase: 'entry' | 'player1' | 'handoff' | 'player2' | 'score'
  const [phase, setPhase] = useState('entry');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  const transition = (fn) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { fn(); setTransitioning(false); }, 300);
  };

  const handleStart = () => {
    transition(() => {
      setPlayer1Answers([]);
      setPlayer2Answers([]);
      setQuestionIndex(0);
      setPhase('player1');
    });
  };

  const handlePlayer1Answer = (answer) => {
    const updated = [...player1Answers, answer];
    setPlayer1Answers(updated);
    if (questionIndex + 1 >= TOTAL) {
      transition(() => { setPhase('handoff'); setQuestionIndex(0); });
    } else {
      transition(() => setQuestionIndex(questionIndex + 1));
    }
  };

  const handleHandoffDone = () => {
    transition(() => setPhase('player2'));
  };

  const handlePlayer2Answer = (answer) => {
    const updated = [...player2Answers, answer];
    setPlayer2Answers(updated);
    if (questionIndex + 1 >= TOTAL) {
      transition(() => setPhase('score'));
    } else {
      transition(() => setQuestionIndex(questionIndex + 1));
    }
  };

  const handleReplay = () => {
    transition(() => setPhase('entry'));
  };

  return (
    <div className={`app-root ${transitioning ? 'page-exit' : 'page-enter'}`}>
      {phase === 'entry' && <EntryPage onStart={handleStart} />}

      {phase === 'player1' && (
        <QuestionPage
          key={`p1-${questionIndex}`}
          index={questionIndex}
          onAnswer={handlePlayer1Answer}
          isGuessing={false}
        />
      )}

      {phase === 'handoff' && <HandoffPage onReady={handleHandoffDone} />}

      {phase === 'player2' && (
        <QuestionPage
          key={`p2-${questionIndex}`}
          index={questionIndex}
          onAnswer={handlePlayer2Answer}
          isGuessing={true}
        />
      )}

      {phase === 'score' && (
        <ScorePage
          player1Answers={player1Answers}
          player2Answers={player2Answers}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}
