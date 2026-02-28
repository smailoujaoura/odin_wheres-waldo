import axios from "axios";

const base = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const api = axios.create({
	baseURL: `${base}/api`,
});

export default api;