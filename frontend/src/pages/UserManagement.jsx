import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserManagement.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");

      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  // =========================
  // CREATE USER
  // =========================
  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setSuccess("User created successfully");
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

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setSuccess("User deleted");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  

  // =========================
  // JSX
  // =========================
  return (
    <div className="user-container">
      <button className="back-btn" onClick={() => navigate("/admin")}>
        ← Back to Admin
      </button>

      <h1>User Management</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* CREATE USER FORM */}
      <div className="user-form">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>

      {/* USERS TABLE */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
