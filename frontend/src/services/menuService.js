import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllMenu = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/menu`);
  return response.data;
};

export const deleteMenu = async (id) => {
  return await axios.delete(`${API_BASE_URL}/api/menu/${id}`);
};

export const updateMenuStatus = async (id, status) => {
  return await axios.patch(`${API_BASE_URL}/api/menu/${id}/status`, {
    status,
  });
};
