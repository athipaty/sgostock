import { useState } from "react";
import ImageUpload from "./ImageUpload";
import LocationDropdown from "./LocationDropdown";
import { createProduct, updateProduct, deleteProduct } from "../api/products";

const LOCATIONS = ["Freezer", "Chiller", "Rack 1", "Rack 2", "Kitchen"];

const empty = { name: "", stock: 0, unit: "", price: 0, suppliers: [], locations: [], imageUrl: "" };

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState(
    product ? { ...product, locations: Array.isArray(product.locations) ? product.locations : [] } : empty
  );
  const [supplierInput, setSupplierInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSupplier = () => {
    const trimmed = supplierInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, suppliers: [...prev.suppliers, trimmed] }));
    setSupplierInput("");
  };
  const removeSupplier = (i) => {
    setForm((prev) => ({ ...prev, suppliers: prev.suppliers.filter((_, idx) => idx !== i) }));
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(product._id);
    onRefresh();
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, stock: Number(form.stock), price: Number(form.price) };
      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await createProduct(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 px-4 md:px-0"
        style={{ animation: "fadeIn 0.25s ease forwards" }}
      >
        <div
          className="bg-white rounded-2xl w-full md:max-w-md shadow-xl mb-4 md:mb-0 overflow-hidden"
          style={{ animation: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">{product ? "Edit Product" : "Add Product"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          {/* Body — compact layout */}
          <div className="px-4 py-3 space-y-3">

            {/* Image — top centered */}
            <ImageUpload value={form.imageUrl} onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))} compact />

            {/* Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Product name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Stock + Unit */}
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-xs text-gray-400 mb-1">Stock</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button type="button"
                    onClick={() => setForm((prev) => ({ ...prev, stock: Math.max(0, Number(prev.stock) - 1) }))}
                    className="w-8 h-9 bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg shrink-0"
                  >−</button>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                    className="flex-1 min-w-0 py-2 text-sm text-center focus:outline-none" />
                  <button type="button"
                    onClick={() => setForm((prev) => ({ ...prev, stock: Number(prev.stock) + 1 }))}
                    className="w-8 h-9 bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg shrink-0"
                  >+</button>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-gray-400 mb-1">Unit</label>
                <input name="unit" value={form.unit} onChange={handleChange} placeholder="kg"
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Locations */}
            <LocationDropdown
              selected={form.locations || []}
              onChange={(locs) => setForm((prev) => ({ ...prev, locations: locs }))}
            />

            {/* Suppliers */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Suppliers</label>
              <div className="flex gap-2">
                <input value={supplierInput} onChange={(e) => setSupplierInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSupplier()}
                  placeholder="Add supplier..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={addSupplier} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm">Add</button>
              </div>
              {form.suppliers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.suppliers.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {s}
                      <button onClick={() => removeSupplier(i)} className="leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {error && <div className="px-4 pb-1 text-xs text-red-500">{error}</div>}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div>
              {product && (
                <button onClick={handleDelete} className="px-3 py-2 text-sm rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50">
                {loading ? "Saving..." : product ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}