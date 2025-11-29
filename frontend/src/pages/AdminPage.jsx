import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD (PH Time)
  const todayPH = new Date().toLocaleString("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [date, setDate] = useState(todayPH);
  const [orders, setOrders] = useState([]);
  const [salesTotal, setSalesTotal] = useState(0);

  // Fetch orders with optional date filter
  const fetchOrders = async () => {
    try {
      let url = "http://localhost:5000/api/orders";

      if (date) url += `?date=${date}`;

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Compute daily sales
      const total = data.reduce((sum, order) => sum + order.total, 0);
      setSalesTotal(total);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [date]);

  // Format to Philippine Time
  const formatPHTime = (isoString) => {
    return new Date(isoString).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <h1>Admin Dashboard</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.manageBtn} onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>

          <button style={styles.manageBtn} onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
        </div>
      </div>

      {/* DATE FILTER */}
      <div style={styles.filterBox}>
        <label style={styles.label}>Select Date:</label>

        <input
          type="date"
          style={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: "20px" }}>Transactions</h2>

      <h3 style={styles.salesTotal}>Total Sales: ₱{salesTotal.toLocaleString()}</h3>

      {/* LIST OF ORDERS */}
      <div style={styles.cardList}>
        {orders.length === 0 ? (
          <p style={styles.noData}>No transactions found for this date</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={styles.card}>
              {/* DATE & TOTAL */}
              <div style={styles.rowSpaceBetween}>
                <div>
                  <h4 style={styles.cardTitle}>📅 Date & Time:</h4>
                  <p style={styles.value}>{formatPHTime(order.date)}</p>
                </div>

                <h2 style={styles.totalAmount}>₱{order.total}</h2>
              </div>

              {/* ITEMS */}
              <h4 style={styles.cardTitle}>🧾 Items:</h4>

              <div style={styles.itemsBox}>
                {order.items.map((i, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <span>{i.name}</span>
                    <span>
                      {i.qty}× (₱{i.price})
                    </span>
                  </div>
                ))}
              </div>

              {/* CASHIER */}
              <h4 style={styles.cardTitle}>👤 Cashier:</h4>
              <p style={styles.value}>{order.cashier}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ======================
//     STYLES
// ======================

const styles = {
  container: { padding: "30px", fontFamily: "Arial, sans-serif" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  manageBtn: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  filterBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: 10,
  },

  label: { fontSize: "16px" },

  input: { padding: "8px", fontSize: "16px" },

  salesTotal: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "green",
    marginBottom: "15px",
  },

  cardList: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    background: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  rowSpaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: { margin: "10px 0 5px", fontWeight: "bold" },

  value: { marginTop: "-5px" },

  itemsBox: {
    background: "#fafafa",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: 10,
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    borderBottom: "1px solid #eee",
  },

  totalAmount: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "green",
  },

  noData: {
    padding: "20px",
    textAlign: "center",
    color: "gray",
    fontSize: "18px",
  },
};

export default AdminPage;
