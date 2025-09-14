import axios from "axios";

const api = axios.create({
  baseURL: "https://automatted-attendance-backend.onrender.com",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["x-auth-token"] = token;
  }
  return req;
});

export default api;
