import { useState } from "react";
import ImageUpload from "./ImageUpload";
import LocationDropdown from "./LocationDropdown";
import { createProduct, updateProduct, deleteProduct } from "../api/products";

const emptySupplier = { name: "", price: 0, stock: 0, unit: "" };
const empty = { name: "", suppliers: [{ ...emptySupplier, name: "A" }], locations: [], imageUrl: "" };

const normalizeSuppliers = (suppliers) => {
  if (!Array.isArray(suppliers) || suppliers.length === 0)
    return [{ ...emptySupplier, name: "A" }];
  return suppliers.map((s) => ({
    name: s.name ?? "A",
    price: s.price ?? 0,
    stock: s.stock ?? 0,
    unit: s.unit ?? "",
  }));
};

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState(
    product ? {
      ...product,
      locations: Array.isArray(product.locations) ? product.locations : [],
      suppliers: normalizeSuppliers(product.suppliers),
    } : empty
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateSupplier = (i, field, value) => {
    setForm((prev) => {
      const updated = [...prev.suppliers];
      updated[i] = { ...updated[i], [field]: value };
      return { ...prev, suppliers: updated };
    });
  };

  const addSupplier = () => {
    setForm((prev) => ({ ...prev, suppliers: [...prev.suppliers, { ...emptySupplier }] }));
  };

  const removeSupplier = (i) => {
    if (form.suppliers.length === 1) return; // keep at least one
    setForm((prev) => ({ ...prev, suppliers: prev.suppliers.filter((_, idx) => idx !== i) }));
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(product._id);
    onRefresh();
    onClose();
  };

  const hasBlankSupplier = form.suppliers.some((s) => !s.name.trim());

  const handleSubmit = async () => {
    if (hasBlankSupplier) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        suppliers: form.suppliers.map((s) => ({
          ...s,
          stock: Number(s.stock) || 0,
          price: Number(s.price) || 0,
        })),
      };
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

          {/* Body */}
          <div className="px-4 py-3 space-y-3 max-h-[75vh] overflow-y-auto">

            {/* Image */}
            <ImageUpload value={form.imageUrl} onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))} compact />

            {/* Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Product name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Locations */}
            <LocationDropdown
              selected={form.locations || []}
              onChange={(locs) => setForm((prev) => ({ ...prev, locations: locs }))}
            />

            {/* Suppliers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Suppliers</label>
                <button onClick={addSupplier} className="text-xs text-blue-500 hover:text-blue-700">+ Add Supplier</button>
              </div>

              <div className="space-y-2">
                {form.suppliers.map((s, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    {/* Supplier header */}
                    <div className="flex items-center justify-between">
                      <input
                        value={s.name}
                        onChange={(e) => updateSupplier(i, "name", e.target.value)}
                        placeholder="Supplier name"
                        className="flex-1 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {form.suppliers.length > 1 && (
                        <button onClick={() => removeSupplier(i)} className="ml-2 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                      )}
                    </div>

                    {/* Stock + Unit + Price */}
                    <div className="flex gap-2">
                      <div style={{width:"55%"}}>
                        <label className="block text-xs text-gray-400 mb-1 text-center">Stock</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button type="button"
                            onClick={() => updateSupplier(i, "stock", String(Math.max(0, Number(s.stock) - 1)))}
                            className="w-7 h-8 bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center font-bold shrink-0"
                          >−</button>
                          <input type="number" min="0" value={s.stock}
                            onChange={(e) => updateSupplier(i, "stock", e.target.value)}
                            className="flex-1 min-w-0 py-1.5 text-sm text-center focus:outline-none" />
                          <button type="button"
                            onClick={() => updateSupplier(i, "stock", String(Number(s.stock) + 1))}
                            className="w-7 h-8 bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center font-bold shrink-0"
                          >+</button>
                        </div>
                      </div>
                      <div style={{width:"22.5%"}}>
                        <label className="block text-xs text-gray-400 mb-1 text-center">Unit</label>
                        <input value={s.unit} onChange={(e) => updateSupplier(i, "unit", e.target.value)}
                          placeholder="kg"
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div style={{width:"22.5%"}}>
                        <label className="block text-xs text-gray-400 mb-1 text-center">Price ($)</label>
                        <input type="number" min="0" step="0.01" value={s.price}
                          onChange={(e) => updateSupplier(i, "price", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <button onClick={handleSubmit} disabled={loading || hasBlankSupplier}
                className={`px-3 py-2 text-sm rounded-lg text-white transition-colors disabled:opacity-50 ${hasBlankSupplier ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {loading ? "Saving..." : product ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}