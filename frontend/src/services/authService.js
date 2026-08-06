import api from "@/api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("token/", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("register/", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("profile/");
  return response.data;
};
