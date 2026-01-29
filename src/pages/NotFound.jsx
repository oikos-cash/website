import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    textAlign: 'center',
    zIndex: 10,
    maxWidth: '600px',
  },
  glitchContainer: {
    position: 'relative',
    marginBottom: '24px',
  },
  errorCode: {
    fontSize: 'clamp(100px, 20vw, 200px)',
    fontWeight: 'bold',
    color: '#f5c843',
    margin: 0,
    lineHeight: 1,
    textShadow: '0 0 40px rgba(245, 200, 67, 0.3)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  logo: {
    width: '80px',
    height: '80px',
    marginBottom: '24px',
    opacity: 0.8,
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    color: '#ffffff',
    margin: '0 0 16px 0',
    fontWeight: '600',
  },
  message: {
    fontSize: '1.1rem',
    color: '#888',
    margin: '0 0 40px 0',
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #f5c843 0%, #d4a82a 100%)',
    color: '#0a0a0a',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
  },
  secondaryButton: {
    background: 'transparent',
    color: '#f5c843',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    border: '2px solid #f5c843',
    cursor: 'pointer',
    display: 'inline-block',
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: '#f5c843',
    borderRadius: '50%',
    opacity: 0.6,
  },
  orbitContainer: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  orbit: {
    position: 'absolute',
    border: '1px solid rgba(245, 200, 67, 0.1)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const keyframesStyle = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
`;

function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 4}px`,
    }))
  );

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.particle,
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `twinkle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </>
  );
}

function Orbits() {
  const orbits = [
    { size: 200, duration: '20s', opacity: 0.15 },
    { size: 300, duration: '30s', opacity: 0.1 },
    { size: 400, duration: '40s', opacity: 0.05 },
  ];

  return (
    <div style={styles.orbitContainer}>
      {orbits.map((orbit, i) => (
        <div
          key={i}
          style={{
            ...styles.orbit,
            width: `${orbit.size}px`,
            height: `${orbit.size}px`,
            borderColor: `rgba(245, 200, 67, ${orbit.opacity})`,
            animation: `orbit ${orbit.duration} linear infinite${i % 2 ? ' reverse' : ''}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: '#f5c843',
              borderRadius: '50%',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 10px rgba(245, 200, 67, 0.5)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function NotFound() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.container}>
      <style>{keyframesStyle}</style>
      <FloatingParticles />
      <Orbits />

      <div style={styles.content}>
        <img src={Logo} alt="Oikos" style={styles.logo} />

        <div style={styles.glitchContainer}>
          <h1 style={styles.errorCode}>404</h1>
        </div>

        <h2 style={styles.title}>Lost in the DeFi Cosmos</h2>
        <p style={styles.message}>
          The page you're looking for has drifted into the void.
          Perhaps it was never minted, or maybe it's just on another chain.
        </p>

        <div style={styles.buttonContainer}>
          <Link
            to="/"
            style={{
              ...styles.primaryButton,
              ...(hovered === 'primary' ? {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(245, 200, 67, 0.4)',
              } : {}),
            }}
            onMouseEnter={() => setHovered('primary')}
            onMouseLeave={() => setHovered(null)}
          >
            Return Home
          </Link>
          <a
            href="https://app.oikos.cash"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.secondaryButton,
              ...(hovered === 'secondary' ? {
                background: 'rgba(245, 200, 67, 0.1)',
                transform: 'translateY(-2px)',
              } : {}),
            }}
            onMouseEnter={() => setHovered('secondary')}
            onMouseLeave={() => setHovered(null)}
          >
            Launch App
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
