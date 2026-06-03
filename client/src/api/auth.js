import API from "./client";

export const registerUser = (data) =>
  API.post("/api/auth/register", data);

export const loginUser = (data) =>
  API.post("/api/auth/login", data);

export const fetchCurrentUser = () =>
  API.get("/api/auth/me");
