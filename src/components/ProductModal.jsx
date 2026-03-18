import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { createProduct, updateProduct, deleteProduct } from "../api/products";

const empty = { name: "", stock: 0, unit: "", price: 0, suppliers: [], locations: [], imageUrl: "" };

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState(product || empty);
  const [supplierInput, setSupplierInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
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

  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, locations: [...(prev.locations || []), trimmed] }));
    setLocationInput("");
  };
  const removeLocation = (i) => {
    setForm((prev) => ({ ...prev, locations: prev.locations.filter((_, idx) => idx !== i) }));
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

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(product._id);
    onRefresh();
    onClose();
  };

  const tagInput = (label, value, onChange, onAdd, tags, onRemove, color) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={onAdd} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors">
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((t, i) => (
            <span key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${color}`}>
              {t}
              <button onClick={() => onRemove(i)} className="leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

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
        className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 md:p-4"
        style={{ animation: "fadeIn 0.25s ease forwards" }}
      >
        <div
          className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
          style={{ animation: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">{product ? "Edit Product" : "Add Product"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">

            {/* 1. Image */}
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />

            {/* 2. Name */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rice 5kg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 3. Stock + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Unit</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="e.g. pcs, kg, box"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 4. Price */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 5. Locations */}
            {tagInput("Locations", locationInput, setLocationInput, addLocation, form.locations || [], removeLocation, "bg-green-50 text-green-600")}

            {/* 6. Suppliers */}
            {tagInput("Suppliers", supplierInput, setSupplierInput, addSupplier, form.suppliers, removeSupplier, "bg-blue-50 text-blue-600")}

          </div>

          {error && <div className="px-6 pb-2 text-sm text-red-500">{error}</div>}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="flex gap-2">
              {product && (
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 text-sm rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}