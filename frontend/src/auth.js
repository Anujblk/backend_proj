const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAuth(accessToken, user) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const value = sessionStorage.getItem(USER_KEY);

  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
