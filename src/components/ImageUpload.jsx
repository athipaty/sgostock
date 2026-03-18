import { useState, useRef } from "react";

const CLOUD_NAME = "dil2ttxah";
const UPLOAD_PRESET = "tingtong";

export default function ImageUpload({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    onChange(data.secure_url);
    setUploading(false);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    uploadToCloudinary(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-xs text-gray-500 mb-2">Image</label>

      {value ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200">
          <img src={value} alt="Product" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-40 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
        >
          {uploading ? (
            <p className="text-sm text-gray-400">Uploading...</p>
          ) : (
            <>
              <div className="text-3xl text-gray-300 mb-2">📷</div>
              <p className="text-sm text-blue-500 font-medium">Tap to upload</p>
              <p className="text-xs text-gray-300 mt-1 hidden md:block">or drag and drop</p>
            </>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}