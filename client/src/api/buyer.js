import API from "./client";

export const getCatalog = () => API.get("/api/buyer/catalog");
export const getMyOrders = () => API.get("/api/buyer/orders");
export const placeOrder = (payload) => API.post("/api/buyer/orders", payload);
