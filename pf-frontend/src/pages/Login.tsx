import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import type { LoginResponse } from "../types";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "3rem" }}>
      <article>

        <h2>Login</h2>

        {error && (
          <p data-cy="login-error" style={{ color: "var(--pico-del-color)" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Email
            <input
              data-cy="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>


          <label>
            Password
            <input
              data-cy="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>


          <button
            data-cy="login-button"
            type="submit"
            aria-busy={loading}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        <p>
          No account? <Link to="/register">Register</Link>
        </p>

      </article>
    </div>
  );
}

export default Login;