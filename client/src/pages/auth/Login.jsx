import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.data.token);
      
      const loggedInUser = res.data.data.user;
      setUser(loggedInUser);

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedInUser.role === "seller") {
        navigate("/seller/dashboard");
      } else if (loggedInUser.role === "buyer") {
        navigate("/buyer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              style={styles.input}
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#4b5563' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>🧪 Test Credentials:</p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', listStyleType: 'disc' }}>
            <li><strong>Admin:</strong> admin@test.com / admin123</li>
            <li><strong>Seller:</strong> seller@test.com / admin</li>
            <li><strong>Buyer:</strong> buyer@test.com / admin</li>
          </ul>
        </div>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "75vh",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    border: "1px solid #eaeaea",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    margin: "0 0 1.5rem 0",
    textAlign: "center",
    color: "#111",
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.9rem",
    color: "#555",
    fontWeight: "500",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "0.8rem",
    background: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "background 0.2s",
  },
  buttonDisabled: {
    background: "#82baf5",
    cursor: "not-allowed",
  },
  error: {
    backgroundColor: "#fff0f0",
    color: "#d32f2f",
    padding: "0.8rem",
    borderRadius: "6px",
    marginBottom: "1.2rem",
    fontSize: "0.9rem",
    textAlign: "center",
    border: "1px solid #ffcdd2",
  },
  footerText: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#666",
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
    fontWeight: "500",
  }
};