import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiCalendar, FiUsers, FiBarChart2, FiPlusCircle, FiLogOut, FiList
} from 'react-icons/fi';

const adminLinks = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/admin/events', icon: <FiCalendar />, label: 'Manage Events' },
  { to: '/admin/events/new', icon: <FiPlusCircle />, label: 'Create Event' },
  { to: '/admin/participants', icon: <FiUsers />, label: 'Participants' },
  { to: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">S</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">SSUET Portal</span>
            <span className="sidebar-logo-sub">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {adminLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="avatar" style={{ background: 'var(--primary)' }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--sidebar-text)' }}>Administrator</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-block" onClick={handleLogout} style={{ color: 'var(--sidebar-text)', justifyContent: 'flex-start', gap: '0.5rem' }}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
