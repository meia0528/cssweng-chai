const Member = require('../models/member-model');

const parsePagination = (page, limit) => {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  return { p, l };
};

const buildSort = (sort) => {
  const allowed = new Set(['memberCreated', 'firstName', 'lastName', 'email', 'eventsAttended', 'createdAt']);
  let field = 'memberCreated';
  let dir = -1;
  if (sort) {
    const [f, d] = String(sort).split(':');
    if (f && allowed.has(f)) field = f;
    dir = d === 'asc' ? 1 : -1;
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
    const items = await Member.find(query)
      .sort(sortQuery)
      .skip((p - 1) * l)
      .limit(l)
      .lean();

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
      return res.status(409).json({ message: 'Member with the same name already exists' });
    }

    const payload = {
      firstName,
      lastName,
      email: email || undefined,
      phoneNumber,
      membershipStatus,
      eventsAttended: typeof eventsAttended === 'number' ? eventsAttended : undefined,
      memberCreated: memberCreated ? new Date(memberCreated) : new Date(),
    };

    const created = await Member.create(payload);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Member with the same name already exists' });
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
      membershipStatus,
    };
    if (eventsAttended !== undefined) update.eventsAttended = eventsAttended;
    if (memberCreated !== undefined) update.memberCreated = new Date(memberCreated);

    const updated = await Member.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Member with the same name already exists' });
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
  try {
    const hasCreds = !!(
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      (process.env.GOOGLE_CREDENTIALS_B64 || process.env.GOOGLE_CREDENTIALS_PATH)
    );
    if (!hasCreds) {
      return res.status(400).json({
        message:
          'Google Sheets export not configured. Set GOOGLE_SHEETS_SPREADSHEET_ID and GOOGLE_CREDENTIALS_B64 or GOOGLE_CREDENTIALS_PATH.',
      });
    }
    return res.status(501).json({ message: 'Export not implemented yet.' });
  } catch (err) {
    console.error('Error exporting members:', err);
    res.status(500).json({ message: 'Server error exporting members' });
  }
};

module.exports = { listMembers, createMember, updateMember, deleteMember, exportMembers };
