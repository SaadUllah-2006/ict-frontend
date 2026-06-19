import { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const RegistrationModal = ({ event, onConfirm, onClose, loading }) => {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Confirm Registration</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginTop: '0.25rem' }}>
              Please review the event details before registering.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          {/* Event summary */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-xlight) 0%, rgba(201,162,39,0.08) 100%)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.75rem' }}>
              {event.title}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                { label: 'Date', value: format(new Date(event.date), 'EEE, MMM d, yyyy') },
                { label: 'Time', value: event.time || 'TBA' },
                { label: 'Venue', value: event.venue },
                { label: 'Organizer', value: event.organizer },
                { label: 'Category', value: event.category },
                { label: 'Spots Left', value: `${event.maxParticipants - event.currentParticipants} / ${event.maxParticipants}` }
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--dark)', fontWeight: 500, marginTop: '0.2rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {event.requiresApproval && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', border: '1px solid #fbbf24' }}>
              <FiAlertCircle style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                <strong>Approval Required:</strong> This event requires admin approval. Your registration will be submitted as <em>pending</em> until reviewed.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <><div className="spinner spinner-sm spinner-white"></div> Registering...</>
            ) : '✓ Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
