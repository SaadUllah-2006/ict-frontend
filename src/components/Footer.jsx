import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--dark)', color: 'var(--gray-light)', padding: '3rem 0 1.5rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>S</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>SSUET Events</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray)', lineHeight: 1 }}>Event Management Portal</div>
              </div>
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.7, color: 'var(--gray)' }}>
              Sir Syed University of Engineering &amp; Technology's official event management portal. Connecting students with opportunities.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[FiFacebook, FiTwitter, FiLinkedin, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-light)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--gray-light)'; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['/', 'Home'], ['/events', 'Browse Events'], ['/login', 'Student Login'], ['/register', 'Create Account'], ['/login', 'Admin Portal']].map(([path, label]) => (
                <Link key={label} to={path} style={{ fontSize: '0.825rem', color: 'var(--gray)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: <FiMapPin size={14} />, text: 'University Road, Karachi-75300, Pakistan' },
                { icon: <FiPhone size={14} />, text: '+92-21-34988000' },
                { icon: <FiMail size={14} />, text: 'info@ssuet.edu.pk' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.825rem', color: 'var(--gray)' }}>
                  <span style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>
            © {new Date().getFullYear()} Sir Syed University of Engineering & Technology. All rights reserved.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>
            Built with ❤️ for SSUET Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
