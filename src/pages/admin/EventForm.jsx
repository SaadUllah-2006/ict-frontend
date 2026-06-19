import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../api/eventService';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import { FiArrowLeft, FiUpload, FiMenu, FiSave } from 'react-icons/fi';

const CATEGORIES = ['Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Seminar', 'Competition', 'Other'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', description: '', category: 'Academic', date: '', endDate: '',
    time: '09:00 AM', venue: '', organizer: '', maxParticipants: '', status: 'upcoming',
    registrationDeadline: '', tags: '', requiresApproval: false
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      eventService.getEvent(id)
        .then(res => {
          const ev = res.data.event;
          setForm({
            title: ev.title || '',
            description: ev.description || '',
            category: ev.category || 'Academic',
            date: ev.date ? ev.date.split('T')[0] : '',
            endDate: ev.endDate ? ev.endDate.split('T')[0] : '',
            time: ev.time || '09:00 AM',
            venue: ev.venue || '',
            organizer: ev.organizer || '',
            maxParticipants: ev.maxParticipants || '',
            status: ev.status || 'upcoming',
            registrationDeadline: ev.registrationDeadline ? ev.registrationDeadline.split('T')[0] : '',
            tags: ev.tags?.join(', ') || '',
            requiresApproval: ev.requiresApproval || false
          });
          if (ev.image) setPreview(ev.image);
        })
        .catch(() => toast.error('Failed to load event'))
        .finally(() => setFetchLoading(false));
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.venue.trim()) e.venue = 'Venue is required';
    if (!form.organizer.trim()) e.organizer = 'Organizer is required';
    if (!form.maxParticipants || Number(form.maxParticipants) < 1) e.maxParticipants = 'Must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the form errors'); return; }
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      if (isEdit) {
        await eventService.updateEvent(id, fd);
        toast.success('Event updated successfully!', 'Updated');
      } else {
        await eventService.createEvent(fd);
        toast.success('Event created successfully!', 'Created');
      }
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="admin-layout"><Sidebar /><div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div></div>;

  const Field = ({ label, name, required, children, hint }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span>*</span>}</label>
      {children}
      {errors[name] && <span className="form-error">{errors[name]}</span>}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/events')}><FiArrowLeft /></button>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--dark)', fontWeight: 700 }}>{isEdit ? 'Edit Event' : 'Create Event'}</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', margin: 0 }}>{isEdit ? 'Update event details' : 'Fill in all required fields'}</p>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
              {/* Main Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="card">
                  <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Basic Information</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <Field label="Event Title" name="title" required>
                      <input type="text" className={`form-input${errors.title ? ' error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Annual Tech Symposium 2024" maxLength={200} />
                    </Field>
                    <Field label="Description" name="description" required>
                      <textarea className={`form-input${errors.description ? ' error' : ''}`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed event description..." rows={5} maxLength={2000} style={{ resize: 'vertical' }} />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Field label="Category" name="category" required>
                        <select className="form-input form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Status" name="status">
                        <select className="form-input form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Tags" name="tags" hint="Comma-separated, e.g. technology, workshop, prizes">
                      <input type="text" className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="technology, competition, workshop" />
                    </Field>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Date & Venue</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <Field label="Start Date" name="date" required>
                        <input type="date" className={`form-input${errors.date ? ' error' : ''}`} value={form.date} onChange={e => set('date', e.target.value)} />
                      </Field>
                      <Field label="End Date" name="endDate">
                        <input type="date" className="form-input" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
                      </Field>
                      <Field label="Time" name="time">
                        <input type="text" className="form-input" value={form.time} onChange={e => set('time', e.target.value)} placeholder="09:00 AM" />
                      </Field>
                    </div>
                    <Field label="Venue" name="venue" required>
                      <input type="text" className={`form-input${errors.venue ? ' error' : ''}`} value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="e.g. Main Auditorium, SSUET" />
                    </Field>
                    <Field label="Organizer" name="organizer" required>
                      <input type="text" className={`form-input${errors.organizer ? ' error' : ''}`} value={form.organizer} onChange={e => set('organizer', e.target.value)} placeholder="e.g. Department of Computer Engineering" />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Sidebar Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Image Upload */}
                <div className="card">
                  <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Event Image</h4></div>
                  <div className="card-body">
                    {preview && (
                      <img src={preview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }} />
                    )}
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'border-color 0.2s', textAlign: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <FiUpload style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark)' }}>Click to upload image</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.25rem' }}>PNG, JPG, WEBP up to 5MB</div>
                      </div>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                {/* Capacity & Settings */}
                <div className="card">
                  <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Capacity & Settings</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <Field label="Max Participants" name="maxParticipants" required>
                      <input type="number" min="1" className={`form-input${errors.maxParticipants ? ' error' : ''}`} value={form.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} placeholder="e.g. 100" />
                    </Field>
                    <Field label="Registration Deadline" name="registrationDeadline">
                      <input type="date" className="form-input" value={form.registrationDeadline} onChange={e => set('registrationDeadline', e.target.value)} />
                    </Field>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.requiresApproval} onChange={e => set('requiresApproval', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark)' }}>Requires Admin Approval</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Registrations will be pending until approved</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? <><div className="spinner spinner-sm spinner-white"></div> Saving...</> : <><FiSave /> {isEdit ? 'Update Event' : 'Create Event'}</>}
                </button>
                <button type="button" className="btn btn-ghost btn-block" onClick={() => navigate('/admin/events')} disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
