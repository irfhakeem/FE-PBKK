import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/list",
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

export const getMyLists = async () => {
  try {
    const response = await apiClient.get("/");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch lists");
  }
};

export const specificList = async (listId) => {
  try {
    const response = await apiClient.get(`/${listId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch list");
  }
};

export const createList = async (data) => {
  try {
    const response = await apiClient.post("/create", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to create list");
  }
};

export const userLists = async (data) => {
  try {
    const response = await apiClient.post("/user-lists", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch user lists");
  }
};

export const addPostToList = async (data) => {
  try {
    const response = await apiClient.post("/add-post", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to add post to list");
  }
};

export const removePostFromList = async (data) => {
  try {
    const response = await apiClient.patch("/remove-post", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to remove post from list");
  }
};

export const deleteList = async (listId) => {
  try {
    const response = await apiClient.delete("/delete", {
      data: { listId },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to delete list");
  }
};

export const isPostListed = async (data) => {
  try {
    const response = await apiClient.post("/is-post-listed", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to check if post is listed");
  }
};
