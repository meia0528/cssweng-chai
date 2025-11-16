import '../../assets/css/Sales-Mgmt/create-sale.css';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['Pending', 'Completed', 'Refunded', 'Cancelled'];

const initialForm = {
  customerName: '',
  total: '',
  status: 'Pending',
  saleDate: '',
  productId: '',
  quantity: 1,
};

const CreateSale = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
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

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (form.total === '' || Number.isNaN(Number(form.total))) newErrors.total = 'Total is required';
    else if (Number(form.total) < 0) newErrors.total = 'Total must be ≥ 0';
    if (!form.productId) newErrors.productId = 'Product selection is required';
    if (form.quantity === '' || Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 1) newErrors.quantity = 'Quantity must be ≥ 1';
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
      const payload = {
        customerName: form.customerName.trim(),
        total: Number(form.total),
        status: form.status,
        productId: form.productId,
        quantity: Number(form.quantity),
      };
      if (form.saleDate) payload.createdAt = form.saleDate;

      await axios.post('http://localhost:5000/sales', payload, { headers: { 'Content-Type': 'application/json', ...authHeaders } });

      setAlert({ message: 'Sale created successfully', type: 'success' });
      setTimeout(() => {
        navigate('/admin/sales-mgmt/display');
      }, 1200);
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Failed to create sale', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/product-mgmt/fetch-products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { page: 1, limit: 200 }
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch products for sale creation', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="create-sale-body">
      {alert.message && (
        <div className={`sale-alert-section sale-alert-${alert.type}`}>{alert.message}</div>
      )}
      <section className="sale-form-section">
        <h2>Add Sale</h2>
        <form onSubmit={handleSubmit}>
          <div className="sale-field-group">
            <label className="sale-label" htmlFor="customerName">Customer</label>
            <input
              id="customerName"
              className={`sale-input ${errors.customerName ? 'error' : ''}`}
              value={form.customerName}
              onChange={(e) => setField('customerName', e.target.value)}
              placeholder="Customer name"
              required
            />
            {errors.customerName && <div className="sale-error-text">{errors.customerName}</div>}
          </div>

          <div className="sale-field-group">
            <label className="sale-label" htmlFor="productId">Product</label>
            <select
              id="productId"
              className={`sale-select ${errors.productId ? 'error' : ''}`}
              value={form.productId}
              onChange={(e) => setField('productId', e.target.value)}
            >
              <option value="">-- Select product --</option>
              {products.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name || p.title || p.productName}</option>
              ))}
            </select>
            {errors.productId && <div className="sale-error-text">{errors.productId}</div>}
          </div>

          <div className="sale-field-group-inline">
            <div className="sale-field-group" style={{ flex: 1 }}>
              <label className="sale-label" htmlFor="total">Total</label>
              <input
                id="total"
                type="number"
                step="0.01"
                min="0"
                className={`sale-input ${errors.total ? 'error' : ''}`}
                value={form.total}
                onChange={(e) => setField('total', e.target.value)}
                placeholder="0.00"
                required
              />
              {errors.total && <div className="sale-error-text">{errors.total}</div>}
            </div>

            <div className="sale-field-group" style={{ flex: 1 }}>
              <label className="sale-label" htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                className={`sale-input ${errors.quantity ? 'error' : ''}`}
                value={form.quantity}
                onChange={(e) => setField('quantity', e.target.value === '' ? '' : Number(e.target.value))}
              />
              {errors.quantity && <div className="sale-error-text">{errors.quantity}</div>}
            </div>
          </div>

          <div className="sale-field-group">
            <label className="sale-label" htmlFor="status">Status</label>
            <select
              id="status"
              className={`sale-select ${errors.status ? 'error' : ''}`}
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="sale-field-group">
            <label className="sale-label" htmlFor="saleDate">Date (optional)</label>
            <input
              id="saleDate"
              type="datetime-local"
              className="sale-date"
              value={form.saleDate}
              onChange={(e) => setField('saleDate', e.target.value)}
            />
          </div>

          <div className="sale-actions">
            <button
              type="submit"
              className="sale-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Sale'}
            </button>

            <button
              type="button"
              className="sale-cancel-btn"
              onClick={() => navigate('/admin/sales-mgmt/display')}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateSale;
