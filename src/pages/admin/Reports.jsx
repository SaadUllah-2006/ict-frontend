import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMenu, FiTrendingUp, FiAward } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS = { approved: '#10b981', pending: '#f59e0b', rejected: '#ef4444', cancelled: '#94a3b8' };
const DEPT_COLORS = ['#1a6b47', '#c9a227', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#ec4899', '#06b6d4'];

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    adminService.getReports()
      .then(res => setReports(res.data.reports))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--dark)', fontWeight: 700 }}>Reports & Analytics</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>Insights and statistics</p>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {loading ? <LoadingSpinner /> : !reports ? (
            <div className="empty-state"><h3>No data available</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Row 1: Status + Monthly */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div className="card">
                  <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Registration Status</h4></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={reports.registrationsByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70}>
                          {reports.registrationsByStatus.map((entry, i) => (
                            <Cell key={i} fill={STATUS_COLORS[entry._id] || '#94a3b8'} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8 }} formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                        <Legend formatter={v => v.charAt(0).toUpperCase() + v.slice(1)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                      {reports.registrationsByStatus.map(({ _id, count }) => (
                        <div key={_id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[_id] || '#94a3b8', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{count}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{_id}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h4 style={{ fontSize: '1rem' }}>Monthly Registrations (Last 6 Months)</h4>
                    <FiTrendingUp style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="card-body">
                    {reports.monthlyRegistrations?.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={reports.monthlyRegistrations} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                          <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: 8 }} />
                          <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Registrations" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state" style={{ padding: '2rem' }}><p>No data yet</p></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Top Events */}
              <div className="card">
                <div className="card-header">
                  <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiAward style={{ color: 'var(--secondary)' }} /> Top Events by Participants
                  </h4>
                </div>
                <div className="table-wrapper">
                  {reports.topEvents?.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}><p>No events yet</p></div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Event</th>
                          <th>Category</th>
                          <th>Registered</th>
                          <th>Capacity</th>
                          <th>Fill Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.topEvents.map((ev, i) => {
                          const fill = Math.round((ev.currentParticipants / ev.maxParticipants) * 100);
                          return (
                            <tr key={ev._id}>
                              <td style={{ fontWeight: 700, color: i < 3 ? 'var(--secondary-dark)' : 'var(--gray)' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                              </td>
                              <td className="td-name">{ev.title}</td>
                              <td><span className="badge badge-primary">{ev.category}</span></td>
                              <td style={{ fontWeight: 700 }}>{ev.currentParticipants}</td>
                              <td style={{ color: 'var(--gray)' }}>{ev.maxParticipants}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div className="capacity-track" style={{ flex: 1, height: 6 }}>
                                    <div className={`capacity-fill ${fill >= 90 ? 'danger' : fill >= 70 ? 'warning' : ''}`} style={{ width: `${Math.min(fill, 100)}%`, height: '100%' }} />
                                  </div>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: fill >= 90 ? 'var(--error)' : fill >= 70 ? 'var(--warning)' : 'var(--success)', minWidth: '2.5rem' }}>{fill}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Row 3: Department Distribution */}
              <div className="card">
                <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Registrations by Department</h4></div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reports.registrationsByDepartment} layout="vertical" margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <YAxis dataKey="_id" type="category" tick={{ fontSize: 10 }} width={95} tickFormatter={d => d.split(' ')[0] + (d.split(' ')[1] ? ' ' + d.split(' ')[1].slice(0, 3) + '.' : '')} />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Bar dataKey="count" name="Registrations" radius={[0, 4, 4, 0]}>
                        {reports.registrationsByDepartment?.map((_, i) => (
                          <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'center' }}>
                    {reports.registrationsByDepartment?.map(({ _id, count }, i) => (
                      <div key={_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: DEPT_COLORS[i % DEPT_COLORS.length], flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--dark-3)' }}>{_id}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark)' }}>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
