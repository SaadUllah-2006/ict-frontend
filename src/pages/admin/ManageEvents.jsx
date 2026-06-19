import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../api/eventService';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiUsers, FiSearch, FiMenu } from 'react-icons/fi';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Seminar', 'Competition', 'Other'];

const ManageEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({ search, category: category === 'All' ? '' : category, limit: 50 });
      setEvents(res.data.events || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [search, category]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also cancel all registrations.`)) return;
    setDeletingId(id);
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted successfully');
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status) => {
    const map = { upcoming: 'badge-primary', ongoing: 'badge-success', completed: 'badge-gray', cancelled: 'badge-error' };
    return map[status] || 'badge-gray';
  };

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--dark)', fontWeight: 700 }}>Manage Events</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>{events.length} total events</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/admin/events/new')}>
            <FiPlus /> Create Event
          </button>
        </div>

        <div className="admin-content">
          {/* Filter Bar */}
          <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <FiSearch />
              <input className="form-input" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <select className="form-input form-select" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? <LoadingSpinner /> : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No Events Found</h3>
              <button className="btn btn-primary" onClick={() => navigate('/admin/events/new')}>Create First Event</button>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event._id}>
                        <td style={{ maxWidth: 280 }}>
                          <div className="td-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                          <div className="td-muted">{event.venue}</div>
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ textTransform: 'none' }}>{event.category}</span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FiCalendar style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }} />
                            {format(new Date(event.date), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                            <FiUsers style={{ color: 'var(--gray-light)', fontSize: '0.875rem' }} />
                            <span style={{ fontWeight: 600, color: event.currentParticipants >= event.maxParticipants ? 'var(--error)' : 'var(--dark)' }}>
                              {event.currentParticipants}
                            </span>
                            <span style={{ color: 'var(--gray)' }}>/ {event.maxParticipants}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${statusBadge(event.status)}`}>{event.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-ghost btn-sm" title="View Participants" onClick={() => navigate(`/admin/participants?event=${event._id}`)}>
                              <FiEye />
                            </button>
                            <button className="btn btn-outline btn-sm" title="Edit" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>
                              <FiEdit2 />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              title="Delete"
                              disabled={deletingId === event._id}
                              onClick={() => handleDelete(event._id, event.title)}
                            >
                              {deletingId === event._id ? <div className="spinner spinner-sm spinner-white"></div> : <FiTrash2 />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
