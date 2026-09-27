import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import { clearAuth, getAccessToken, getUser } from "./auth.js";
import { getMe, logoutUser } from "./api.js";

function App() {
  const [page, setPage] = useState(
    getAccessToken() ? "products" : "login"
  );
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(Boolean(getAccessToken()));

  useEffect(() => {
    async function restoreSession() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        clearAuth();
        setUser(null);
        setPage("login");
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setPage("login");
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // The local session is cleared even if the server request fails.
    }

    clearAuth();
    setUser(null);
    setPage("login");
  }

  if (loading) {
    return <div className="center-screen">Restoring session...</div>;
  }

  if (page === "register") {
    return (
      <Register
        onRegistered={() => setPage("login")}
        onLogin={() => setPage("login")}
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        onLoggedIn={(loggedInUser) => {
          setUser(loggedInUser);
          setPage("products");
        }}
        onRegister={() => setPage("register")}
      />
    );
  }

  return (
    <Products
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;
