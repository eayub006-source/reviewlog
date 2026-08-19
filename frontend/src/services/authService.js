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

export const requestPasswordReset = async (email) => {
  const response = await api.post("password-reset/request/", { email });
  return response.data;
};

export const confirmPasswordReset = async ({ uid, token, password, confirmPassword }) => {
  const response = await api.post("password-reset/confirm/", {
    uid,
    token,
    new_password: password,
    confirm_password: confirmPassword,
  });
  return response.data;
};

export { getProfile };
