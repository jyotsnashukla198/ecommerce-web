import { createSlice } from "@reduxjs/toolkit";

const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState: {
    preview: null,       // base64 preview URL
    uploadedUrl: null,   // server file path after upload
    status: "idle",      // idle | uploading | success | error
    error: null,
  },
  reducers: {
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    setUploadedUrl: (state, action) => {
      state.uploadedUrl = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetUpload: (state) => {
      state.preview = null;
      state.uploadedUrl = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setPreview, setUploadedUrl, setStatus, setError, resetUpload } =
  imageUploadSlice.actions;
export default imageUploadSlice.reducer;
