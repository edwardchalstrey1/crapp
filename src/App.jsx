import { useState, useEffect, useRef } from 'react';
import './App.css';

const EMOJIS = ['💩', '🚽', '🧻', '📱', '💧', '🧼', '🌟', '🦄', '🎉', '🏆'];

// Generate a random daily seed so themed icons could be synchronized across users
const getDailySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function Bubble({ id, onPop }) {
  const [popped, setPopped] = useState(false);
  const [easterEgg, setEasterEgg] = useState(null);

  // Generate bubble uniqueness
  const size = useRef(randomInRange(60, 100));
  const hasEasterEgg = useRef(Math.random() > 0.85); // 15% chance
  const eggContent = useRef(hasEasterEgg.current ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null);
  const delay = useRef(randomInRange(0, 2));

  // Determine an animation/color characteristic based on ID so not all are identical
  const hue = useRef(randomInRange(200, 260));

  useEffect(() => {
    if (popped) {
      const timer = setTimeout(() => {
        setPopped(false);
        // Maybe change easter egg when it respawns
        hasEasterEgg.current = Math.random() > 0.85;
        eggContent.current = hasEasterEgg.current ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null;
      }, 5000 + randomInRange(2000, 10000));
      return () => clearTimeout(timer);
    }
  }, [popped]);

  const pop = () => {
    if (popped) return;
    if (navigator.vibrate) navigator.vibrate(10); // subtle haptic
    setPopped(true);
    setEasterEgg(eggContent.current);
    if (onPop) onPop(eggContent.current !== null);
  };

  return (
    <div 
      className={`bubble-container ${popped ? 'popped' : ''}`}
      style={{
        width: size.current,
        height: size.current,
        '--hue': hue.current,
        animationDelay: `${delay.current}s`
      }}
      onClick={pop}
    >
      <div className="bubble">
        {/* shine effect inside bubble */}
        <div className="bubble-shine" />
      </div>
      {popped && easterEgg && (
        <span className="easter-egg">{easterEgg}</span>
      )}
    </div>
  );
}

function App() {
  const [streak, setStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Streak logic
    const todayStr = new Date().toDateString();
    const lastLogin = localStorage.getItem('crappLastLogin');
    let currentStreak = parseInt(localStorage.getItem('crappStreak') || '0', 10);

    if (lastLogin !== todayStr) {
      if (lastLogin) {
        const lastDate = new Date(lastLogin);
        const diffTime = Math.abs(new Date() - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1; // broken
        }
      } else {
        currentStreak = 1;
      }
      localStorage.setItem('crappStreak', currentStreak);
      localStorage.setItem('crappLastLogin', todayStr);
    }
    setStreak(currentStreak);

    // Mock an anonymised leaderboard that moves/updates
    const seed = getDailySeed();
    setLeaderboard([
      { name: 'User' + ((seed * 7) % 9999), streak: currentStreak + 14 },
      { name: 'User' + ((seed * 11) % 9999), streak: currentStreak + 5 },
      { name: 'You (Anonymous)', streak: currentStreak, isMe: true },
      { name: 'User' + ((seed * 13) % 9999), streak: currentStreak > 2 ? currentStreak - 1 : currentStreak + 2 },
    ].sort((a,b) => b.streak - a.streak));

  }, []);

  return (
    <div className="crapp-app">
      <header className="glass-header">
        <h1 className="title">CrApp 💩</h1>
        <div className="streak-badge">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{streak} Day{streak !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="bubble-wrap-area">
        {/* Render a grid of bubbles */}
        {Array.from({ length: 42 }).map((_, i) => (
          <Bubble key={i} id={i} />
        ))}
      </main>

      <footer className="glass-footer leaderboard">
        <h2>Anonymous Leaderboard</h2>
        <div className="leaderboard-list">
          {leaderboard.map((user, idx) => (
            <div key={idx} className={`leaderboard-item ${user.isMe ? 'is-me' : ''}`}>
              <span className="rank">#{idx + 1}</span>
              <span className="name">{user.name}</span>
              <span className="score">{user.streak} 🔥</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
