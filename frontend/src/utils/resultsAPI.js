// utility function which gets the data of the dashboard
// uses authFetch API 
import { authFetch } from "./authFetchAPI";

export const fetchProjectResults = async () => {
  return await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/results/info`, {
    method: "GET"
  });
};
