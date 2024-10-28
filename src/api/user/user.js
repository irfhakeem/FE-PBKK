import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/user",
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

export const me = async () => {
  try {
    const response = await apiClient.get("/me");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
};

export const userByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/${username}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
};
