import { useState } from 'react';
import { TEAM_MEMBERS } from '../../data/team';

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialIcons = { twitter: TwitterIcon, github: GitHubIcon, linkedin: LinkedInIcon };

function SocialLink({ type, url }) {
  const [hovered, setHovered] = useState(false);
  const Icon = socialIcons[type];
  if (!Icon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: hovered ? 'rgba(248, 189, 69, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${hovered ? 'rgba(248, 189, 69, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? 'var(--accent-primary)' : '#9ca3af',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <Icon />
    </a>
  );
}

function MemberCard({ member }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'center',
        padding: '2rem 1.5rem 1.5rem',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
    >
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: '-3px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }} />
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #0a0a0a',
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />
          ) : (
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {member.initials}
            </span>
          )}
        </div>
      </div>

      <h4 style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 4px 0',
      }}>{member.name}</h4>

      <p style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--accent-primary)',
        margin: '0 0 0.75rem 0',
        textShadow: 'none',
      }}>{member.role}</p>

      <p style={{
        fontSize: '0.9rem',
        lineHeight: 1.5,
        color: '#9ca3af',
        margin: '0 0 1rem 0',
        textShadow: 'none',
      }}>{member.shortBio || member.bio}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {Object.entries(member.socials).map(([type, url]) => (
          <SocialLink key={type} type={type} url={url} />
        ))}
      </div>
    </div>
  );
}

export default function TeamSlide({ isActive }) {
  return (
    <div id="team-section" className={`slide ${isActive ? 'active' : ''}`}>
      <div className="content-wrapper">
        <h3>Team</h3>
        <h2>The Builders Behind Oikos</h2>

        <div className="grid-3" style={{
          display: 'grid',
          // Centres however many cards the roster holds — see .team-grid in
          // src/pages/Team.jsx for the same treatment on the standalone page.
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 300px))',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '2rem',
        }}>
          {TEAM_MEMBERS.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
