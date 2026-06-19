import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({ ...form, role });
      login(res.data.user, res.data.token);
      toast.success('Welcome back!', 'Login Successful');
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, var(--primary-darker) 0%, var(--primary) 60%, var(--primary-light) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,162,39,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>S</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.75rem' }}>SSUET Events</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 320 }}>
            Your gateway to academic excellence and campus life at Sir Syed University of Engineering & Technology.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['🎓 Browse & Register for Events', '📊 Track Your Registrations', '🏆 Participate in Competitions'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/" style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>
              ← Back to Home
            </Link>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--dark)', marginBottom: '0.25rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Sign in to access your SSUET portal</p>
          </div>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '1.75rem' }}>
            {['student', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setErrors({}); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'calc(var(--radius-sm) - 2px)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                  background: role === r ? 'white' : 'transparent',
                  color: role === r ? 'var(--primary)' : 'var(--gray)',
                  boxShadow: role === r ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {r === 'student' ? '🎓 Student' : '🔑 Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input
                  id="login-email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder={role === 'admin' ? 'admin@ssuet.edu.pk' : 'student@ssuet.edu.pk'}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.email && <span className="form-error"><FiEyeOff size={12} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-light)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><div className="spinner spinner-sm spinner-white"></div> Signing In...</> : <><FiLogIn /> Sign In</>}
            </button>
          </form>

          {role === 'admin' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--primary-xlight)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(26,107,71,0.2)', fontSize: '0.8rem', color: 'var(--primary)' }}>
              <strong>Demo Admin:</strong> admin@ssuet.edu.pk / Admin@123
            </div>
          )}

          {role === 'student' && (
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
