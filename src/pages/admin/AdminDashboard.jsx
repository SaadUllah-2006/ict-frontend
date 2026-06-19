import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../api/adminService';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUsers, FiCalendar, FiList, FiTrendingUp, FiMenu, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const CATEGORY_COLORS = ['#1a6b47', '#c9a227', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#ec4899', '#06b6d4'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    adminService.getStats()
      .then(res => setStats(res.data.stats))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: <FiUsers />, color: 'green', change: 'Registered students' },
    { label: 'Total Events', value: stats.totalEvents, icon: <FiCalendar />, color: 'gold', change: 'All events' },
    { label: 'Registrations', value: stats.totalRegistrations, icon: <FiList />, color: 'blue', change: 'Active registrations' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: <FiTrendingUp />, color: 'purple', change: 'Events scheduled' },
  ] : [];

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)} style={{ display: 'none' }} id="sidebar-toggle">
              <FiMenu />
            </button>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--dark)', fontWeight: 700 }}>Dashboard</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Administrator</div>
            </div>
            <div className="avatar" style={{ background: 'var(--primary)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="admin-content">
          {loading ? <LoadingSpinner /> : (
            <>
              {/* Stat Cards */}
              <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                {statCards.map(({ label, value, icon, color, change }) => (
                  <div key={label} className={`stat-card ${color}`}>
                    <div className={`stat-icon ${color}`}>{icon}</div>
                    <div className="stat-info">
                      <div className="stat-value">{value}</div>
                      <div className="stat-label">{label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-light)', marginTop: '0.15rem' }}>{change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Approval Alerts */}
              {stats?.pendingRegistrations > 0 && (
                <div style={{ background: 'var(--warning-light)', border: '1px solid #fbbf24', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FiAlertCircle style={{ color: 'var(--warning)', fontSize: '1.25rem', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#92400e' }}>{stats.pendingRegistrations} registrations awaiting approval.</strong>
                    <span style={{ color: '#92400e', fontSize: '0.875rem' }}> Go to Participants to review them.</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Registrations by Day Chart */}
                <div className="card">
                  <div className="card-header">
                    <h4 style={{ fontSize: '1rem' }}>Registrations — Last 7 Days</h4>
                  </div>
                  <div className="card-body">
                    {stats?.registrationsByDay?.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.registrationsByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                          <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                          <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Registrations" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state" style={{ padding: '2rem' }}>
                        <p>No registration data yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Events by Category */}
                <div className="card">
                  <div className="card-header">
                    <h4 style={{ fontSize: '1rem' }}>Events by Category</h4>
                  </div>
                  <div className="card-body">
                    {stats?.eventsByCategory?.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={stats.eventsByCategory} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} label={({ _id, count }) => `${_id}: ${count}`} labelLine={false}>
                            {stats.eventsByCategory.map((_, i) => (
                              <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state" style={{ padding: '2rem' }}>
                        <p>No events created yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Registrations Table */}
              {stats?.recentRegistrations?.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h4 style={{ fontSize: '1rem' }}>Recent Registrations</h4>
                    <span className="badge badge-primary">{stats.recentRegistrations.length} latest</span>
                  </div>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Event</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentRegistrations.map(reg => (
                          <tr key={reg._id}>
                            <td>
                              <div className="td-name">{reg.student?.name || '—'}</div>
                              <div className="td-muted">{reg.student?.studentId} • {reg.student?.department?.split(' ')[0]}</div>
                            </td>
                            <td>
                              <div className="td-name" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {reg.event?.title || '—'}
                              </div>
                              <div className="td-muted">{reg.event?.category}</div>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                              {reg.createdAt ? format(new Date(reg.createdAt), 'MMM d, yyyy') : '—'}
                            </td>
                            <td>
                              <span className={`badge ${reg.status === 'approved' ? 'badge-success' : reg.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                {reg.status}
                              </span>
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

export default AdminDashboard;
