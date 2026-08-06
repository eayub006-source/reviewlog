import api from "@/api/axios";
import { getProfile } from "@/services/profileService";

export const loginUser = async (credentials) => {
  const response = await api.post("token/", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("register/", userData);
  return response.data;
};

export { getProfile };
