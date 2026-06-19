import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../api/adminService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiUser, FiMail, FiPhone, FiBook, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const DEPARTMENTS = [
  'Computer Engineering', 'Software Engineering', 'Electronic Engineering',
  'Telecommunication Engineering', 'Industrial Engineering', 'Biomedical Engineering',
  'Mechanical Engineering', 'Civil Engineering'
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({ name: '', department: '', semester: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false });
  const [profLoading, setProfLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        department: user.department || '',
        semester: user.semester || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) return toast.error('Name is required');
    setProfLoading(true);
    try {
      const res = await studentService.updateProfile(profile);
      updateUser(res.data.student);
      toast.success('Profile updated successfully!', 'Profile Saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) return toast.error('Current password is required');
    if (!passwords.newPassword || passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    setPwdLoading(true);
    try {
      await studentService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!', 'Password Updated');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="student-layout">
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Profile Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: 'white', border: '3px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 style={{ color: 'white', marginBottom: '0.35rem' }}>{user?.name}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[user?.studentId, user?.department, `Semester ${user?.semester}`].filter(Boolean).map(v => (
                  <span key={v} style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(8px)' }}>
                    {v}
                  </span>
                ))}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.4rem' }}>{user?.email}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-light)', marginBottom: '1.5rem' }}>
            {[['profile', '👤 Edit Profile'], ['password', '🔒 Change Password']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: activeTab === key ? 'var(--primary)' : 'var(--gray)',
                  borderBottom: `2px solid ${activeTab === key ? 'var(--primary)' : 'transparent'}`,
                  marginBottom: '-2px',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1.05rem' }}>Personal Information</h3>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <FiUser style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                      <input type="text" className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <FiMail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                      <input type="email" className="form-input" value={user?.email || ''} disabled style={{ paddingLeft: '2.5rem', background: 'var(--bg-alt)', cursor: 'not-allowed' }} />
                    </div>
                    <span className="form-hint">Email address cannot be changed</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-input form-select" value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}>
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Semester</label>
                      <select className="form-input form-select" value={profile.semester} onChange={e => setProfile(p => ({ ...p, semester: e.target.value }))}>
                        <option value="">Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <FiPhone style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                      <input type="tel" className="form-input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+92 300 0000000" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={profLoading}>
                    {profLoading ? <><div className="spinner spinner-sm spinner-white"></div> Saving...</> : <><FiSave /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1.05rem' }}>Change Password</h3>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { key: 'currentPassword', label: 'Current Password', show: 'current' },
                    { key: 'newPassword', label: 'New Password', show: 'new' },
                    { key: 'confirmPassword', label: 'Confirm New Password', show: null }
                  ].map(({ key, label, show }) => (
                    <div className="form-group" key={key}>
                      <label className="form-label">{label} <span>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <FiLock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                        <input
                          type={show && showPwd[show] ? 'text' : 'password'}
                          className="form-input"
                          value={passwords[key]}
                          onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={key === 'currentPassword' ? 'Enter current password' : 'Min. 6 characters'}
                          style={{ paddingLeft: '2.5rem', paddingRight: show ? '2.5rem' : undefined }}
                        />
                        {show && (
                          <button type="button" onClick={() => setShowPwd(p => ({ ...p, [show]: !p[show] }))}
                            style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-light)', cursor: 'pointer', padding: 0 }}>
                            {showPwd[show] ? <FiEyeOff /> : <FiEye />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={pwdLoading}>
                    {pwdLoading ? <><div className="spinner spinner-sm spinner-white"></div> Updating...</> : <><FiLock /> Update Password</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
