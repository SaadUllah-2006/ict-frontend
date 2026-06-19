import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../../api/eventService';
import { registrationService } from '../../api/registrationService';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import EventFilters from '../../components/EventFilters';
import RegistrationModal from '../../components/RegistrationModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const fetchEvents = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({ ...f, page: p, limit: 9 });
      setEvents(res.data.events || []);
      setPagination({ pages: res.data.pages, total: res.data.total });
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    registrationService.getMyRegistrations()
      .then(res => setRegistrations(res.data.registrations || []))
      .catch(() => {});
  }, []);

  useEffect(() => { fetchEvents(filters, page); }, [filters, page]);

  const handleFilterChange = (f) => { setFilters(f); setPage(1); };

  const handleRegister = async () => {
    if (!selectedEvent) return;
    setRegLoading(true);
    try {
      await registrationService.register(selectedEvent._id);
      toast.success('Successfully registered!', 'Registered');
      const regRes = await registrationService.getMyRegistrations();
      setRegistrations(regRes.data.registrations || []);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const registeredIds = new Set(registrations.filter(r => r.status !== 'cancelled').map(r => r.event?._id));

  return (
    <div className="student-layout">
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Browse Events</h1>
              <p className="page-subtitle">Discover and register for SSUET events • {pagination.total} events found</p>
            </div>
          </div>

          <EventFilters onFilterChange={handleFilterChange} />

          {loading ? (
            <LoadingSpinner />
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No Events Found</h3>
              <p>Try adjusting your search filters or check back later for new events.</p>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {events.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRegistered={registeredIds.has(event._id)}
                    onRegister={() => !registeredIds.has(event._id) && setSelectedEvent(event)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}><FiChevronLeft /></button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}><FiChevronRight /></button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onConfirm={handleRegister}
          onClose={() => setSelectedEvent(null)}
          loading={regLoading}
        />
      )}
    </div>
  );
};

export default Events;
