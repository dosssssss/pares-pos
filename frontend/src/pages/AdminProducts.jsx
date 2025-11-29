// frontend/src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "PARES",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const categories = ["PARES", "GOTO", "SOLO", "ADD-ONS", "DRINKS"];

  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      // optional: sort by category then name
      data.sort((a, b) => {
        if (a.category === b.category) {
          return a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category);
      });
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for "Add new"
  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      category: "PARES",
      isActive: true,
    });
    setShowModal(true);
  };

  // Open modal for "Edit"
  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const payload = {
      ...form,
      price: Number(form.price),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Response error:", await res.text());
        return alert("Error saving product");
      }

      alert(editingId ? "Product updated!" : "Product added!");
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving product");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete error:", await res.text());
        return alert("Error deleting product");
      }

      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product");
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  const categoryBadgeColor = (cat) => {
    switch (cat) {
      case "PARES":
        return "#2563eb";
      case "GOTO":
        return "#16a34a";
      case "SOLO":
        return "#f97316";
      case "ADD-ONS":
        return "#7c3aed";
      case "DRINKS":
        return "#0ea5e9";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>Product Management</h1>
          <p style={styles.subtitle}>
            Add, edit, or deactivate menu items used by the Counter POS.
          </p>
        </div>

        <div style={styles.topRight}>
          <button style={styles.secondaryBtn} onClick={() => navigate("/admin")}>
            ⬅ Back to Dashboard
          </button>
          <button style={styles.primaryBtn} onClick={openAddModal}>
            ＋ Add Product
          </button>
        </div>
      </div>

      {/* Search + legend */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.legend}>
          <span style={{ ...styles.statusDot, background: "#16a34a" }} /> Active
          <span style={{ ...styles.statusDot, background: "#6b7280", marginLeft: 12 }} />{" "}
          Inactive
        </span>
      </div>

      {/* Card wrapper */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.centerText}>Loading products…</div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.centerText}>No products found.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, index) => (
                  <tr
                    key={p._id}
                    style={
                      index % 2 === 0 ? styles.trStriped : undefined
                    }
                  >
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.categoryBadge,
                          backgroundColor: categoryBadgeColor(p.category),
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td style={styles.td}>₱{p.price}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusChip,
                          backgroundColor: p.isActive
                            ? "rgba(22, 163, 74, 0.1)"
                            : "rgba(107, 114, 128, 0.12)",
                          color: p.isActive ? "#166534" : "#4b5563",
                        }}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.tdActions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleEdit(p)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(p._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Add/Edit Product */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button style={styles.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <label style={styles.label}>
                Product Name
                <input
                  style={styles.modalInput}
                  placeholder="e.g. PARES OVERLOAD"
                  value={form.name}
                  required
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label style={styles.label}>
                Price (₱)
                <input
                  type="number"
                  min="0"
                  style={styles.modalInput}
                  placeholder="e.g. 150"
                  value={form.price}
                  required
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </label>

              <label style={styles.label}>
                Category
                <select
                  style={styles.modalInput}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.switchLabel}>
                <span>Available in POS</span>
                <div
                  style={{
                    ...styles.toggle,
                    backgroundColor: form.isActive ? "#22c55e" : "#d1d5db",
                    justifyContent: form.isActive
                      ? "flex-end"
                      : "flex-start",
                  }}
                  onClick={() =>
                    setForm({ ...form, isActive: !form.isActive })
                  }
                >
                  <div style={styles.toggleKnob} />
                </div>
              </label>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  topRight: {
    display: "flex",
    gap: "8px",
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.25)",
  },
  secondaryBtn: {
    padding: "10px 14px",
    background: "white",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  searchInput: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  legend: {
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    display: "inline-block",
    marginRight: 4,
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 18px 30px rgba(15, 23, 42, 0.08)",
    padding: "16px",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  thActions: {
    textAlign: "right",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  trStriped: {
    backgroundColor: "#f9fafb",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  tdActions: {
    padding: "10px 12px",
    borderBottom: "1px solid #f3f4f6",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  centerText: {
    padding: "18px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    color: "white",
    fontSize: "12px",
    fontWeight: 600,
  },
  statusChip: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },
  editBtn: {
    padding: "6px 10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "13px",
    marginRight: "6px",
  },
  deleteBtn: {
    padding: "6px 10px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "13px",
  },

  /* Modal styles */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 40,
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 24px 45px rgba(15, 23, 42, 0.35)",
    padding: "18px 18px 16px 18px",
    animation: "fadeIn 0.15s ease-out",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
  },
  modalClose: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#6b7280",
  },
  modalForm: {
    marginTop: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "13px",
    color: "#374151",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  modalInput: {
    padding: "9px 11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  switchLabel: {
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#374151",
  },
  toggle: {
    width: "46px",
    height: "24px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    padding: "3px",
    cursor: "pointer",
    transition: "all 0.15s ease-out",
  },
  toggleKnob: {
    width: "18px",
    height: "18px",
    borderRadius: "999px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.25)",
  },
  modalFooter: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  cancelBtn: {
    padding: "8px 14px",
    background: "white",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
  },
  saveBtn: {
    padding: "8px 16px",
    background: "#16a34a",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "white",
    fontWeight: 600,
  },
};

export default AdminProducts;
