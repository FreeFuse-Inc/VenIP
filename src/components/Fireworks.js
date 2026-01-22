import React, { useState, useEffect } from 'react';
import '../styles/Fireworks.css';

const Fireworks = ({ isActive, duration = 5000 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = ['#D4AF37', '#8B5CF6', '#FFD93D', '#FF6B6B', '#87CEEB'];
    const newParticles = [];

    for (let i = 0; i < 50; i++) {
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      newParticles.push({
        id: i,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2,
        duration: 2 + Math.random() * 1,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fireworks-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="firework-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Fireworks;
