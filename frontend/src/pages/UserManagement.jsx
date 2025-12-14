import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://pares-pos.onrender.com";

const UserManagement = () => {
  const navigate = useNavigate();

  // Always read the latest token
  const getToken = () => localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Safely parse backend responses
  const parseResponse = async (res) => {
    const type = res.headers.get("content-type");
    if (type && type.includes("application/json")) {
      return await res.json();
    }
    return null;
  };

  const handleAuthError = (res) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/";
      return true;
    }
    return false;
  };

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (handleAuthError(res)) return;

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================
  // CREATE USER
  // ======================
  const handleCreate = async () => {
    if (!username || !password) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(), // PLAIN TEXT ONLY
          role,
        }),
      });

      if (handleAuthError(res)) return;

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      setSuccess("User created successfully!");
      setUsername("");
      setPassword("");
      setRole("cashier");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE USER
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (handleAuthError(res)) return;

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate("/admin")}>← Back to Admin</button>

      <h1>User Management</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="cashier">Cashier</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Adding..." : "Add User"}
      </button>

      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.username} ({u.role})
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
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
