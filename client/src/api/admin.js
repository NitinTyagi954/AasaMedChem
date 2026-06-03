import API from "./client";

export const getPendingProducts = () => API.get("/api/admin/products/pending");
export const updateProductStatus = (id, payload) => API.put(`/api/admin/products/${id}/status`, payload);
export const getAllUsers = () => API.get("/api/admin/users");
export const getAllOrders = () => API.get("/api/admin/orders");