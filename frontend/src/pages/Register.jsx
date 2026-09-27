import { useState } from "react";
import { registerUser } from "../api.js";

function Register({ onRegistered, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      await registerUser(form);
      onRegistered();
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
        <h1>Create account</h1>
        <p className="muted">Register a new user.</p>

        {error && <div className="error-box">{error}</div>}

        {fieldErrors.map((item) => (
          <div className="field-error" key={`${item.field}-${item.message}`}>
            {item.field}: {item.message}
          </div>
        ))}

        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

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

        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={onLogin}>
            Login
          </button>
        </p>
      </form>
    </main>
  );
}

export default Register;
