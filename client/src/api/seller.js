import API from "./client";

export const getIncomingOrders = () => API.get("/api/seller/orders");
export const updateOrderStatus = (id, status) => API.put(`/api/seller/orders/${id}/status`, { status });
