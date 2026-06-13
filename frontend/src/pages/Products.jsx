import { useState, useEffect } from "react";
import api from "../api/axios";

const CATEGORIES = ["Food & Snacks", "Beverages", "Dairy", "Personal Care", "Household", "Stationery", "Tobacco", "Other"];
const emptyForm = { name: "", category: "Food & Snacks", price: "", unit: "piece" };

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm]         = useState(emptyForm);
    const [editId, setEditId]     = useState(null);
    const [loading, setLoading]   = useState(true);

    useEffect(()=>{
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        try {
          const { data } = await api.get("/product");
          setProducts(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (editId) {
            const { data } = await api.put(`/product/${editId}`, form);
            setProducts(products.map((p) => p._id === editId ? data : p));
          } else {
            const { data } = await api.post("/product", form);
            setProducts([...products, data]);
          }
          resetForm();
        } catch (err) { console.error(err); }
      };
      const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        await api.delete(`/product/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      };

      const startEdit = (p) => {
        setForm({ name: p.name, category: p.category, price: p.price, unit: p.unit });
        setEditId(p._id);
        setShowForm(true);
      };

      const resetForm = () => { setForm(emptyForm); setEditId(null); setShowForm(false); };
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-slate-400 text-sm mt-1">Add your products once, use them every day while logging sales</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + Add Product
          </button>
        </div>
 
       
        {showForm && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Maggi 70g" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Unit</label>
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  {["piece", "packet", "kg", "litre", "dozen", "box"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Default Price (₹) *</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 12" required />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
                  {editId ? "Update" : "Add Product"}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
 
       
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <div className="text-4xl mb-3">📦</div>
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p._id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-slate-400 text-sm mt-0.5">
                    {p.category} · {p.unit}
                  </div>
                  <div className="text-green-400 font-semibold mt-1">₹{p.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-slate-700 hover:bg-red-900/30 rounded transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products