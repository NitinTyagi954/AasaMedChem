import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = apiUrl.startsWith("http") ? apiUrl : `https://${apiUrl}`;

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
