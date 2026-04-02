import { useState, useEffect, useRef } from 'react';
import './App.css';

const EMOJIS = ['💩', '🚽', '🧻', '📱', '💧', '🧼', '🌟', '🦄', '🎉', '🏆'];

const getDailySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function Bubble({ id, containerWidth, containerHeight, onPop }) {
  const [popped, setPopped] = useState(false);
  const [easterEgg, setEasterEgg] = useState(null);
  const bubbleRef = useRef(null);

  const size = useRef(randomInRange(60, 100));
  const hasEasterEgg = useRef(Math.random() > 0.85);
  const eggContent = useRef(hasEasterEgg.current ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null);

  const hue = useRef(randomInRange(200, 260));

  // Physics state
  const pos = useRef({
    x: randomInRange(0, Math.max(50, containerWidth - size.current)),
    y: randomInRange(0, Math.max(50, containerHeight - size.current))
  });
  const velocity = useRef({
    vx: (randomInRange(0.5, 1.5)) * (Math.random() > 0.5 ? 1 : -1),
    vy: (randomInRange(0.5, 1.5)) * (Math.random() > 0.5 ? 1 : -1)
  });

  useEffect(() => {
    let animationFrameId;

    const updatePhysics = () => {
      let { x, y } = pos.current;
      let { vx, vy } = velocity.current;
      const s = size.current;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx *= -1; }
      if (x + s >= containerWidth) { x = containerWidth - s; vx *= -1; }
      if (y <= 0) { y = 0; vy *= -1; }
      if (y + s >= containerHeight) { y = containerHeight - s; vy *= -1; }

      pos.current = { x, y };
      velocity.current = { vx, vy };

      if (bubbleRef.current) {
        // use 3d transform for better hardware acceleration
        bubbleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      
      // continue animating even if popped, otherwise it freezes awkwardly
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    if (containerWidth > 0 && containerHeight > 0) {
      animationFrameId = requestAnimationFrame(updatePhysics);
    }
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    if (popped) {
      const timer = setTimeout(() => {
        setPopped(false);
        hasEasterEgg.current = Math.random() > 0.85;
        eggContent.current = hasEasterEgg.current ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null;
      }, 5000 + randomInRange(2000, 10000));
      return () => clearTimeout(timer);
    }
  }, [popped]);

  const pop = () => {
    if (popped) return;
    if (navigator.vibrate) navigator.vibrate(10);
    setPopped(true);
    setEasterEgg(eggContent.current);
    if (onPop) onPop(eggContent.current !== null);
  };

  return (
    <div 
      ref={bubbleRef}
      className={`bubble-container ${popped ? 'popped' : ''}`}
      style={{
        width: size.current,
        height: size.current,
        '--hue': hue.current
      }}
      onClick={pop}
    >
      <div className="bubble">
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
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
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      localStorage.setItem('crappStreak', currentStreak);
      localStorage.setItem('crappLastLogin', todayStr);
    }
    setStreak(currentStreak);

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

      <main className="bubble-wrap-area" ref={containerRef}>
        {dimensions.width > 0 && Array.from({ length: 42 }).map((_, i) => (
          <Bubble key={i} id={i} containerWidth={dimensions.width} containerHeight={dimensions.height} />
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
