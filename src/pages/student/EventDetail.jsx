import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../api/eventService';
import { registrationService } from '../../api/registrationService';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RegistrationModal from '../../components/RegistrationModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowLeft, FiTag, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const categoryColors = {
  Academic: '#3b82f6', Sports: '#10b981', Cultural: '#8b5cf6',
  Technical: '#f59e0b', Workshop: '#ef4444', Seminar: '#06b6d4',
  Competition: '#ec4899', Other: '#6b7280'
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, myRegs] = await Promise.all([
          eventService.getEvent(id),
          registrationService.getMyRegistrations()
        ]);
        setEvent(evRes.data.event);
        const myReg = myRegs.data.registrations.find(r => r.event?._id === id && r.status !== 'cancelled');
        setRegistration(myReg || null);
      } catch {
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRegister = async () => {
    setRegLoading(true);
    try {
      await registrationService.register(id);
      toast.success('Successfully registered!', 'Registered');
      const myRegs = await registrationService.getMyRegistrations();
      const myReg = myRegs.data.registrations.find(r => r.event?._id === id && r.status !== 'cancelled');
      setRegistration(myReg);
      setShowModal(false);
      // refresh event data for updated count
      const evRes = await eventService.getEvent(id);
      setEvent(evRes.data.event);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!registration || !window.confirm('Cancel your registration for this event?')) return;
    try {
      await registrationService.cancelRegistration(registration._id);
      toast.success('Registration cancelled');
      setRegistration(null);
      const evRes = await eventService.getEvent(id);
      setEvent(evRes.data.event);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (!event) return <><Navbar /><div className="empty-state"><h3>Event not found</h3><button className="btn btn-primary" onClick={() => navigate('/events')}>← Back</button></div></>;

  const capacity = (event.currentParticipants / event.maxParticipants) * 100;
  const isFull = event.currentParticipants >= event.maxParticipants;
  const color = categoryColors[event.category] || '#1a6b47';
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isDeadlinePassed = event.registrationDeadline && new Date() > new Date(event.registrationDeadline);

  const canRegister = !registration && !isFull && event.status === 'upcoming' && !isDeadlinePassed;

  return (
    <div className="student-layout">
      <Navbar />
      <main style={{ flex: 1 }}>
        {/* Hero Banner */}
        <div style={{
          background: event.image ? `url(${event.image}) center/cover` : `linear-gradient(135deg, ${color}dd 0%, ${color}88 100%)`,
          minHeight: '280px',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          {event.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />}
          <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '2rem', paddingTop: '1.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              <FiArrowLeft /> Back to Events
            </button>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.9)', color: color, fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {event.category}
              </span>
              <span className={`badge ${event.status === 'upcoming' ? 'badge-primary' : event.status === 'ongoing' ? 'badge-success' : 'badge-gray'}`}>
                {event.status}
              </span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {event.title}
            </h1>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              Organized by <strong>{event.organizer}</strong>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '2rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
            {/* Main Content */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                  <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>About This Event</h3>
                  <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{event.description}</p>

                  {event.tags?.length > 0 && (
                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <FiTag style={{ color: 'var(--gray)' }} />
                      {event.tags.map(tag => <span key={tag} className="chip">#{tag}</span>)}
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity */}
              <div className="card">
                <div className="card-body">
                  <h4 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Registration Status</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
                    <span>{event.currentParticipants} registered</span>
                    <span style={{ fontWeight: 600, color: isFull ? 'var(--error)' : spotsLeft <= 10 ? 'var(--warning)' : 'var(--success)' }}>
                      {isFull ? 'Fully Booked' : `${spotsLeft} spots left`}
                    </span>
                  </div>
                  <div className="capacity-track" style={{ height: '8px' }}>
                    <div className={`capacity-fill ${capacity >= 90 ? 'danger' : capacity >= 70 ? 'warning' : ''}`}
                      style={{ width: `${Math.min(capacity, 100)}%`, height: '100%' }} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.4rem', textAlign: 'right' }}>
                    {Math.round(capacity)}% capacity
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Event Details Card */}
              <div className="card">
                <div className="card-body">
                  <h4 style={{ marginBottom: '1.25rem', color: 'var(--dark)' }}>Event Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { icon: <FiCalendar />, label: 'Date', value: format(new Date(event.date), 'EEEE, MMMM d, yyyy') },
                      { icon: <FiClock />, label: 'Time', value: event.time || 'TBA' },
                      { icon: <FiMapPin />, label: 'Venue', value: event.venue },
                      { icon: <FiUsers />, label: 'Capacity', value: `${event.maxParticipants} participants max` },
                    ].map(({ icon, label, value }) => (
                      <div key={label} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--dark)', fontWeight: 500, marginTop: '0.15rem' }}>{value}</div>
                        </div>
                      </div>
                    ))}
                    {event.registrationDeadline && (
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: isDeadlinePassed ? 'var(--error)' : 'var(--warning)', marginTop: '2px' }}><FiAlertCircle /></span>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration Deadline</div>
                          <div style={{ fontSize: '0.875rem', color: isDeadlinePassed ? 'var(--error)' : 'var(--dark)', fontWeight: 500, marginTop: '0.15rem' }}>
                            {format(new Date(event.registrationDeadline), 'MMM d, yyyy')}
                            {isDeadlinePassed && ' (Passed)'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  {registration ? (
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                      <div style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.25rem' }}>You're Registered!</div>
                      <div style={{ marginBottom: '1rem' }}>
                        <span className={`badge ${registration.status === 'approved' ? 'badge-success' : registration.status === 'pending' ? 'badge-warning' : 'badge-gray'}`}>
                          Status: {registration.status}
                        </span>
                      </div>
                      {event.status === 'upcoming' && (
                        <button className="btn btn-danger btn-block btn-sm" onClick={handleCancel}>Cancel Registration</button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {canRegister ? (
                        <>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1rem' }}>
                            Join {event.currentParticipants} others at this event
                          </div>
                          <button className="btn btn-primary btn-block btn-lg" onClick={() => setShowModal(true)}>
                            Register Now
                          </button>
                          {event.requiresApproval && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.75rem' }}>
                              ⚠️ Requires admin approval
                            </p>
                          )}
                        </>
                      ) : (
                        <div style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                          {isFull ? '❌ Event is fully booked' : isDeadlinePassed ? '⏰ Registration deadline passed' : event.status === 'cancelled' ? '🚫 Event cancelled' : '✅ Event completed'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showModal && (
        <RegistrationModal
          event={event}
          onConfirm={handleRegister}
          onClose={() => setShowModal(false)}
          loading={regLoading}
        />
      )}
    </div>
  );
};

export default EventDetail;
