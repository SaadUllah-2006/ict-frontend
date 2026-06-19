import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../api/eventService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { FiArrowRight, FiCalendar, FiUsers, FiAward, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

const STATS = [
  { value: '500+', label: 'Active Students', icon: '👥' },
  { value: '50+', label: 'Events Per Year', icon: '🎯' },
  { value: '8', label: 'Departments', icon: '🏛️' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
];

const FEATURES = [
  { icon: <FiCalendar />, title: 'Browse Events', desc: 'Discover academic, cultural, sports, and technical events happening across SSUET.' },
  { icon: <FiZap />, title: 'Easy Registration', desc: 'Register for events in seconds with our streamlined, hassle-free registration system.' },
  { icon: <FiTrendingUp />, title: 'Track Progress', desc: 'Monitor your registrations, attendance history, and upcoming events from your dashboard.' },
  { icon: <FiShield />, title: 'Secure & Reliable', desc: 'Your data is protected with JWT authentication and industry-standard security practices.' },
  { icon: <FiAward />, title: 'Earn Recognition', desc: 'Participate in competitions, workshops, and seminars to build your academic profile.' },
  { icon: <FiUsers />, title: 'Connect & Network', desc: 'Meet fellow students, professors, and industry professionals at SSUET events.' },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    eventService.getEvents({ status: 'upcoming', limit: 3, page: 1 })
      .then(res => setUpcomingEvents(res.data.events || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  return (
    <div className="student-layout">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', borderRadius: 'var(--radius-full)', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>🎓 Sir Syed University of Engineering & Technology</span>
            </div>
            <h1 style={{ color: 'white', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Discover & Join<br />
              <span style={{ color: 'var(--secondary)' }}>Extraordinary Events</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '560px', marginBottom: '2rem', lineHeight: 1.7 }}>
              Your gateway to academic excellence, cultural celebrations, technical workshops, and sports events at SSUET. Register, participate, and excel.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register')}>
                Get Started Free <FiArrowRight />
              </button>
              <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
            <path d="M0,60 C480,0 960,60 1440,0 L1440,60 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ padding: '3rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {STATS.map(({ value, label, icon }) => (
              <div key={label} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need</h2>
            <p>A complete event management experience designed for the SSUET community</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-xlight)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem' }}>
                  {icon}
                </div>
                <h4 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <p>Don't miss out on the latest events happening at SSUET</p>
            </div>
            <div className="events-grid">
              {upcomingEvents.map(event => (
                <EventCard key={event._id} event={event} showRegister={false} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                Register to See All Events <FiArrowRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Join thousands of SSUET students already using the Event Management Portal.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
            <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
