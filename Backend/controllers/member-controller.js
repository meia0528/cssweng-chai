const Member = require('../models/member-model');

const parsePagination = (page, limit) => {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  return { p, l };
};

const buildSort = (sort) => {
  const allowed = new Set(['memberCreated', 'firstName', 'lastName', 'email', 'eventsAttended', 'createdAt', 'name']);
  let field = 'memberCreated';
  let dir = -1;
  if (sort) {
    const [f, d] = String(sort).split(':');
    if (f && allowed.has(f)) field = f;
    dir = d === 'asc' ? 1 : -1;
  }
  if (field === 'name') {
    return { firstName: dir, lastName: dir };
  }
  return { [field]: dir };
};

const listMembers = async (req, res) => {
  try {
    const { q = '', status, page = 1, limit = 10, sort = 'memberCreated:desc' } = req.query;
    const { p, l } = parsePagination(page, limit);

    const query = {};
    if (q) {
      const rx = { $regex: q, $options: 'i' };
      query.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }];
    }
    if (status) query.membershipStatus = status;

    const sortQuery = buildSort(sort);

    const total = await Member.countDocuments(query);
    let mongoQuery = Member.find(query)
      .sort(sortQuery)
      .skip((p - 1) * l)
      .limit(l);
    const needsCollation =
      Object.prototype.hasOwnProperty.call(sortQuery, 'firstName') ||
      Object.prototype.hasOwnProperty.call(sortQuery, 'lastName') ||
      Object.prototype.hasOwnProperty.call(sortQuery, 'email');
    if (needsCollation) {
      mongoQuery = mongoQuery.collation({ locale: 'en', strength: 2 });
    }
    const items = await mongoQuery.lean();

    res.json({
      items,
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) || 1 },
    });
  } catch (err) {
    console.error('Error listing members:', err);
    res.status(500).json({ message: 'Server error fetching members' });
  }
};

const isTitleToken = (token) => /^[A-Z][a-z]*$/.test(token);
const isTitleCase = (name) => {
  const trimmed = (name || '').trim();
  if (!trimmed) return false;
  return trimmed
    .split(/([\s\-'])/)
    .filter((t) => !/[\s\-']/.test(t))
    .every(isTitleToken);
};

const createMember = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      membershipStatus, // optional
      eventsAttended, // optional
      memberCreated, // optional
    } = req.body;

    if (!firstName || !isTitleCase(firstName)) {
      return res.status(400).json({ message: 'Invalid firstName: must be Title Case' });
    }
    if (!lastName || !isTitleCase(lastName)) {
      return res.status(400).json({ message: 'Invalid lastName: must be Title Case' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: 'phoneNumber is required' });
    }

    const exists = await Member.exists({ firstName, lastName });
    if (exists) {
      return res.status(409).json({
        message: `Member with the same name already exists (${firstName} ${lastName})`,
      });
    }

    let effectiveEvents = typeof eventsAttended === 'number' ? eventsAttended : 0;
    let effectiveStatus = membershipStatus || 'Pending';
    if (effectiveStatus === 'Pending' && effectiveEvents >= 3) {
      effectiveStatus = 'Active';
    }

    const payload = {
      firstName,
      lastName,
      email: email || undefined,
      phoneNumber,
      membershipStatus: effectiveStatus,
      eventsAttended: effectiveEvents,
      memberCreated: memberCreated ? new Date(memberCreated) : new Date(),
    };

    const created = await Member.create(payload);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      const fields = err.keyPattern ? Object.keys(err.keyPattern) : Object.keys(err.keyValue || {});
      const isPhone = fields.includes('phoneNumber') || /phoneNumber/.test(err.message || '');
      const msg = isPhone ? 'Phone number is already in use' : 'Member with the same name already exists';
      console.warn('E11000 duplicate key on createMember', { code: err.code, keyValue: err.keyValue, fields, msg: err.message });
      return res.status(409).json({
        message: msg,
        details: err.keyValue || undefined,
        fields,
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.errors });
    }
    console.error('Error creating member:', err);
    res.status(500).json({ message: 'Server error creating member' });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      membershipStatus,
      eventsAttended,
      memberCreated,
    } = req.body;

    if (firstName !== undefined && !isTitleCase(firstName)) {
      return res.status(400).json({ message: 'Invalid firstName: must be Title Case' });
    }
    if (lastName !== undefined && !isTitleCase(lastName)) {
      return res.status(400).json({ message: 'Invalid lastName: must be Title Case' });
    }
    if (phoneNumber !== undefined && !phoneNumber) {
      return res.status(400).json({ message: 'phoneNumber cannot be empty' });
    }

    const current = await Member.findById(id).lean();
    if (!current) return res.status(404).json({ message: 'Member not found' });
    const nextFirst = firstName !== undefined ? firstName : current.firstName;
    const nextLast = lastName !== undefined ? lastName : current.lastName;
    const nameClash = await Member.exists({ firstName: nextFirst, lastName: nextLast, _id: { $ne: id } });
    if (nameClash) {
      return res.status(409).json({ message: 'Member with the same name already exists' });
    }

    const update = {
      firstName,
      lastName,
      email: email || undefined,
      phoneNumber,
    };
    if (eventsAttended !== undefined) update.eventsAttended = eventsAttended;
    if (memberCreated !== undefined) update.memberCreated = new Date(memberCreated);

    // Promotion logic pre-update: evaluate next state
    const nextEvents = update.eventsAttended !== undefined ? update.eventsAttended : current.eventsAttended;
    let nextStatus = membershipStatus !== undefined ? membershipStatus : current.membershipStatus;
    if (nextStatus === 'Pending' && nextEvents >= 3) {
      nextStatus = 'Active';
    }
    update.membershipStatus = nextStatus;

    const updated = await Member.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      const fields = err.keyPattern ? Object.keys(err.keyPattern) : Object.keys(err.keyValue || {});
      const isPhone = fields.includes('phoneNumber') || /phoneNumber/.test(err.message || '');
      const msg = isPhone ? 'Phone number is already in use' : 'Member with the same name already exists';
      console.warn('E11000 duplicate key on updateMember', { code: err.code, keyValue: err.keyValue, fields, msg: err.message });
      return res.status(409).json({
        message: msg,
        details: err.keyValue || undefined,
        fields,
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.errors });
    }
    console.error('Error updating member:', err);
    res.status(500).json({ message: 'Server error updating member' });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Member.findById(id);
    if (!existing) return res.status(404).json({ message: 'Member not found' });
    await Member.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ message: 'Server error deleting member' });
  }
};

const exportMembers = async (req, res) => {
  // Stream a CSV export of members, respecting search/filter/sort.
  try {
    const {
      q = '',
      status,
      sort = 'memberCreated:desc',
      columns,
      limit,
    } = req.query;

    // Build query (reuse search behavior from listMembers)
    const query = {};
    if (q) {
      const rx = { $regex: q, $options: 'i' };
      query.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }];
    }
    if (status) query.membershipStatus = status;

    // Sorting and collation (case-insensitive for name/email)
    const sortQuery = buildSort(sort);
    const needsCollation =
      Object.prototype.hasOwnProperty.call(sortQuery, 'firstName') ||
      Object.prototype.hasOwnProperty.call(sortQuery, 'lastName') ||
      Object.prototype.hasOwnProperty.call(sortQuery, 'email');

    // Columns handling
    const defaultCols = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'membershipStatus',
      'eventsAttended',
      'memberCreated',
    ];
    const selectedCols = Array.isArray(columns)
      ? columns
      : typeof columns === 'string' && columns.trim()
        ? columns.split(',').map((c) => c.trim()).filter(Boolean)
        : defaultCols;

    // Enforce a maximum export row count to prevent abuse
    const hardMax = 50000;
    const maxRows = Math.min(Math.max(parseInt(limit, 10) || hardMax, 1), hardMax);

    // Prepare response headers (UTF-8 with BOM for Excel compatibility)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const filename = `Members_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    // CSV helpers
    const CRLF = '\r\n';
    const bom = Buffer.from([0xef, 0xbb, 0xbf]);
    const escapeCell = (v) => {
      if (v === null || v === undefined) return '""';
      let s = String(v);
      s = s.replace(/"/g, '""');
      return `"${s}"`;
    };
    const formatDate = (d) => {
      if (!d) return '';
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return '';
      const mm = pad(dt.getMonth() + 1);
      const dd = pad(dt.getDate());
      return `${dt.getFullYear()}-${mm}-${dd}`;
    };

    // Write BOM and header
    res.write(bom);
    res.write(selectedCols.map((c) => escapeCell(c)).join(',') + CRLF);

    // Build cursor and stream rows
    let cursor = Member.find(query)
      .sort(sortQuery)
      .select(selectedCols.join(' '))
      .lean()
      .cursor();
    if (needsCollation) {
      // Collation must be applied on the query; rebuild with collation by using query chain pre-cursor
      const q = Member.find(query)
        .sort(sortQuery)
        .collation({ locale: 'en', strength: 2 })
        .select(selectedCols.join(' '))
        .lean();
      cursor = q.cursor();
    }

    let count = 0;
    for await (const doc of cursor) {
      // Stop if exceeding maxRows
      if (count >= maxRows) break;
      const row = selectedCols.map((col) => {
        let val = doc[col];
        if (col === 'memberCreated') val = formatDate(val);
        if (col === 'eventsAttended' && typeof val === 'number') val = String(val);
        return escapeCell(val == null ? '' : val);
      });
      res.write(row.join(',') + CRLF);
      count += 1;
    }

    return res.end();
  } catch (err) {
    console.error('Error exporting members:', err);
    // If headers already sent, just end the stream
    if (res.headersSent) {
      try { return res.end(); } catch (_) { /* noop */ }
      return; 
    }
    res.status(500).json({ message: 'Server error exporting members' });
  }
};

module.exports = { listMembers, createMember, updateMember, deleteMember, exportMembers };
