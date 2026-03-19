import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Inventory</h1>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />


        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
        ) : (
          <ProductTable
            products={filtered}
            onEdit={handleEdit}
            onRefresh={fetchProducts}
          />
        )}
      </div>

      {/* FAB on mobile */}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white text-2xl rounded-full shadow-lg flex items-center justify-center md:hidden transition-colors"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={handleClose}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}
