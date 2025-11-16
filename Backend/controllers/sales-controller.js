const Sale = require('../models/sales-model');
const Product = require('../models/product-model');

const parsePagination = (page, limit) => {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  return { p, l };
};

// generate a short order id (alphanumeric), attempt uniqueness check against DB
const generateOrderId = async (len = 10) => {
  const make = () => {
    // base36 timestamp gives compact time component, add random base36 chars
    const t = Date.now().toString(36);
    const r = Math.random().toString(36).slice(2);
    return (t + r).slice(0, len).toUpperCase();
  };

  // keep trying to avoid duplicates
  for (let i = 0; i < 6; i++) {
    const candidate = make();
    // check if exists
    const found = await Sale.exists({ orderId: candidate });
    if (!found) return candidate;
  }
  // fallback random long id
  return make();
};

const listSales = async (req, res) => {
  try {
    const { search = '', status, page = 1, limit = 10, sort = 'createdAt:desc' } = req.query;
    const { p, l } = parsePagination(page, limit);

    const query = {};
    if (search) {
      const rx = { $regex: search, $options: 'i' };
      // search in customerName, productName, or _id
      query.$or = [{ customerName: rx }, { productName: rx }, { _id: rx }];
    }
    if (status) {
      const statusList = String(status).split(',').map((s) => s.trim()).filter(Boolean);
      if (statusList.length === 1) query.status = statusList[0];
      else query.status = { $in: statusList };
    }

    // simple sort handling
    let sortQuery = { createdAt: -1 };
    if (sort) {
      const [field, dir] = String(sort).split(':');
      sortQuery = { [field || 'createdAt']: dir === 'asc' ? 1 : -1 };
    }

    const total = await Sale.countDocuments(query);
    const items = await Sale.find(query)
      .sort(sortQuery)
      .skip((p - 1) * l)
      .limit(l)
      .lean();

    res.json({ sales: items, totalPages: Math.ceil(total / l) || 1 });
  } catch (err) {
    console.error('Error listing sales:', err);
    res.status(500).json({ message: 'Server error fetching sales' });
  }
};

const createSale = async (req, res) => {
  try {
    const { customerName, productId, quantity = 1, status, createdAt } = req.body;

    if (!customerName || String(customerName).trim() === '') {
      return res.status(400).json({ message: 'customerName is required' });
    }
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const qty = Number(quantity) || 1;
    if (qty < 1) return res.status(400).json({ message: 'quantity must be >= 1' });

    // load product document so we can update quantity
    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: 'Invalid productId' });

    if (typeof product.quantity === 'number' && product.quantity < qty) {
      return res.status(400).json({ message: 'Insufficient stock for selected product' });
    }

    // compute total from product price to avoid client manipulation
    const unitPrice = Number(product.price || 0);
    const computedTotal = unitPrice * qty;

    // decrements product inventory
    if (typeof product.quantity === 'number') {
      product.quantity = product.quantity - qty;
      if (product.quantity < 0) product.quantity = 0;
      await product.save();
    }

    const orderId = await generateOrderId(10); // <= 12 chars as requested

    const payload = {
      orderId,
      customerName: String(customerName).trim(),
      productId: product._id,
      productName: product.title || product.name || product.productName || String(product._id),
      quantity: qty,
      total: computedTotal,
      status: status || 'Pending',
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const created = await Sale.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating sale:', err);
    res.status(500).json({ message: 'Server error creating sale' });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Sale.findById(id);
    if (!existing) return res.status(404).json({ message: 'Sale not found' });
    await Sale.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting sale:', err);
    res.status(500).json({ message: 'Server error deleting sale' });
  }
};

module.exports = { listSales, createSale, deleteSale };