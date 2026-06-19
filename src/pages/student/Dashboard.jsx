import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventService } from '../../api/eventService';
import { registrationService } from '../../api/registrationService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import RegistrationModal from '../../components/RegistrationModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiCalendar, FiList, FiCheckCircle, FiClock, FiArrowRight, FiTrendingUp } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          eventService.getEvents({ status: 'upcoming', limit: 6 }),
          registrationService.getMyRegistrations()
        ]);
        setEvents(evRes.data.events || []);
        setRegistrations(regRes.data.registrations || []);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async () => {
    if (!selectedEvent) return;
    setRegLoading(true);
    try {
      await registrationService.register(selectedEvent._id);
      toast.success('You have successfully registered!', 'Registration Confirmed');
      const regRes = await registrationService.getMyRegistrations();
      setRegistrations(regRes.data.registrations || []);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const registeredIds = new Set(registrations.filter(r => r.status !== 'cancelled').map(r => r.event?._id));
  const upcomingRegs = registrations.filter(r => r.status === 'approved' && r.event && new Date(r.event.date) > new Date());
  const completedRegs = registrations.filter(r => r.event && new Date(r.event.date) < new Date());

  const stats = [
    { label: 'Upcoming Events', value: events.length, icon: <FiCalendar />, color: 'green', desc: 'Available to register' },
    { label: 'My Registrations', value: registrations.filter(r => r.status !== 'cancelled').length, icon: <FiList />, color: 'blue', desc: 'Total registered' },
    { label: 'Confirmed Events', value: upcomingRegs.length, icon: <FiCheckCircle />, color: 'purple', desc: 'Upcoming confirmed' },
    { label: 'Attended', value: completedRegs.length, icon: <FiTrendingUp />, color: 'gold', desc: 'Past events' },
  ];

  if (loading) return <><Navbar /><LoadingSpinner /></>;

  return (
    <div className="student-layout">
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {/* Welcome Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-2rem', top: '-2rem', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,162,39,0.15)' }} />
            <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', fontSize: '5rem', opacity: 0.15 }}>🎓</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Welcome back,</p>
              <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.5rem' }}>{user?.name} 👋</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(8px)' }}>
                  🏛️ {user?.department}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(8px)' }}>
                  📚 Semester {user?.semester}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(8px)' }}>
                  🆔 {user?.studentId}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {stats.map(({ label, value, icon, color, desc }) => (
              <div key={label} className={`stat-card ${color}`}>
                <div className={`stat-icon ${color}`}>{icon}</div>
                <div className="stat-info">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-light)', marginTop: '0.15rem' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Registrations */}
          {upcomingRegs.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--dark)' }}>My Upcoming Events</h3>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>Events you're registered for</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-registrations')}>
                  View All <FiArrowRight />
                </button>
              </div>
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingRegs.slice(0, 3).map(reg => (
                  <div key={reg._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s', cursor: 'pointer' }}
                    onClick={() => navigate(`/events/${reg.event._id}`)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-xlight)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-alt)'}>
                    <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem', flexShrink: 0 }}>
                      📅
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.event.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.1rem' }}>
                        {new Date(reg.event.date).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })} • {reg.event.venue}
                      </div>
                    </div>
                    <span className={`badge ${reg.status === 'approved' ? 'badge-success' : reg.status === 'pending' ? 'badge-warning' : 'badge-gray'}`}>
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--dark)' }}>Upcoming Events</h3>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Register for upcoming SSUET events</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/events')}>
              Browse All <FiArrowRight />
            </button>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <h3>No Upcoming Events</h3>
              <p>Check back later for new events from SSUET.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  isRegistered={registeredIds.has(event._id)}
                  onRegister={() => !registeredIds.has(event._id) && setSelectedEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onConfirm={handleRegister}
          onClose={() => setSelectedEvent(null)}
          loading={regLoading}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
