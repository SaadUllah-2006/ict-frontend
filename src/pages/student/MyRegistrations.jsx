import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../../api/registrationService';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiCalendar, FiMapPin, FiArrowRight, FiX, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  approved: { class: 'badge-success', label: 'Confirmed', icon: '✅' },
  pending: { class: 'badge-warning', label: 'Pending', icon: '⏳' },
  rejected: { class: 'badge-error', label: 'Rejected', icon: '❌' },
  cancelled: { class: 'badge-gray', label: 'Cancelled', icon: '🚫' }
};

const MyRegistrations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    registrationService.getMyRegistrations()
      .then(res => setRegistrations(res.data.registrations || []))
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setCancelId(regId);
    try {
      await registrationService.cancelRegistration(regId);
      toast.success('Registration cancelled successfully');
      setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancelId(null);
    }
  };

  const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);
  const counts = { all: registrations.length, approved: 0, pending: 0, cancelled: 0, rejected: 0 };
  registrations.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

  if (loading) return <><Navbar /><LoadingSpinner /></>;

  return (
    <div className="student-layout">
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">My Registrations</h1>
              <p className="page-subtitle">Track all your event registrations in one place</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/events')}>
              Browse Events <FiArrowRight />
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                className={`filter-chip${filter === key ? ' active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Registrations Found</h3>
              <p>{filter === 'all' ? "You haven't registered for any events yet." : `No ${filter} registrations.`}</p>
              <button className="btn btn-primary" onClick={() => navigate('/events')}>Browse Events</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map(reg => {
                const ev = reg.event;
                if (!ev) return null;
                const isPast = new Date(ev.date) < new Date();
                const cfg = STATUS_CONFIG[reg.status] || STATUS_CONFIG.pending;

                return (
                  <div key={reg._id} className="card" style={{ transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                    <div className="card-body" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Date block */}
                      <div style={{ textAlign: 'center', background: 'var(--primary-xlight)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', minWidth: '64px', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                          {format(new Date(ev.date), 'd')}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          {format(new Date(ev.date), 'MMM')}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontWeight: 700, color: 'var(--dark)', fontSize: '1rem', cursor: 'pointer' }}
                            onClick={() => navigate(`/events/${ev._id}`)}>
                            {ev.title}
                          </h4>
                          <span className={`badge ${cfg.class}`}>{cfg.icon} {cfg.label}</span>
                          {isPast && reg.status === 'approved' && <span className="badge badge-gray">Completed</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--gray)' }}>
                            <FiClock style={{ color: 'var(--primary)' }} /> {ev.time || 'TBA'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--gray)' }}>
                            <FiMapPin style={{ color: 'var(--primary)' }} /> {ev.venue}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray-light)' }}>
                            Registered: {format(new Date(reg.registrationDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/events/${ev._id}`)}>
                          View
                        </button>
                        {reg.status !== 'cancelled' && !isPast && ev.status === 'upcoming' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(reg._id)}
                            disabled={cancelId === reg._id}
                          >
                            {cancelId === reg._id ? <div className="spinner spinner-sm spinner-white"></div> : <FiX />}
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyRegistrations;
