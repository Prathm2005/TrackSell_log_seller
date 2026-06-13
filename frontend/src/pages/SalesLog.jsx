import { useState, useEffect } from "react";
import api from "../api/axios";
const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];

const SalesLog = () => {
    const [sales, setSales]       = useState([]);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading]   = useState(true);

    const [from, setFrom] = useState(today());
    const [to, setTo]     = useState(today());

    const [saleDate, setSaleDate] = useState(today());
    const [note, setNote]         = useState("");
    const [items, setItems]       = useState([{ product: "", name: "", price: 0, quantity: 1 }]);

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);

    const fetchProducts = async () => {
        try {
            const {data}=await api.get("/product");
            setProducts(data);
        } catch (error) {
            console.log(error.message);
            
        }
    };
    const fetchSales = async (f = from, t = to) => {
        setLoading(true);
        try {
          const { data } = await api.get(`/sale?from=${f}&to=${t}`);
          setSales(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleProductChange = (index, productId) => {
        const product = products.find((p) => p._id === productId);
        const updated = [...items];
        updated[index] = {
          product: productId,
          name:    product?.name || "",
          price:   product?.price || 0,
          quantity: updated[index].quantity,
        };
        setItems(updated);
    };
    const handleQtyChange = (index, qty) => {
        const updated = [...items];
        updated[index].quantity = Number(qty);
        setItems(updated);
    };

    const handlePriceChange = (index, price) => {
        const updated = [...items];
        updated[index].price = Number(price);
        setItems(updated);
    };

    const addItemRow = () => setItems([...items, { product: "", name: "", price: 0, quantity: 1 }]);
    const removeItemRow = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validItems = items.filter((i) => i.product && i.quantity > 0);
        if (validItems.length === 0) return alert("Add at least one product");
        try {
          const { data } = await api.post("/sale", { items: validItems, date: saleDate, note });
          setSales([data, ...sales]);
          resetForm();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this sale entry?")) return;
        await api.delete(`/sale/${id}`);
        setSales(sales.filter((s) => s._id !== id));
    };

    const resetForm = () => {
        setItems([{ product: "", name: "", price: 0, quantity: 1 }]);
        setSaleDate(today()); setNote(""); setShowForm(false);
    };

    const exportCSV = () => {
        const rows = [["Date", "Product", "Quantity", "Price", "Total", "Note"]];
        sales.forEach((sale) => {
          sale.items.forEach((item) => {
            rows.push([
              new Date(sale.date).toLocaleDateString("en-IN"),
              item.name, item.quantity, item.price, item.total,
              sale.note || "",
            ]);
          });
        });
        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = `sale_${from}_to_${to}.csv`; a.click();
        URL.revokeObjectURL(url);
    };
    const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Sales Log</h1>
            <p className="text-slate-400 text-sm mt-1">Record and review your daily sales</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + Log Sale
          </button>
        </div>
 
        {/* Date filter + export */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none" />
          </div>
          <button onClick={() => fetchSales(from, to)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
            Filter
          </button>
          <button onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ml-auto">
            ⬇ Export CSV
          </button>
        </div>
 
        {/* Revenue summary for filtered range */}
        {sales.length > 0 && (
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 mb-6 flex justify-between items-center">
            <span className="text-slate-300">{sales.length} sale entries in selected range</span>
            <span className="text-indigo-400 font-bold text-xl">{rupee(totalRevenue)}</span>
          </div>
        )}
 
        {/* Add Sale Form */}
        {showForm && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Log New Sale</h2>
 
            {products.length === 0 ? (
              <div className="text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                ⚠️ No products found. Please add products first from the Products page.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date + Note */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Sale Date</label>
                    <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Note (optional)</label>
                    <input value={note} onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. bulk order, festival sale" />
                  </div>
                </div>
 
                {/* Items rows */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Items Sold</label>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        {/* Product picker */}
                        <select value={item.product} onChange={(e) => handleProductChange(i, e.target.value)}
                          className="col-span-5 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm">
                          <option value="">-- Pick product --</option>
                          {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                        {/* Quantity */}
                        <input type="number" min="1" value={item.quantity} onChange={(e) => handleQtyChange(i, e.target.value)}
                          className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                          placeholder="Qty" />
                        {/* Price (editable — may differ from default) */}
                        <input type="number" min="0" step="0.01" value={item.price} onChange={(e) => handlePriceChange(i, e.target.value)}
                          className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                          placeholder="₹ Price" />
                        {/* Row total */}
                        <div className="col-span-2 text-green-400 font-medium text-sm text-right">
                          {rupee(item.quantity * item.price)}
                        </div>
                        {/* Remove row */}
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItemRow(i)}
                            className="col-span-1 text-red-400 hover:text-red-300 text-lg font-bold">×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addItemRow}
                    className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">
                    + Add another item
                  </button>
                </div>
 
                {/* Grand total preview */}
                <div className="text-right text-white font-bold text-lg border-t border-slate-700 pt-3">
                  Grand Total: {rupee(items.reduce((sum, i) => sum + i.quantity * i.price, 0))}
                </div>
 
                <div className="flex gap-3">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
                    Save Sale
                  </button>
                  <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
 
        {/* Sales list */}
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : sales.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <div className="text-4xl mb-3">🧾</div>
            <p>No sales found for this date range.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div key={sale._id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                {/* Sale header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">
                      📅 {new Date(sale.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {sale.note && <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">{sale.note}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">{rupee(sale.grandTotal)}</span>
                    <button onClick={() => handleDelete(sale._id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-slate-700 hover:bg-red-900/30 rounded transition">
                      Delete
                    </button>
                  </div>
                </div>
                {/* Items */}
                <div className="px-4 py-2 space-y-1">
                  {sale.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.name} × {item.quantity}</span>
                      <span className="text-slate-400">{rupee(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesLog