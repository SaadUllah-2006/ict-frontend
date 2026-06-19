import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiBell, FiLogOut, FiUser, FiHome, FiCalendar, FiList } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <NavLink to="/" className="navbar-brand">
            <div className="navbar-brand-icon">S</div>
            <span>SSUET Events</span>
          </NavLink>

          {/* Desktop links */}
          <div className="navbar-links">
            {!user && (
              <>
                <NavLink to="/" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>Home</NavLink>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}><FiHome style={{ display: 'inline', marginRight: 4 }} />Dashboard</NavLink>
                <NavLink to="/events" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}><FiCalendar style={{ display: 'inline', marginRight: 4 }} />Events</NavLink>
                <NavLink to="/my-registrations" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}><FiList style={{ display: 'inline', marginRight: 4 }} />My Registrations</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="navbar-user">
            {user ? (
              <div className="dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', transition: 'background var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <div className="avatar">{getInitials(user.name)}</div>
                  <div style={{ textAlign: 'left', display: 'none' }} className="nav-user-info">
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
                    <div className="dropdown-menu" style={{ zIndex: 100 }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{user.email}</div>
                        <div style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                          <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                        </div>
                      </div>
                      {user.role === 'student' && (
                        <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                          <FiUser /> My Profile
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false); }}>
                          <FiHome /> Admin Dashboard
                        </button>
                      )}
                      <div className="dropdown-divider" />
                      <button className="dropdown-item danger" onClick={handleLogout}>
                        <FiLogOut /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Register</button>
              </div>
            )}

            {/* Mobile menu */}
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'none' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
