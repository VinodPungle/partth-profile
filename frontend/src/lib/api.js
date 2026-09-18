import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const usePortfolio = () =>
  useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => (await api.get("/portfolio")).data,
  });

export const sendContact = (payload) => api.post("/contact", payload);

export const trackEvent = (type, label = "") => {
  api.post("/events", { type, label }).catch(() => {});
};
