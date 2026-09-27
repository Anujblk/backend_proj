import { useState } from "react";
import { loginUser } from "../api.js";
import { setAuth } from "../auth.js";

function Login({ onLoggedIn, onRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setLoading(true);

    try {
      const data = await loginUser(form);

      setAuth(data.accessToken, data.user);
      onLoggedIn(data.user);
    } catch (error) {
      setError(error.message);
      setFieldErrors(error.data?.errors || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="muted">Sign in to manage products.</p>

        {error && <div className="error-box">{error}</div>}

        {fieldErrors.map((item) => (
          <div className="field-error" key={`${item.field}-${item.message}`}>
            {item.field}: {item.message}
          </div>
        ))}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-text">
          Don't have an account?{" "}
          <button type="button" className="link-button" onClick={onRegister}>
            Register
          </button>
        </p>
      </form>
    </main>
  );
}

export default Login;
