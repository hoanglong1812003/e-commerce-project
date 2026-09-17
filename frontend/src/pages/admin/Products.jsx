import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { listProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import { formatVnd } from "../../utils/format";

const emptyForm = { name: "", description: "", price: "", stock: "", category: "", imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product id or "new" or null
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    listProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setFile(null);
    setError("");
    setEditing("new");
  }

  function startEdit(p) {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      imageUrl: p.imageUrl || "",
    });
    setFile(null);
    setError("");
    setEditing(p.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("category", form.category);
      if (file) data.append("image", file);
      else if (form.imageUrl) data.append("imageUrl", form.imageUrl);

      if (editing === "new") {
        await createProduct(data);
      } else {
        await updateProduct(editing, data);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xóa sản phẩm này?")) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Sản phẩm</h1>
        <button
          onClick={startCreate}
          className="flex items-center gap-1 rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-ink-900">
              {editing === "new" ? "Thêm sản phẩm mới" : "Sửa sản phẩm"}
            </h2>
            <button type="button" onClick={() => setEditing(null)} className="text-ink-400 hover:text-ink-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-700">Tên sản phẩm</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-700">Danh mục</label>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-700">Giá (VND)</label>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-700">Tồn kho</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink-700">Mô tả</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-700">Ảnh sản phẩm (tải lên)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-700">... hoặc dán URL ảnh</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-ink-200 px-3 py-2 outline-none ring-brand-300 focus:ring-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-full bg-brand-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-ink-500">Đang tải...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-ink-500">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3 text-right">Giá</th>
                <th className="px-4 py-3 text-right">Tồn kho</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-ink-100">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                      {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium text-ink-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{p.category}</td>
                  <td className="px-4 py-3 text-right text-ink-900">{formatVnd(p.price)}</td>
                  <td className="px-4 py-3 text-right text-ink-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 hover:text-brand-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
