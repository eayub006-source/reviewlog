import axios from "axios";

import { API_BASE_URL } from "@/constants/api";

const authHttp = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function refreshAccessToken(refresh) {
  const response = await authHttp.post("token/refresh/", { refresh });
  return response.data;
}
