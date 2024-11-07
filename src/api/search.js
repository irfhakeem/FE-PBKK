import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/search",
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

export const Search = async (data) => {
  try {
    const response = await apiClient.get("/", {
      params: {
        query: data.query,
        type: data.type,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch search data");
  }
};
