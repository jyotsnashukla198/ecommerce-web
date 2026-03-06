import { configureStore } from "@reduxjs/toolkit";
import imageUploadReducer from "./slices/imageUploadSlice";

export const store = configureStore({
  reducer: {
    imageUpload: imageUploadReducer,
  },
});
