import { deleteProduct } from "../api/products";

function SwipeCard({ p, onEdit }) {
  // Build stock display
  const units = [...new Set(p.suppliers?.map((s) => s.unit).filter(Boolean))];
  const sameUnit = units.length === 1;
  const totalStock = p.suppliers?.reduce((sum, s) => sum + (s.stock ?? 0), 0) ?? 0;
  const stockDisplay = sameUnit
    ? `${totalStock} ${units[0]}`
    : (p.suppliers || []).map((s) => `${s.stock} ${s.unit}`).join(" + ");

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div
        className="relative bg-white border border-gray-200 rounded-xl p-3 flex gap-3"
        onClick={() => onEdit(p)}
      >
        {/* Image */}
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs shrink-0">
            N/A
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <p className="font-medium text-gray-800 truncate">{p.name}</p>

          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
              {stockDisplay}
            </span>
            {p.locations?.slice(0, 2).map((l, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-sm">
                {l}
              </span>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
}

export default function ProductTable({ products, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
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
      {/* Mobile: cards */}
      <div className="flex flex-col gap-1 md:hidden">
        {products.map((p) => (
          <SwipeCard key={p._id} p={p} onEdit={onEdit} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Locations</th>
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
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">N/A</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.locations?.map((l, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">{l}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.suppliers?.length > 0 ? (
                      p.suppliers.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                          {s.name} · {s.stock} {s.unit} · ${(s.price ?? 0).toFixed(2)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(p)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1 text-xs rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">Delete</button>
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