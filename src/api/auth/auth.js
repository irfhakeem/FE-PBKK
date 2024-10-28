import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          sessionStorage.removeItem("token");
          // You might want to redirect to login page here
          break;
        case 403:
          // Handle forbidden
          break;
        case 500:
          // Handle server error
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.data.message || "Registration failed";
    throw new Error(errorMessage);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    if (response.data.data.token) {
      sessionStorage.setItem("token", response.data.data.token);
    }
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.data.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};
