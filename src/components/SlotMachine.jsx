import { useState, useEffect, useRef } from 'react';
import { SLOT_EMOJIS } from '../utils/rewards';

const REEL_SIZE = 20;
const SPIN_DURATION = [1200, 1800, 2400];

function buildReel(finalEmoji) {
  const reel = [];
  for (let i = 0; i < REEL_SIZE - 1; i++) {
    reel.push(SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]);
  }
  reel.push(finalEmoji);
  return reel;
}

function Reel({ emojis, spinning, duration, finalEmoji, onStop }) {
  const ref = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (spinning) {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i = (i + 1) % emojis.length;
        setCurrentIdx(i);
      }, 80);
      setTimeout(() => {
        clearInterval(intervalRef.current);
        setCurrentIdx(emojis.length - 1);
        onStop && onStop();
      }, duration);
    }
    return () => clearInterval(intervalRef.current);
  }, [spinning, emojis, duration, onStop]);

  return (
    <div className="reel" ref={ref}>
      <div className="reel-window">
        <span className={`reel-emoji ${spinning ? 'spinning' : 'stopped'}`}>
          {emojis[currentIdx]}
        </span>
      </div>
    </div>
  );
}

export default function SlotMachine({ reward, onComplete }) {
  const [spinning, setSpinning] = useState([false, false, false]);
  const [stopped, setStopped] = useState([false, false, false]);
  const [reels, setReels] = useState([[], [], []]);
  const [started, setStarted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (reward) {
      const newReels = [
        buildReel(reward.emoji),
        buildReel(reward.emoji),
        buildReel(reward.emoji),
      ];
      setReels(newReels);
      setStarted(false);
      setShowReward(false);
      setStopped([false, false, false]);
    }
  }, [reward]);

  function startSpin() {
    setShowReward(false);
    setStopped([false, false, false]);
    setSpinning([true, true, true]);
    setStarted(true);
  }

  function handleStop(idx) {
    setStopped(prev => {
      const next = [...prev];
      next[idx] = true;
      if (next.every(Boolean)) {
        setTimeout(() => {
          setShowReward(true);
          generateSparkles();
          onComplete && onComplete();
        }, 400);
      }
      return next;
    });
  }

  function generateSparkles() {
    const sp = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 12,
      delay: Math.random() * 0.5,
    }));
    setSparkles(sp);
    setTimeout(() => setSparkles([]), 2000);
  }

  if (!reward) return null;

  const tierColor = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c'];
  const color = tierColor[(reward.tier || 1) - 1];

  return (
    <div className="slot-machine-container">
      <div className="slot-machine" style={{ '--tier-color': color }}>
        <div className="slot-header">
          <span className="slot-title">🎰 SPIN THE REELS 🎰</span>
        </div>
        <div className="reels-container">
          {reels.map((r, i) => (
            <Reel
              key={i}
              emojis={r.length > 0 ? r : ['🎰']}
              spinning={spinning[i]}
              duration={SPIN_DURATION[i]}
              finalEmoji={reward.emoji}
              onStop={() => handleStop(i)}
            />
          ))}
        </div>
        {!started && (
          <button className="btn-spin" onClick={startSpin}>
            🎰 SPIN!
          </button>
        )}
        {showReward && (
          <div className="reward-reveal" style={{ '--tier-color': color }}>
            {sparkles.map(s => (
              <div
                key={s.id}
                className="sparkle"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  background: color,
                }}
              />
            ))}
            <div className="reward-emoji-big">{reward.emoji}</div>
            <div className="reward-label">{reward.label}</div>
            <div className="reward-tier">Tier {reward.tier} Reward!</div>
            <div className="effort-score">Effort Score: {Math.round(reward.effortScore)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
