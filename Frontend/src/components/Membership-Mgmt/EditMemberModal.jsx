import { useMemo, useState } from 'react';
import axios from 'axios';
import useMemberForm from '../../hooks/Membership-Mgmt/useMemberForm.js';

const STATUS_OPTIONS = ['Pending', 'Active', 'Inactive', 'Expired'];

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle = {
  width: 'min(720px, 94vw)',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
  padding: 20,
};

const rowStyle = { display: 'flex', gap: 12 };
const fieldStyle = { flex: 1 };

const EditMemberModal = ({ member, onClose, onSaved, token }) => {
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { form, setField, errors, setErrors, validate } = useMemberForm({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    phoneNumber: member?.phoneNumber || '',
    membershipStatus: member?.membershipStatus || 'Pending',
    eventsAttended: member?.eventsAttended ?? 0,
    memberCreated: member?.memberCreated ? new Date(member.memberCreated).toISOString().slice(0, 10) : '',
  });

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setAlert({ message: '', type: '' });
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setAlert({ message: 'Please fix validation errors', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.memberCreated) delete payload.memberCreated;
      await axios.put(`http://localhost:5000/members/${member._id}`, payload, { headers });
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      if (err?.response?.status === 409) {
        setErrors((prev) => ({ ...prev, firstName: 'Duplicate name', lastName: 'Duplicate name' }));
        setAlert({ message: err.response.data?.message || 'Duplicate name', type: 'warning' });
      } else if (err?.response?.status === 400) {
        setAlert({ message: 'Validation error from server', type: 'error' });
      } else if (err?.response?.status === 401) {
        setAlert({ message: 'Session expired. Please login again.', type: 'error' });
      } else {
        setAlert({ message: 'Failed to save changes', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Edit member">
      <section style={modalStyle}>
        {alert.message ? (
          <div className={`member-alert-section member-alert-${alert.type}`}>{alert.message}</div>
        ) : null}
        <h3>Edit Member</h3>
        <form onSubmit={handleSave}>
          <div style={rowStyle}>
            <div className="member-field-group" style={fieldStyle}>
              <label className="member-label" htmlFor="em-firstName">First Name</label>
              <input id="em-firstName" className={`member-input ${errors.firstName ? 'error' : ''}`} value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} required />
              {errors.firstName ? <div className="member-error-text">{errors.firstName}</div> : null}
            </div>
            <div className="member-field-group" style={fieldStyle}>
              <label className="member-label" htmlFor="em-lastName">Last Name</label>
              <input id="em-lastName" className={`member-input ${errors.lastName ? 'error' : ''}`} value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} required />
              {errors.lastName ? <div className="member-error-text">{errors.lastName}</div> : null}
            </div>
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="em-email">Email (optional)</label>
            <input id="em-email" type="email" className={`member-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={(e) => setField('email', e.target.value)} />
            {errors.email ? <div className="member-error-text">{errors.email}</div> : null}
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="em-phone">Phone Number</label>
            <input id="em-phone" className={`member-input ${errors.phoneNumber ? 'error' : ''}`} value={form.phoneNumber} onChange={(e) => setField('phoneNumber', e.target.value)} required />
            {errors.phoneNumber ? <div className="member-error-text">{errors.phoneNumber}</div> : null}
          </div>

          <div style={rowStyle}>
            <div className="member-field-group" style={fieldStyle}>
              <label className="member-label" htmlFor="em-status">Status</label>
              <select id="em-status" className={`member-select ${errors.membershipStatus ? 'error' : ''}`} value={form.membershipStatus} onChange={(e) => setField('membershipStatus', e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="member-field-group" style={fieldStyle}>
              <label className="member-label" htmlFor="em-events">Events Attended</label>
              <input id="em-events" type="number" min={0} className={`member-input ${errors.eventsAttended ? 'error' : ''}`} value={form.eventsAttended} onChange={(e) => setField('eventsAttended', e.target.value === '' ? 0 : Number(e.target.value))} />
              {errors.eventsAttended ? <div className="member-error-text">{errors.eventsAttended}</div> : null}
            </div>
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="em-created">Member Since (optional)</label>
            <input id="em-created" type="date" className={`member-date ${errors.memberCreated ? 'error' : ''}`} value={form.memberCreated} onChange={(e) => setField('memberCreated', e.target.value)} />
          </div>

          <div className="member-actions">
            <button type="submit" className="member-submit-btn" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" className="member-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditMemberModal;
