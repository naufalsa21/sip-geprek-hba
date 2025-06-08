import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSummary = (tanggal) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
    params: { tanggal },
  });
};

export const getChartData = (startDate) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/chart`, {
    params: { start: startDate },
  });
};
