import '../../assets/css/Membership-Mgmt/create-member.css';
import { useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['Pending', 'Active', 'Inactive', 'Expired'];

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  membershipStatus: 'Pending',
  eventsAttended: 0,
  memberCreated: '',
};

const CreateMember = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const authHeaders = useMemo(() => ({
    Authorization: token ? `Bearer ${token}` : undefined,
  }), [token]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isTitleToken = (token) => /^[A-Z][a-z]*$/.test(token);
  const isTitleCase = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    return trimmed
      .split(/([\s\-'])/)
      .filter((t) => !/[\s\-']/.test(t))
      .every(isTitleToken);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!isTitleCase(form.firstName)) newErrors.firstName = 'Use Title Case (e.g., "Juan")';

    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!isTitleCase(form.lastName)) newErrors.lastName = 'Use Title Case (e.g., "Dela Cruz")';

    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email format';

    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(form.phoneNumber.trim())) newErrors.phoneNumber = 'Enter 10-15 digits only';

    if (form.eventsAttended < 0) newErrors.eventsAttended = 'Must be ≥ 0';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setAlert({ message: '', type: '' });

    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setAlert({ message: 'Please fix validation errors', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.phoneNumber) delete payload.phoneNumber;
      if (!payload.memberCreated) delete payload.memberCreated;

      await axios.post('http://localhost:5000/members', payload, { headers: { 'Content-Type': 'application/json', ...authHeaders } });

      setAlert({ message: 'Member created successfully', type: 'success' });
      setTimeout(() => {
        navigate('/admin/membership-mgmt/display');
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409) {
          const msg = err.response.data?.message || 'Duplicate value';
          const fields = err.response.data?.fields || [];
          const details = err.response.data?.details || {};
          const isPhone = fields.includes('phoneNumber') || details.phoneNumber || /phone/i.test(msg);

          if (isPhone) {
            setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number is already in use' }));
          } else {
            setErrors((prev) => ({ ...prev, firstName: 'Duplicate name', lastName: 'Duplicate name' }));
          }
          setAlert({ message: msg, type: 'warning' });
        } else if (err.response.status === 400) {
          setAlert({ message: 'Validation error from server', type: 'error' });
        } else if (err.response.status === 401) {
          setAlert({ message: 'Session expired. Please login again.', type: 'error' });
        } else {
          setAlert({ message: 'Failed to create member', type: 'error' });
        }
      } else {
        setAlert({ message: 'Network error', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-member-body">
      {alert.message && (
        <div className={`member-alert-section member-alert-${alert.type}`}>{alert.message}</div>
      )}
      <section className="member-form-section">
        <h2>Add Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="member-field-group-inline">
            <div className="member-field-group" style={{ flex: 1 }}>
              <label className="member-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                className={`member-input ${errors.firstName ? 'error' : ''}`}
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                placeholder="Juan"
                required
              />
              {errors.firstName && <div className="member-error-text">{errors.firstName}</div>}
            </div>
            <div className="member-field-group" style={{ flex: 1 }}>
              <label className="member-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                className={`member-input ${errors.lastName ? 'error' : ''}`}
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                placeholder="Dela Cruz"
                required
              />
              {errors.lastName && <div className="member-error-text">{errors.lastName}</div>}
            </div>
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              className={`member-input ${errors.email ? 'error' : ''}`}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="juan@example.com"
            />
            {errors.email && <div className="member-error-text">{errors.email}</div>}
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              className={`member-input ${errors.phoneNumber ? 'error' : ''}`}
              value={form.phoneNumber}
              onChange={(e) => setField('phoneNumber', e.target.value)}
              placeholder="09123456789"
              required
            />
            {errors.phoneNumber && <div className="member-error-text">{errors.phoneNumber}</div>}
          </div>

          <div className="member-field-group-inline">
            <div className="member-field-group" style={{ flex: 1 }}>
              <label className="member-label" htmlFor="membershipStatus">Status</label>
              <select
                id="membershipStatus"
                className={`member-select ${errors.membershipStatus ? 'error' : ''}`}
                value={form.membershipStatus}
                onChange={(e) => setField('membershipStatus', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="member-field-group" style={{ flex: 1 }}>
              <label className="member-label" htmlFor="eventsAttended">Events Attended</label>
              <input
                id="eventsAttended"
                type="number"
                min={0}
                className={`member-input ${errors.eventsAttended ? 'error' : ''}`}
                value={form.eventsAttended}
                onChange={(e) => setField('eventsAttended', e.target.value === '' ? 0 : Number(e.target.value))}
              />
              {errors.eventsAttended && <div className="member-error-text">{errors.eventsAttended}</div>}
            </div>
          </div>

          <div className="member-field-group">
            <label className="member-label" htmlFor="memberCreated">Member Since (optional)</label>
            <input
              id="memberCreated"
              type="date"
              className={`member-date ${errors.memberCreated ? 'error' : ''}`}
              value={form.memberCreated}
              onChange={(e) => setField('memberCreated', e.target.value)}
            />
          </div>

          <div className="member-actions">
            <button
              type="submit"
              className="member-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Member'}
            </button>
            <button
              type="button"
              className="member-cancel-btn"
              onClick={() => navigate('/admin/membership-mgmt/display')}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateMember;
