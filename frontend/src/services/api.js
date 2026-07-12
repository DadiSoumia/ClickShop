import axios from "axios";

export const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace("/api", "")}${path}`;
};


export const fetchProducts = () => api.get("/products");
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const fetchCategories = () => api.get("/categories");
export const submitOrder = (orderData) => api.post("/orders", orderData);

let currentAccessToken = null;
let onTokenRefreshed = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

export const registerTokenRefreshHandler = (handler) => {
  onTokenRefreshed = handler;
};

api.interceptors.request.use((config) => {
  if (currentAccessToken && config.url?.includes("/admin")) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest.url?.includes("/admin/auth/");

    if (error.response?.status !== 401 || isAuthRoute || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject, originalRequest });
      });
    }

    isRefreshing = true;
    try {
      const res = await api.post("/admin/auth/refresh");
      const newToken = res.data.data.accessToken;
      setAccessToken(newToken);
      onTokenRefreshed?.(newToken);

      refreshQueue.forEach(({ resolve, originalRequest: req }) => {
        req.headers.Authorization = `Bearer ${newToken}`;
        resolve(api(req));
      });
      refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshQueue.forEach(({ reject }) => reject(refreshError));
      refreshQueue = [];
      onTokenRefreshed?.(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const loginAdmin = (credentials) => api.post("/admin/auth/login", credentials);
export const refreshAdminToken = () => api.post("/admin/auth/refresh");
export const logoutAdmin = () => api.post("/admin/auth/logout");
export const fetchMe = () => api.get("/admin/auth/me");

export const fetchAdminProducts = () => api.get("/admin/products");
export const createAdminProduct = (data) => api.post("/admin/products", data);
export const updateAdminProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteAdminProduct = (id) => api.delete(`/admin/products/${id}`);

export const uploadProductImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/admin/products/upload", formData);
};

export const fetchAdminCategories = () => api.get("/admin/categories");
export const createAdminCategory = (data) => api.post("/admin/categories", data);
export const updateAdminCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteAdminCategory = (id) => api.delete(`/admin/categories/${id}`);

export const uploadCategoryImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/admin/categories/upload", formData);
};

export const fetchAdminOrders = () => api.get("/admin/orders");
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status });
export const updateOrderDelivery = (id, data) => api.patch(`/admin/orders/${id}/delivery`, data);
export const deleteAdminOrder = (id) => api.delete(`/admin/orders/${id}`);

export default api;