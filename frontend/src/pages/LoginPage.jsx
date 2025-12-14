import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";

// 🔗 Deployed backend URL
const API_URL = "https://pares-pos.onrender.com";

// ⏱ fetch with timeout (mobile-safe)
const fetchWithTimeout = (url, options, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);
};

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return; // prevent double tap
    setError("");
    setLoading(true);

    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
        15000
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ IMPORTANT: give mobile time to persist storage
      setTimeout(() => {
        if (data.user.role === "admin") navigate("/admin");
        else navigate("/counter");
      }, 300);
    } catch (err) {
      console.error("Login error:", err);

      if (err.message === "timeout") {
        setError(
          "Server is starting up. Please wait 10–20 seconds and try again."
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">🔥 Pares POS</div>
        <p className="login-subtitle">Login to continue</p>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
