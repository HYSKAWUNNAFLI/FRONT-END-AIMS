import { FormEvent, useEffect, useMemo, useState } from 'react';
import './AdminProductsPage.css';
import type { Product, ProductInput, Category } from '../types';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const detailFields: Record<Category, Array<{ key: string; label: string }>> = {
  Book: [
    { key: 'cover_type', label: 'Cover type' },
    { key: 'genre', label: 'Genre' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'publication_date', label: 'Publication date' },
    { key: 'language', label: 'Language' },
    { key: 'authors', label: 'Authors' },
    { key: 'n_pages', label: 'Pages' },
  ],
  CD: [
    { key: 'artist', label: 'Artist' },
    { key: 'record_label', label: 'Record label' },
    { key: 'music_type', label: 'Music type' },
    { key: 'release_date', label: 'Release date' },
    { key: 'tracks', label: 'Tracks' },
  ],
  DVD: [
    { key: 'disc_type', label: 'Disc type' },
    { key: 'director', label: 'Director' },
    { key: 'runtime', label: 'Runtime' },
    { key: 'studio', label: 'Studio' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'release_date', label: 'Release date' },
  ],
  Newspaper: [
    { key: 'publisher', label: 'Publisher' },
    { key: 'editor_in_chief', label: 'Editor in chief' },
    { key: 'issue_number', label: 'Issue number' },
    { key: 'publication_date', label: 'Publication date' },
    { key: 'publication_frequency', label: 'Publication frequency' },
    { key: 'language', label: 'Language' },
    { key: 'issn', label: 'ISSN' },
    { key: 'sections', label: 'Sections' },
  ],
};

const defaultForm: ProductInput = {
  title: '',
  category: 'Book',
  genre: '',
  price: 0,
  stock: 0,
  image: '',
  shortDesc: '',
  details: {},
};

const categories: Category[] = ['Book', 'CD', 'Newspaper', 'DVD'];

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<ProductInput>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await listProducts({ page: 1, size: 200 });
        setProducts(res?.items ?? []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(defaultForm);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await createProduct(form);
      setProducts(prev => [created, ...prev]);
      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editingProduct?.id === id) setEditingProduct(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  const handleEditSave = async () => {
    if (!editingProduct) return;
    setEditSaving(true);
    setError('');
    try {
      const updated = await updateProduct(editingProduct.id, editingProduct);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update product');
    } finally {
      setEditSaving(false);
    }
  };

  const renderDetailInputs = (
    category: Category,
    details: Record<string, string | number | undefined> | undefined,
    onChange: (key: string, value: string) => void,
  ) => {
    const fields = detailFields[category] || [];
    if (!fields.length) return null;
    return (
      <div className="detail-grid">
        {fields.map(field => (
          <div className="field" key={`${category}-${field.key}`}>
            <label>{field.label}</label>
            <input
              value={(details && (details as any)[field.key]) ?? ''}
              onChange={e => onChange(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Admin - Product Management</h1>
          <p className="muted">This page will be role-protected on the backend, then redirect admin in.</p>
        </div>
      </header>

      <section className="admin-panel">
        <h3>Add product</h3>
        {error && <div className="admin-error">{error}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field two-col">
            <div>
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Genre</label>
              <input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
            </div>
          </div>
          <div className="field two-col">
            <div>
              <label>Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          {renderDetailInputs(form.category, form.details, (key, value) =>
            setForm(prev => ({ ...prev, details: { ...(prev.details || {}), [key]: value } })),
          )}
          <div className="field">
            <label>Image (URL)</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="field">
            <label>Short description</label>
            <textarea rows={2} value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} />
          </div>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create'}
            </button>
            <button className="btn light" type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="list-header">
          <h3>Product list</h3>
          <input
            className="search-input"
            placeholder="Search by title, category, genre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filteredProducts ?? []).map(product => (
                  <tr key={product.id}>
                    <td className="title-cell">
                      <div className="title-row">
                        {product.image && <img src={product.image} alt={product.title} />}
                        <div>
                          <div>{product.title}</div>
                          <div className="muted small">{product.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td className="muted small">{product.shortDesc}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn light" type="button" onClick={() => setEditingProduct(product)}>
                          Edit
                        </button>
                        <button className="btn primary" type="button" onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <p className="muted">No products.</p>}
          </div>
        )}
      </section>

      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit product</h3>
              <button className="btn light" type="button" onClick={() => setEditingProduct(null)}>
                Close
              </button>
            </div>
            <div className="admin-form">
              <div className="field">
                <label>Title</label>
                <input
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                />
              </div>
              <div className="field two-col">
                <div>
                  <label>Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, category: e.target.value as Category })
                    }
                  >
                    {categories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Genre</label>
                  <input
                    value={editingProduct.genre}
                    onChange={e => setEditingProduct({ ...editingProduct, genre: e.target.value })}
                  />
                </div>
              </div>
              <div className="field two-col">
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  />
                </div>
              </div>
              {renderDetailInputs(editingProduct.category, editingProduct.details, (key, value) =>
                setEditingProduct({
                  ...editingProduct,
                  details: { ...(editingProduct.details || {}), [key]: value },
                }),
              )}
              <div className="field">
                <label>Image (URL)</label>
                <input
                  value={editingProduct.image}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Short description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDesc}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                />
              </div>
              <div className="actions">
                <button className="btn primary" type="button" disabled={editSaving} onClick={handleEditSave}>
                  {editSaving ? 'Saving...' : 'Update'}
                </button>
                <button className="btn light" type="button" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
