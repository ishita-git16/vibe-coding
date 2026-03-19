import { useState, useEffect } from 'react';
import './App.css';
import StudyLogForm from './components/StudyLogForm';
import SlotMachine from './components/SlotMachine';
import ProgressHistory from './components/ProgressHistory';
import Stats from './components/Stats';
import { getLogs, saveLog } from './utils/storage';
import { getReward } from './utils/rewards';

function calcStreak(logs) {
  if (!logs.length) return 0;
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const today = new Date();
  today.setHours(0,0,0,0);
  let streak = 0;
  let expected = new Date(today);
  for (const log of sorted) {
    const d = new Date(log.date); d.setHours(0,0,0,0);
    if (d.getTime() === expected.getTime()) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else if (d < expected) {
      break;
    }
  }
  return streak;
}

const DOTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  left: Math.random() * 100,
  duration: 12 + Math.random() * 20,
  delay: Math.random() * 15,
  color: ['#ffd700','#c77dff','#00d4ff','#39ff14'][Math.floor(Math.random() * 4)],
}));

export default function App() {
  const [logs, setLogs] = useState([]);
  const [currentReward, setCurrentReward] = useState(null);
  const [notification, setNotification] = useState('');
  const [phase, setPhase] = useState('form'); // 'form' | 'slot'

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  function handleLog(entry) {
    const reward = getReward(entry.studyHours, entry.mockScore);
    const logEntry = { ...entry, reward, id: Date.now() };
    const updated = saveLog(logEntry);
    setLogs(updated);
    setCurrentReward(reward);
    setPhase('slot');
  }

  function handleSlotComplete() {
    setNotification(`🎉 You earned: ${currentReward.emoji} ${currentReward.label}!`);
    setTimeout(() => setNotification(''), 4000);
  }

  function handleNewEntry() {
    setPhase('form');
    setCurrentReward(null);
  }

  const streak = calcStreak(logs);

  return (
    <div>
      <div className="decorative-dots">
        {DOTS.map(d => (
          <div
            key={d.id}
            className="dot"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.left}%`,
              bottom: '-10px',
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              background: d.color,
            }}
          />
        ))}
      </div>

      <header className="app-header">
        <div className="app-title">🎓 GMAT ACE</div>
        <div className="app-subtitle">Study. Grind. Reward. Repeat.</div>
      </header>

      <main className="app-main">
        <div className="top-section">
          <div className="card">
            {phase === 'form' ? (
              <StudyLogForm onSubmit={handleLog} />
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
                  Session logged! Check your reward 👇
                </p>
                <button className="btn-primary" onClick={handleNewEntry}>
                  + Log Another Session
                </button>
              </div>
            )}
          </div>
          <div className="card">
            <Stats logs={logs} streak={streak} />
          </div>
        </div>

        {phase === 'slot' && currentReward && (
          <div className="card">
            <SlotMachine reward={currentReward} onComplete={handleSlotComplete} />
          </div>
        )}

        <div className="card">
          <ProgressHistory logs={logs} />
        </div>
      </main>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}
