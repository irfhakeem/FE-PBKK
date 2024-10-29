import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/post",
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

export const createPost = async (data) => {
  try {
    const response = await apiClient.post("/create", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to create post");
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await apiClient.get(`/${postId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch post data");
  }
};

export const getPosts = async (data) => {
  try {
    const response = await apiClient.post("/", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch posts data");
  }
};
