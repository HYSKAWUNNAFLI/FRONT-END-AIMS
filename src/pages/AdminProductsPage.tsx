import { FormEvent, useEffect, useMemo, useState } from 'react';
import './AdminProductsPage.css';
import type { Product, ProductInput, Category } from '../types';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

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
        setError(err?.message || 'Khong tai duoc danh sach san pham');
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
      setError(err?.message || 'Loi luu san pham');
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
      setError(err?.message || 'Khong the xoa san pham');
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
      setError(err?.message || 'Loi cap nhat san pham');
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Admin - Quản lý sản phẩm</h1>
          <p className="muted">Trang nay se duoc bao ve bang role (auth) o backend, sau do redirect admin vao.</p>
        </div>
        <button className="btn light" type="button" onClick={resetForm}>
          +
        </button>
      </header>

      <section className="admin-panel">
        <h3>Thêm sản phẩm</h3>
        {error && <div className="admin-error">{error}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Tiêu đề</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field two-col">
            <div>
              <label>Danh mục</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Thể loại</label>
              <input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
            </div>
          </div>
          <div className="field two-col">
            <div>
              <label>Giá</label>
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
              <label>Tồn kho</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Hình ảnh (URL)</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="field">
            <label>Mô tả ngắn</label>
            <textarea rows={2} value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} />
          </div>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? 'Dang luu...' : 'Tao moi'}
            </button>
            <button className="btn light" type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="list-header">
          <h3>Danh sach san pham</h3>
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="muted">Dang tai...</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
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
                          Sua
                        </button>
                        <button className="btn primary" type="button" onClick={() => handleDelete(product.id)}>
                          Xoa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <p className="muted">Khong co san pham.</p>}
          </div>
        )}
      </section>

      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Chinh sua san pham</h3>
              <button className="btn light" type="button" onClick={() => setEditingProduct(null)}>
                Dong
              </button>
            </div>
            <div className="admin-form">
              <div className="field">
                <label>Tieu de</label>
                <input
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                />
              </div>
              <div className="field two-col">
                <div>
                  <label>Danh muc</label>
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
                  <label>The loai</label>
                  <input
                    value={editingProduct.genre}
                    onChange={e => setEditingProduct({ ...editingProduct, genre: e.target.value })}
                  />
                </div>
              </div>
              <div className="field two-col">
                <div>
                  <label>Gia</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label>Ton kho</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="field">
                <label>Hinh anh (URL)</label>
                <input
                  value={editingProduct.image}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Mo ta ngắn</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDesc}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                />
              </div>
              <div className="actions">
                <button className="btn primary" type="button" disabled={editSaving} onClick={handleEditSave}>
                  {editSaving ? 'Dang luu...' : 'Cap nhat'}
                </button>
                <button className="btn light" type="button" onClick={() => setEditingProduct(null)}>
                  Huy
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
