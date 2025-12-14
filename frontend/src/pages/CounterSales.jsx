import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔗 Use your deployed backend URL
const API_URL = "https://pares-pos.onrender.com";

const CounterSales = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!date) return alert("Please select a date.");

    const res = await fetch(`${API_URL}/api/orders?date=${date}`);
    const data = await res.json();
    setOrders(data);
  };

  // Compute daily total item count
  const dailyItemCount = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, i) => s + Number(i.qty), 0),
    0
  );

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/counter")}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back to POS
      </button>

      <h1>Sales Report</h1>

      {/* Date Picker + Search */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          onClick={fetchOrders}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Total Items Sold */}
      {orders.length > 0 && (
        <h2 style={{ marginTop: "20px" }}>
          Total Items Sold: {dailyItemCount}
        </h2>
      )}

      {/* Orders List */}
      <div style={{ marginTop: "25px" }}>
        {orders.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          orders.map((order) => {
            const itemCount = order.items.reduce(
              (sum, i) => sum + Number(i.qty),
              0
            );

            return (
              <div
                key={order._id}
                style={{
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                {/* TOTAL + DATE/TIME */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h2 style={{ margin: 0 }}>₱{order.total}</h2>

                  <p style={{ margin: 0, opacity: 0.7 }}>
                    {order.date} — {order.time}
                  </p>
                </div>

                <p style={{ fontWeight: "bold", opacity: 0.7 }}>
                  Items Sold: {itemCount}
                </p>

                <h3 style={{ marginTop: "10px" }}>Items:</h3>

                <div
                  style={{
                    padding: "10px",
                    background: "#fafafa",
                    borderRadius: "8px",
                  }}
                >
                  {order.items.map((i, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span>{i.name}</span>
                      <span>
                        {i.qty}× (₱{i.price})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CounterSales;
