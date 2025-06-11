import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSummary = (tanggalMulai, tanggalAkhir) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
    params: { start: tanggalMulai, end: tanggalAkhir },
  });
};

export const getChartData = (start) => {
  return axios.get(`${API_BASE_URL}/api/dashboard/chart`, {
    params: { start },
  });
};
