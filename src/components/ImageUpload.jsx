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
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Image</label>

      {value ? (
        // Preview
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
          <img src={value} alt="Product" className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        // Drop zone
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
        >
          {uploading ? (
            <p className="text-sm text-gray-400">Uploading...</p>
          ) : (
            <>
              <div className="text-3xl text-gray-300 mb-2">📷</div>
              <p className="text-sm text-gray-400">
                <span className="text-blue-500 font-medium">Tap to upload</span>
              </p>
              <p className="text-xs text-gray-300 mt-1 hidden md:block">or drag and drop</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}