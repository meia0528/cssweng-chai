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

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = 'First name is required';
    else if (!isTitleCase(form.firstName)) e.firstName = 'Use Title Case';

    if (!form.lastName?.trim()) e.lastName = 'Last name is required';
    else if (!isTitleCase(form.lastName)) e.lastName = 'Use Title Case';

    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Invalid email format';

    if (!form.phoneNumber?.trim()) e.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(form.phoneNumber.trim())) e.phoneNumber = 'Enter 10-15 digits only';

    if (form.eventsAttended < 0) e.eventsAttended = 'Must be ≥ 0';

    return e;
  };

  return { form, setField, errors, setErrors, validate };
};

export default useMemberForm;
export { isTitleCase };
