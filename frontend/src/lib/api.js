import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Local dev runs the FastAPI backend and talks to the live API.
// The static build (GitHub Pages) leaves REACT_APP_BACKEND_URL unset and reads the
// portfolio.json that `python backend/export_static.py` generates from seed_data.py.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STATIC_PORTFOLIO_URL = `${process.env.PUBLIC_URL || ""}/portfolio.json`;

// Third-party form endpoint (Formspree / Web3Forms) used when there is no backend.
const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT;

export const hasBackend = Boolean(BACKEND_URL);

export const api = axios.create({ baseURL: hasBackend ? `${BACKEND_URL}/api` : undefined });

const fetchPortfolio = async () =>
  hasBackend
    ? (await api.get("/portfolio")).data
    : (await axios.get(STATIC_PORTFOLIO_URL)).data;

export const usePortfolio = () =>
  useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  });

export const sendContact = (payload) => {
  if (CONTACT_ENDPOINT) {
    return axios.post(CONTACT_ENDPOINT, payload, {
      headers: { Accept: "application/json" },
    });
  }
  if (hasBackend) {
    return api.post("/contact", payload);
  }
  return Promise.reject(new Error("No contact endpoint configured"));
};

// Analytics live in the backend; on the static build there is nothing to post to.
export const trackEvent = (type, label = "") => {
  if (!hasBackend) return;
  api.post("/events", { type, label }).catch(() => {});
};
