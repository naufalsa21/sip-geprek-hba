import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSummary = ({ startDate, endDate }) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
    params: { startDate, endDate },
  });
};

export const getChartData = (startDate) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/chart`, {
    params: { start: startDate },
  });
};
