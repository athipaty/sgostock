import { useState, useRef, useEffect } from "react";

const LOCATIONS = ["Freezer", "Chiller", "Rack 1", "Rack 2", "Kitchen"];

export default function LocationDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (loc) => {
    if (selected.includes(loc)) {
      onChange(selected.filter((l) => l !== loc));
    } else {
      onChange([...selected, loc]);
    }
  };

  return (
    <div ref={ref}>
      <label className="block text-xs text-gray-500 mb-1">Locations</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={`flex-1 text-center ${selected.length === 0 ? "text-gray-400" : "text-gray-700"}`}>
          {selected.length === 0 ? "Select locations..." : selected.join(", ")}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-1 border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
          {LOCATIONS.map((loc) => {
            const checked = selected.includes(loc);
            return (
              <button
                key={loc}
                type="button"
                onClick={() => toggle(loc)}
                className={`w-full px-4 py-3 text-sm text-center flex items-center justify-between transition-colors
                  ${checked ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <span>{loc}</span>
                {checked && <span className="text-green-500 text-base">✓</span>}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}