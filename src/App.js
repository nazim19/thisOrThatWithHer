import React, { useState, useCallback } from 'react';
import './App.css';
import EntryPage    from './components/EntryPage';
import NamePage     from './components/NamePage';
import QuestionPage from './components/QuestionPage';
import HandoffPage  from './components/HandoffPage';
import ScorePage    from './components/ScorePage';
import { QUESTIONS, WYR_QUESTIONS } from './questions';

// phases: entry | names | p1 | handoff | p2 | score | wyr_p1 | wyr_handoff | wyr_p2 | wyr_score

export default function App() {
  const [phase, setPhase]             = useState('entry');
  const [questionIndex, setQIndex]    = useState(0);
  const [player1Answers, setP1]       = useState([]);
  const [player2Answers, setP2]       = useState([]);
  const [wyrP1Answers, setWyrP1]      = useState([]);
  const [wyrP2Answers, setWyrP2]      = useState([]);
  const [streak, setStreak]           = useState(0);
  const [transitioning, setTrans]     = useState(false);
  const [names, setNames]             = useState({ p1: 'Him', p2: 'Her' });
  const [hiddenMessage, setHiddenMsg] = useState('');
  const [timerEnabled, setTimer]      = useState(false);

  const go = useCallback((fn) => {
    if (transitioning) return;
    setTrans(true);
    setTimeout(() => { fn(); setTrans(false); }, 280);
  }, [transitioning]);

  // ── Entry ──────────────────────────────────────
  const handleEntry = () => go(() => setPhase('names'));

  // ── Names / settings ──────────────────────────
  const handleNames = ({ p1Name, p2Name, hiddenMessage: msg, timerEnabled: timer }) => {
    setNames({ p1: p1Name, p2: p2Name });
    setHiddenMsg(msg);
    setTimer(timer);
    go(() => {
      setP1([]); setP2([]); setQIndex(0); setStreak(0);
      setPhase('p1');
    });
  };

  // ── Player 1 answers ──────────────────────────
  const handleP1Answer = (answer) => {
    const updated = [...player1Answers, answer];
    setP1(updated);
    if (updated.length >= QUESTIONS.length) {
      go(() => { setQIndex(0); setPhase('handoff'); });
    } else {
      go(() => setQIndex(i => i + 1));
    }
  };

  // ── Handoff ───────────────────────────────────
  const handleHandoff = () => go(() => { setStreak(0); setPhase('p2'); });

  // ── Player 2 guesses ──────────────────────────
  const handleP2Answer = (answer) => {
    const correct = answer.choice === player1Answers[questionIndex]?.choice;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    const updated = [...player2Answers, answer];
    setP2(updated);
    if (updated.length >= QUESTIONS.length) {
      go(() => setPhase('score'));
    } else {
      go(() => setQIndex(i => i + 1));
    }
  };

  // ── Score → Bonus round ───────────────────────
  const handleBonusRound = () => go(() => {
    setWyrP1([]); setWyrP2([]); setQIndex(0); setStreak(0);
    setPhase('wyr_p1');
  });

  // ── WYR Player 1 ──────────────────────────────
  const handleWyrP1Answer = (answer) => {
    const updated = [...wyrP1Answers, answer];
    setWyrP1(updated);
    if (updated.length >= WYR_QUESTIONS.length) {
      go(() => { setQIndex(0); setPhase('wyr_handoff'); });
    } else {
      go(() => setQIndex(i => i + 1));
    }
  };

  // ── WYR Handoff ───────────────────────────────
  const handleWyrHandoff = () => go(() => { setStreak(0); setPhase('wyr_p2'); });

  // ── WYR Player 2 ──────────────────────────────
  const handleWyrP2Answer = (answer) => {
    const correct = answer.choice === wyrP1Answers[questionIndex]?.choice;
    setStreak(correct ? streak + 1 : 0);
    const updated = [...wyrP2Answers, answer];
    setWyrP2(updated);
    if (updated.length >= WYR_QUESTIONS.length) {
      go(() => setPhase('wyr_score'));
    } else {
      go(() => setQIndex(i => i + 1));
    }
  };

  // ── Replay ────────────────────────────────────
  const handleReplay = () => go(() => {
    setP1([]); setP2([]); setWyrP1([]); setWyrP2([]);
    setQIndex(0); setStreak(0);
    setPhase('entry');
  });

  return (
    <div className={`app-root ${transitioning ? 'page-exit' : 'page-enter'}`}>

      {phase === 'entry' && <EntryPage onStart={handleEntry} />}

      {phase === 'names' && <NamePage onStart={handleNames} />}

      {phase === 'p1' && (
        <QuestionPage
          key={`p1-${questionIndex}`}
          questions={QUESTIONS}
          index={questionIndex}
          onAnswer={handleP1Answer}
          isGuessing={false}
          timerEnabled={timerEnabled}
          timeLimit={10}
          p1Name={names.p1}
          p2Name={names.p2}
        />
      )}

      {phase === 'handoff' && (
        <HandoffPage
          onReady={handleHandoff}
          p1Name={names.p1}
          p2Name={names.p2}
          isWYR={false}
        />
      )}

      {phase === 'p2' && (
        <QuestionPage
          key={`p2-${questionIndex}`}
          questions={QUESTIONS}
          index={questionIndex}
          onAnswer={handleP2Answer}
          isGuessing={true}
          p1Answer={player1Answers[questionIndex]?.choice ?? null}
          streak={streak}
          timerEnabled={timerEnabled}
          timeLimit={10}
          p1Name={names.p1}
          p2Name={names.p2}
        />
      )}

      {phase === 'score' && (
        <ScorePage
          player1Answers={player1Answers}
          player2Answers={player2Answers}
          names={names}
          hiddenMessage={hiddenMessage}
          onReplay={handleReplay}
          onBonusRound={handleBonusRound}
          isBonus={false}
        />
      )}

      {phase === 'wyr_p1' && (
        <QuestionPage
          key={`wyr1-${questionIndex}`}
          questions={WYR_QUESTIONS}
          index={questionIndex}
          onAnswer={handleWyrP1Answer}
          isGuessing={false}
          timerEnabled={timerEnabled}
          timeLimit={10}
          p1Name={names.p1}
          p2Name={names.p2}
        />
      )}

      {phase === 'wyr_handoff' && (
        <HandoffPage
          onReady={handleWyrHandoff}
          p1Name={names.p1}
          p2Name={names.p2}
          isWYR={true}
        />
      )}

      {phase === 'wyr_p2' && (
        <QuestionPage
          key={`wyr2-${questionIndex}`}
          questions={WYR_QUESTIONS}
          index={questionIndex}
          onAnswer={handleWyrP2Answer}
          isGuessing={true}
          p1Answer={wyrP1Answers[questionIndex]?.choice ?? null}
          streak={streak}
          timerEnabled={timerEnabled}
          timeLimit={10}
          p1Name={names.p1}
          p2Name={names.p2}
        />
      )}

      {phase === 'wyr_score' && (
        <ScorePage
          player1Answers={wyrP1Answers}
          player2Answers={wyrP2Answers}
          names={names}
          hiddenMessage=""
          onReplay={handleReplay}
          onBonusRound={null}
          isBonus={true}
        />
      )}

    </div>
  );
}
