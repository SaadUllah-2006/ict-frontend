import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';

const categoryColors = {
  Academic: '#3b82f6',
  Sports: '#10b981',
  Cultural: '#8b5cf6',
  Technical: '#f59e0b',
  Workshop: '#ef4444',
  Seminar: '#06b6d4',
  Competition: '#ec4899',
  Other: '#6b7280'
};

const categoryIcons = {
  Academic: '🎓', Sports: '⚽', Cultural: '🎭', Technical: '💻',
  Workshop: '🔧', Seminar: '📢', Competition: '🏆', Other: '📌'
};

const statusConfig = {
  upcoming: { label: 'Upcoming', class: 'badge-primary' },
  ongoing: { label: 'Ongoing', class: 'badge-success' },
  completed: { label: 'Completed', class: 'badge-gray' },
  cancelled: { label: 'Cancelled', class: 'badge-error' }
};

const EventCard = ({ event, showRegister = true, isRegistered = false, onRegister }) => {
  const navigate = useNavigate();
  const capacity = event.maxParticipants > 0 ? (event.currentParticipants / event.maxParticipants) * 100 : 0;
  const capacityClass = capacity >= 90 ? 'danger' : capacity >= 70 ? 'warning' : '';
  const isFull = event.currentParticipants >= event.maxParticipants;
  const color = categoryColors[event.category] || '#6b7280';
  const bgGradient = `linear-gradient(135deg, ${color}cc 0%, ${color}88 100%)`;

  return (
    <div className="event-card animate-in">
      {/* Image */}
      <div className="event-card-img" style={{ background: bgGradient }}>
        {event.image ? (
          <img src={event.image} alt={event.title} />
        ) : (
          <div className="img-placeholder">{categoryIcons[event.category] || '📌'}</div>
        )}
        <div className="event-category-badge">{event.category}</div>
        <div className="event-status">
          <span className={`badge ${statusConfig[event.status]?.class || 'badge-gray'}`}>
            {statusConfig[event.status]?.label || event.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="event-card-body">
        <h3 className="event-card-title"
          onClick={() => navigate(`/events/${event._id}`)}
          style={{ cursor: 'pointer' }}
          title={event.title}
        >
          {event.title.length > 55 ? event.title.slice(0, 52) + '...' : event.title}
        </h3>

        <div className="event-card-meta">
          <div className="event-meta-item">
            <FiCalendar />
            <span>{format(new Date(event.date), 'EEE, MMM d, yyyy')}</span>
          </div>
          {event.time && (
            <div className="event-meta-item">
              <FiClock />
              <span>{event.time}</span>
            </div>
          )}
          <div className="event-meta-item">
            <FiMapPin />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
          </div>
          <div className="event-meta-item">
            <FiUsers />
            <span>{event.currentParticipants} / {event.maxParticipants} registered</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="event-card-footer">
          <div className="capacity-bar">
            <div className="capacity-label">
              <span>Capacity</span>
              <span style={{ fontWeight: 600 }}>{Math.round(capacity)}%</span>
            </div>
            <div className="capacity-track">
              <div
                className={`capacity-fill ${capacityClass}`}
                style={{ width: `${Math.min(capacity, 100)}%` }}
              />
            </div>
          </div>

          {showRegister && (
            <div>
              {isRegistered ? (
                <span className="badge badge-success">✓ Registered</span>
              ) : (
                <button
                  className={`btn btn-primary btn-sm ${isFull || event.status === 'cancelled' || event.status === 'completed' ? '' : ''}`}
                  disabled={isFull || event.status === 'cancelled' || event.status === 'completed'}
                  onClick={onRegister ? () => onRegister(event) : () => navigate(`/events/${event._id}`)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {isFull ? 'Full' : event.status === 'cancelled' ? 'Cancelled' : 'Register'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
