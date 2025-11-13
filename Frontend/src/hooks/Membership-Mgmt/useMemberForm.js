import { useMemo, useState } from 'react';

const isTitleToken = (token) => /^[A-Z][a-z]*$/.test(token);
const isTitleCase = (name) => {
  const trimmed = (name || '').trim();
  if (!trimmed) return false;
  return trimmed
    .split(/([\s\-'])/)
    .filter((t) => !/[\s\-']/.test(t))
    .every(isTitleToken);
};

const useMemberForm = (initial) => {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const sanitizePhone = (raw) => {
    if (raw == null) return '';

    if (typeof raw === 'object') {
      if ('value' in raw && raw.value != null) raw = raw.value; else raw = JSON.stringify(raw);
    }
    let s = String(raw).trim();

    s = s.replace(/[^0-9]/g, '');
    return s;
  };

  const validate = () => {
    const e = {};
    const firstName = typeof form.firstName === 'string' ? form.firstName.trim() : '';
    const lastName = typeof form.lastName === 'string' ? form.lastName.trim() : '';
    const email = typeof form.email === 'string' ? form.email.trim() : '';
    const phone = sanitizePhone(form.phoneNumber);

    if (!firstName) e.firstName = 'First name is required';
    else if (!isTitleCase(firstName)) e.firstName = 'Use Title Case';

    if (!lastName) e.lastName = 'Last name is required';
    else if (!isTitleCase(lastName)) e.lastName = 'Use Title Case';

    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Invalid email format';

    if (!phone) e.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(phone)) e.phoneNumber = 'Enter 10-15 digits only';

    if (form.eventsAttended < 0) e.eventsAttended = 'Must be ≥ 0';

    if (form.phoneNumber !== phone) {
      setForm((prev) => ({ ...prev, phoneNumber: phone }));
    }

    return e;
  };

  return { form, setField, errors, setErrors, validate };
};

export default useMemberForm;
export { isTitleCase };
