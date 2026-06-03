import API from "./client";

// Products (For Seller)
export const createProduct = (data) => API.post("/api/products", data);
export const getMyProducts = () => API.get("/api/products/seller");
