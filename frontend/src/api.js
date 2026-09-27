import {
  clearAuth,
  getAccessToken,
  setAuth,
  getUser,
} from "./auth.js";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let refreshPromise = null;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    })
      .then(parseResponse)
      .then((data) => {
        const user = getUser();

        if (!user) {
          throw new Error("User session is missing.");
        }

        setAuth(data.accessToken, user);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch(path, options = {}, retry = true) {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry && token) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retryHeaders = new Headers(options.headers || {});
      if (options.body && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }
      retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

      const retryResponse = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });

      return parseResponse(retryResponse);
    } catch (refreshError) {
      clearAuth();
      window.dispatchEvent(new Event("auth:session-expired"));
      throw refreshError;
    }
  }

  return parseResponse(response);
}

export async function registerUser(payload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export async function loginUser(payload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export async function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
  }, false);
}

export async function getMe() {
  return apiFetch("/auth/me", {}, true);
}

export async function getProducts() {
  return apiFetch("/products", {}, false);
}

export async function createProduct(payload) {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
}
