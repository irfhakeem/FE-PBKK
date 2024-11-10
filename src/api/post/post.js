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

export const likePost = async (data) => {
  try {
    const response = await apiClient.post("/like", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to like post");
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await apiClient.delete("/unlike", {
      data: { postId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to unlike post");
  }
};

export const isLiked = async (data) => {
  try {
    const response = await apiClient.post("/is-liked", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to check if post is liked");
  }
};

export const postComment = async (data) => {
  try {
    const response = await apiClient.post("/comment", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to post comment");
  }
};

export const deleteComment = async (commentId) => {
  try {
    await apiClient.delete("/uncomment", {
      data: { commentId },
    });
  } catch (error) {
    throw new Error("Failed remove comment");
  }
};

export const getComments = async (data) => {
  try {
    const response = await apiClient.post("/comments", data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed get comments");
  }
};

export const getUserPosts = async () => {
  try {
    const response = await apiClient.get("/user-posts");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch user posts");
  }
};

export const deletePost = async (postId) => {
  try {
    await apiClient.delete(`/delete/${postId}`);
  } catch (error) {
    throw new Error("Failed to delete post");
  }
};
