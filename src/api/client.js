import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": localStorage.getItem("lang") || "en",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    await signOut(auth);
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join('\n')
      : data?.message || "Request failed";
    throw new Error(msg);
  }

  return data;
}
