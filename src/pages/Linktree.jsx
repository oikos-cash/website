import { useState } from 'react';
import Logo from '../assets/logo.svg';

// Configure your links here
const LINKTREE_CONFIG = {
  profile: {
    name: "Oikos Protocol",
    description: "Next-gen DeFi Launchpad",
    avatar: Logo,
  },
  links: [
    {
      title: "Launch App",
      url: "https://app.oikos.cash",
      icon: "fas fa-rocket",
    },
    {
      title: "Documentation",
      url: "https://docs.oikos.cash",
      icon: "fas fa-book",
    },
    {
      title: "Twitter / X",
      url: "https://twitter.com/oikos_cash",
      icon: "fab fa-twitter",
    },
    {
      title: "Discord",
      url: "https://discord.gg/Pk6uTsyv3K",
      icon: "fab fa-discord",
    },
    {
      title: "Telegram",
      url: "https://t.me/oikoscash",
      icon: "fab fa-telegram",
    },
    {
      title: "GitHub",
      url: "https://github.com/oikos-cash",
      icon: "fab fa-github",
    },
  ],
  theme: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
    cardBg: "rgba(42, 42, 42, 0.8)",
    cardHoverBg: "rgba(245, 200, 67, 0.15)",
    textColor: "#ffffff",
    accentColor: "#f5c843",
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    background: LINKTREE_CONFIG.theme.background,
    padding: '40px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '480px',
    width: '100%',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  avatarContainer: {
    borderRadius: '50%',
    border: `3px solid ${LINKTREE_CONFIG.theme.accentColor}`,
    padding: '4px',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  profileName: {
    color: LINKTREE_CONFIG.theme.textColor,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
  },
  profileDescription: {
    color: '#aaa',
    fontSize: '1rem',
    textAlign: 'center',
    margin: 0,
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  linkCard: {
    background: LINKTREE_CONFIG.theme.cardBg,
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  linkCardHover: {
    background: LINKTREE_CONFIG.theme.cardHoverBg,
    borderColor: LINKTREE_CONFIG.theme.accentColor,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(245, 200, 67, 0.2)',
  },
  linkContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  linkIcon: {
    color: LINKTREE_CONFIG.theme.accentColor,
    fontSize: '1.1rem',
  },
  linkTitle: {
    color: LINKTREE_CONFIG.theme.textColor,
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
  },
  footer: {
    paddingTop: '32px',
    paddingBottom: '16px',
    textAlign: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: '0.875rem',
    margin: 0,
  },
};

function LinkCard({ link }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles.linkCard,
        ...(isHovered ? styles.linkCardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.linkContent}>
        {link.icon && (
          <div style={styles.linkIcon}>
            <i className={link.icon} />
          </div>
        )}
        <div>
          <p style={styles.linkTitle}>{link.title}</p>
        </div>
      </div>
    </a>
  );
}

function Linktree() {
  const { profile, links } = LINKTREE_CONFIG;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Profile Section */}
        <div style={styles.profileSection}>
          <div style={styles.avatarContainer}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={styles.avatar}
            />
          </div>
          <h1 style={styles.profileName}>{profile.name}</h1>
          <p style={styles.profileDescription}>{profile.description}</p>
        </div>

        {/* Links Section */}
        <div style={styles.linksSection}>
          {links.map((link, index) => (
            <LinkCard key={index} link={link} />
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Powered by Oikos Protocol</p>
        </div>
      </div>
    </div>
  );
}

export default Linktree;
