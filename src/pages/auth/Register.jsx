import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiPhone } from 'react-icons/fi';

const DEPARTMENTS = [
  'Computer Engineering', 'Software Engineering', 'Electronic Engineering',
  'Telecommunication Engineering', 'Industrial Engineering', 'Biomedical Engineering',
  'Mechanical Engineering', 'Civil Engineering'
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '', email: '', department: '', semester: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.department) e.department = 'Department is required';
    if (!form.semester) e.semester = 'Semester is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      payload.semester = Number(payload.semester); // Convert string → number (required by backend)
      const res = await authService.register(payload);
      login(res.data.user, res.data.token);
      toast.success('Account created successfully! Welcome to SSUET Events.', 'Registration Successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputProps = (field, type = 'text', icon, placeholder) => ({
    id: `reg-${field}`,
    type,
    className: `form-input${errors[field] ? ' error' : ''}`,
    placeholder,
    value: form[field],
    onChange: e => set(field, e.target.value),
    style: icon ? { paddingLeft: '2.5rem' } : {}
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, var(--primary-darker) 0%, var(--primary) 60%, var(--secondary-dark) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(201,162,39,0.1)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🎓</div>
          <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Join SSUET Events</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300 }}>
            Create your account and start exploring events, workshops, competitions, and more at SSUET.
          </p>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backdropFilter: 'blur(8px)', textAlign: 'left' }}>
            <div style={{ color: 'var(--secondary-light)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>What you get:</div>
            {['Access to all university events', 'Instant registration confirmation', 'Personalized event dashboard', 'Registration history tracking'].map(item => (
              <div key={item} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--secondary)' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, maxWidth: 560, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <Link to="/" style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.25rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>
              ← Back to Home
            </Link>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--dark)', marginBottom: '0.25rem' }}>Create Account</h2>
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input {...inputProps('name', 'text', true, 'Muhammad Ali')} />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input {...inputProps('email', 'email', true, 'you@example.com')} />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Department + Semester */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-department">Department <span>*</span></label>
                <select id="reg-department" className={`form-input form-select${errors.department ? ' error' : ''}`}
                  value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select dept.</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d.replace(' Engineering', ' Eng.')}</option>)}
                </select>
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-semester">Semester <span>*</span></label>
                <select id="reg-semester" className={`form-input form-select${errors.semester ? ' error' : ''}`}
                  value={form.semester} onChange={e => set('semester', e.target.value)}>
                  <option value="">Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                {errors.semester && <span className="form-error">{errors.semester}</span>}
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number <span style={{ color: 'var(--gray-light)', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input {...inputProps('phone', 'tel', true, '+92 300 0000000')} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input {...inputProps('password', showPass ? 'text' : 'password', true, 'Min. 6 characters')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-light)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirmPassword">Confirm Password <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input {...inputProps('confirmPassword', 'password', true, 'Re-enter password')} />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><div className="spinner spinner-sm spinner-white"></div> Creating Account...</> : '🎓 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
