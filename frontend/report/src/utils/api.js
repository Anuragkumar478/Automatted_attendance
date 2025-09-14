import axios from "axios";

const api = axios.create({
  baseURL: "https://automatted-attendance-backend.onrender.com", // your backend base URL
});
 api.interceptors.request.use((req)=>{
  const token=localStorage.getItem("token");
  if(token){
    req.headers["x-auth-token"]=token;

  }
  return req;
 })


export default api;
