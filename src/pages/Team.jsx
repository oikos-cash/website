import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { TEAM_MEMBERS } from '../data/team';

const keyframesStyle = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }
  @media (max-width: 900px) {
    .team-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 600px) {
    .team-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #1a1a1a 100%)',
    padding: '80px 20px 60px',
    position: 'relative',
    overflow: 'hidden',
  },
  particles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: '3px',
    height: '3px',
    background: '#f5c843',
    borderRadius: '50%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    width: '56px',
    height: '56px',
    marginBottom: '20px',
    opacity: 0.9,
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '32px',
    transition: 'color 0.2s',
  },
  pageTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '800',
    margin: '0 0 12px 0',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #9ca3af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.1,
  },
  pageSubtitle: {
    fontSize: '1.15rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.6,
  },
  // grid styles moved to CSS class .team-grid for responsive breakpoints
  card: {
    background: 'rgba(22, 27, 34, 0.5)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '40px 28px 32px',
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    border: '1px solid rgba(245, 200, 67, 0.3)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 200, 67, 0.08)',
    background: 'rgba(22, 27, 34, 0.7)',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #f5c843, transparent)',
    opacity: 0,
    transition: 'opacity 0.4s',
  },
  cardGlowActive: {
    opacity: 1,
  },
  avatarContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    margin: '0 auto 20px',
    position: 'relative',
  },
  avatarRing: {
    position: 'absolute',
    inset: '-3px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f5c843, #d4a82a, #8D6108)',
    opacity: 0.6,
    transition: 'opacity 0.4s',
  },
  avatarRingHover: {
    opacity: 1,
  },
  avatarInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '3px solid #0a0a0a',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  avatarInitials: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#f5c843',
    letterSpacing: '1px',
  },
  name: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '-0.2px',
  },
  role: {
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#f5c843',
    margin: '0 0 16px 0',
  },
  bio: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#9ca3af',
    margin: '0 0 24px 0',
    textShadow: 'none',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  socialLink: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
  },
  socialLinkHover: {
    background: 'rgba(245, 200, 67, 0.15)',
    borderColor: 'rgba(245, 200, 67, 0.4)',
    color: '#f5c843',
    transform: 'translateY(-2px)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '60px',
    position: 'relative',
    zIndex: 10,
  },
  footerText: {
    color: '#555',
    fontSize: '0.85rem',
    margin: 0,
  },
  disclaimer: {
    color: '#444',
    fontSize: '0.7rem',
    lineHeight: 1.6,
    maxWidth: '700px',
    margin: '16px auto 0',
    textAlign: 'center',
  },
};

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialIcons = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

function SocialButton({ type, url }) {
  const [hovered, setHovered] = useState(false);
  const Icon = socialIcons[type];
  if (!Icon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles.socialLink,
        ...(hovered ? styles.socialLinkHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <Icon />
    </a>
  );
}

function TeamCard({ member, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? 'translateY(-8px)' : 'translateY(0)'
          : 'translateY(30px)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        ...styles.cardGlow,
        ...(hovered ? styles.cardGlowActive : {}),
      }} />

      <div style={styles.avatarContainer}>
        <div style={{
          ...styles.avatarRing,
          ...(hovered ? styles.avatarRingHover : {}),
        }} />
        <div style={styles.avatarInner}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} style={styles.avatarImage} />
          ) : (
            <span style={styles.avatarInitials}>{member.initials}</span>
          )}
        </div>
      </div>

      <h3 style={styles.name}>{member.name}</h3>
      <p style={styles.role}>{member.role}</p>
      <p style={styles.bio}>{member.bio}</p>

      <div style={styles.socialLinks}>
        {Object.entries(member.socials).map(([type, url]) => (
          <SocialButton key={type} type={type} url={url} />
        ))}
      </div>
    </div>
  );
}

function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 3}px`,
    }))
  );

  return (
    <div style={styles.particles}>
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
    </div>
  );
}

export default function Team() {
  return (
    <div style={styles.container}>
      <style>{keyframesStyle}</style>
      <FloatingParticles />

      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <span>&larr;</span> Back to Home
        </Link>
        <h1 style={styles.pageTitle}>Our Team</h1>
        <p style={styles.pageSubtitle}>
          The builders behind Oikos Protocol
        </p>
      </div>

      <div className="team-grid">
        {TEAM_MEMBERS.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>Oikos Protocol</p>
        <p style={styles.disclaimer}>
          Notice: The profiles and biographical information provided on this page are for informational and professional background purposes only. The individuals listed, including founders, early token investors, and external consultants, provide technical strategy, operational insights, and ecosystem support based on their respective professional histories.
        </p>
        <p style={styles.disclaimer}>
          Nothing contained within these profiles or this website constitutes financial, legal, or investment advice. No information here represents a solicitation, recommendation, or endorsement to buy, sell, or hold any digital assets or securities. Users are encouraged to conduct their own due diligence and consult with professional advisors before engaging with decentralized protocols or digital assets.
        </p>
      </div>
    </div>
  );
}
