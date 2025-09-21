import axios from "axios";

const api = axios.create({
  baseURL: "https://automatted-attendance-backend.onrender.com/api", // backend URL
  withCredentials: true, // ✅ enable sending cookies
});

// Attach token for Authorization header if available
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log(token)
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  console.log(req.headers["Authorization"]);
  return req;
});

export default api;
