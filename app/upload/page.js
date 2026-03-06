"use client";
import {useDispatch,useSelector } from "react-redux";

import {
  setPreview,
  setUploadedUrl,
  setStatus,
  setError,
  resetUpload,
} from "@/store/slices/imageUploadSlice";

export default function UploadPage() {
  const dispatch = useDispatch();
  const { preview, uploadedUrl, status, error } = useSelector(
    (state) => state.imageUpload
  );
   function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => dispatch(setPreview(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = e.target.fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    dispatch(setStatus("uploading"));
    dispatch(setError(null));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      dispatch(setUploadedUrl(data.url));
      dispatch(setStatus("success"));
    } catch (err) {
      dispatch(setStatus("error"));
      dispatch(setError(err.message));
    }
  }
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-800 mb-6">Upload Image</h1>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center">
            <input
              type="file"
              name="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-zinc-500 hover:text-zinc-800">
              Click to select an image
            </label>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-zinc-500 mb-2">Preview:</p>
              <img src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-cover" />
            </div>
          )}

          {/* Status messages */}
          {status === "uploading" && (
            <p className="text-blue-500 text-sm">Uploading...</p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-sm">Error: {error}</p>
          )}
          {status === "success" && uploadedUrl && (
            <div>
              <p className="text-green-500 text-sm mb-2">Upload successful!</p>
              <img src={uploadedUrl} alt="Uploaded" className="rounded-xl w-full max-h-64 object-cover" />
              <p className="text-xs text-zinc-400 mt-1">{uploadedUrl}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === "uploading" || !preview}
              className="flex-1 bg-black text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
            >
              {status === "uploading" ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => dispatch(resetUpload())}
              className="px-4 text-sm text-zinc-400 hover:text-red-500"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
