import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../../api/eventService';
import { registrationService } from '../../api/registrationService';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMenu, FiSearch, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  approved: { class: 'badge-success', label: 'Approved' },
  pending: { class: 'badge-warning', label: 'Pending' },
  rejected: { class: 'badge-error', label: 'Rejected' },
  cancelled: { class: 'badge-gray', label: 'Cancelled' }
};

const Participants = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get('event') || '');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    eventService.getEvents({ limit: 100 })
      .then(res => setEvents(res.data.events || []))
      .catch(() => toast.error('Failed to load events'));
  }, []);

  useEffect(() => {
    if (!selectedEvent) { setRegistrations([]); return; }
    setLoading(true);
    registrationService.getEventParticipants(selectedEvent)
      .then(res => setRegistrations(res.data.registrations || []))
      .catch(() => toast.error('Failed to load participants'))
      .finally(() => setLoading(false));
  }, [selectedEvent]);

  const handleStatusUpdate = async (regId, newStatus) => {
    setUpdatingId(regId);
    try {
      await registrationService.updateStatus(regId, newStatus);
      toast.success(`Registration ${newStatus}`);
      setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, status: newStatus } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = registrations.filter(r => {
    const s = r.student;
    const matchSearch = !search || (s?.name?.toLowerCase().includes(search.toLowerCase()) || s?.email?.toLowerCase().includes(search.toLowerCase()) || s?.studentId?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const currentEvent = events.find(e => e._id === selectedEvent);

  const handleExport = () => {
    const rows = [['Student ID', 'Name', 'Email', 'Department', 'Semester', 'Status', 'Registered On']];
    filtered.forEach(r => {
      rows.push([r.student?.studentId, r.student?.name, r.student?.email, r.student?.department, r.student?.semester, r.status, format(new Date(r.registrationDate), 'yyyy-MM-dd')]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `participants-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--dark)', fontWeight: 700 }}>Participants</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>Manage event registrations</p>
            </div>
          </div>
          {filtered.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleExport}>
              <FiDownload /> Export CSV
            </button>
          )}
        </div>

        <div className="admin-content">
          {/* Event Selector */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Select Event</label>
                <select className="form-input form-select" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                  <option value="">— Choose an event —</option>
                  {events.map(ev => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} ({format(new Date(ev.date), 'MMM d, yyyy')}) — {ev.currentParticipants}/{ev.maxParticipants}
                    </option>
                  ))}
                </select>
              </div>
              {currentEvent && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--primary-xlight)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Total Registered', value: registrations.length },
                    { label: 'Approved', value: registrations.filter(r => r.status === 'approved').length },
                    { label: 'Pending', value: registrations.filter(r => r.status === 'pending').length },
                    { label: 'Slots Left', value: currentEvent.maxParticipants - currentEvent.currentParticipants }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!selectedEvent ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>Select an Event</h3>
              <p>Choose an event above to view and manage its registrations.</p>
            </div>
          ) : loading ? <LoadingSpinner /> : (
            <>
              {/* Filter bar */}
              <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
                <div className="search-input-wrapper" style={{ flex: 1 }}>
                  <FiSearch />
                  <input className="form-input" placeholder="Search by name, email, or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                </div>
                <select className="form-input form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
                  <option value="">All Statuses</option>
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3>No Participants Found</h3>
                  <p>No registrations match your current filters.</p>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header">
                    <h4 style={{ fontSize: '1rem' }}>{currentEvent?.title}</h4>
                    <span className="badge badge-primary">{filtered.length} participants</span>
                  </div>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Department</th>
                          <th>Contact</th>
                          <th>Registered On</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(reg => (
                          <tr key={reg._id}>
                            <td>
                              <div className="td-name">{reg.student?.name || '—'}</div>
                              <div className="td-muted">{reg.student?.studentId} • Sem {reg.student?.semester}</div>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--dark-3)', maxWidth: 160 }}>
                              {reg.student?.department}
                            </td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                              <div>{reg.student?.email}</div>
                              {reg.student?.phone && <div className="td-muted">{reg.student.phone}</div>}
                            </td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                              {format(new Date(reg.registrationDate), 'MMM d, yyyy')}
                            </td>
                            <td>
                              <span className={`badge ${STATUS_CONFIG[reg.status]?.class || 'badge-gray'}`}>
                                {STATUS_CONFIG[reg.status]?.label || reg.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {reg.status !== 'approved' && reg.status !== 'cancelled' && (
                                  <button className="btn btn-primary btn-sm" disabled={updatingId === reg._id} onClick={() => handleStatusUpdate(reg._id, 'approved')}>
                                    {updatingId === reg._id ? <div className="spinner spinner-sm spinner-white"></div> : 'Approve'}
                                  </button>
                                )}
                                {reg.status !== 'rejected' && reg.status !== 'cancelled' && (
                                  <button className="btn btn-danger btn-sm" disabled={updatingId === reg._id} onClick={() => handleStatusUpdate(reg._id, 'rejected')}>
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;
