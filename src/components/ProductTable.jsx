import { adjustStock, deleteProduct } from "../api/products";

export default function ProductTable({ products, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    onRefresh();
  };

  const handleStock = async (id, adjustment) => {
    await adjustStock(id, adjustment);
    onRefresh();
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        No products yet. Add one to get started.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((p) => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
            {/* Image */}
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs shrink-0">
                N/A
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-800 truncate">{p.name}</p>
                <p className="text-sm font-semibold text-gray-800 shrink-0">${(p.price ?? 0).toFixed(2)}</p>
              </div>

              <p className="text-xs text-gray-400 mt-0.5">{p.unit}</p>

              {/* Suppliers */}
              {p.suppliers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.suppliers.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Stock + Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStock(p._id, -1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-800">{p.stock}</span>
                  <button
                    onClick={() => handleStock(p._id, 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Suppliers</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStock(p._id, -1)}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800">{p.stock}</span>
                    <button
                      onClick={() => handleStock(p._id, 1)}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                <td className="px-4 py-3 text-gray-800">${(p.price ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.suppliers.length > 0 ? (
                      p.suppliers.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}