import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/upload",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file); // Match the key expected by multer in backend

  try {
    const response = await apiClient.post("/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to upload avatar");
  }
};

export const uploadBanner = async (data) => {
  try {
    const response = await apiClient.post("/banner", data);
    return response.data.file;
  } catch (error) {
    throw new Error("Failed to upload banner");
  }
};
export const uploadThumbnail = async (data) => {
  try {
    const response = await apiClient.post("/thumbnail", data);
    return response.data.file;
  } catch (error) {
    throw new Error("Failed to upload thumbnail");
  }
};
