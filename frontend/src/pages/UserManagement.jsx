import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔗 Deployed backend URL
const API_URL = "https://pares-pos.onrender.com";

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const handleCreate = async () => {
    if (!username || !password) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create user: ${res.status}`);
      }

      setSuccess("User created successfully!");
      setUsername("");
      setPassword("");
      setRole("cashier");
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status}`);
      }

      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div style={styles.container}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        style={styles.backBtn}
      >
        ← Back to Admin
      </button>

      <h1>User Management</h1>

      {/* Error/Success Messages */}
      {error && (
        <div style={styles.errorBox} onClick={clearMessages}>
          {error}
        </div>
      )}
      {success && (
        <div style={styles.successBox} onClick={clearMessages}>
          {success}
        </div>
      )}

      {/* ADD USER */}
      <div style={styles.formBox}>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <select
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <button
          style={styles.addBtn}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>

      {/* LOADING */}
      {loading && <div style={styles.loading}>Loading...</div>}

      {/* USERS TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.emptyMessage}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>{u.role}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(u._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    backgroundColor: "#343a40",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  formBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    flex: "1",
    minWidth: "150px",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    borderBottom: "2px solid #333",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f8f9fa",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "5px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  successBox: {
    padding: "12px",
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    borderRadius: "5px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
    fontSize: "18px",
  },
  emptyMessage: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
    fontStyle: "italic",
  },
};

export default UserManagement;
