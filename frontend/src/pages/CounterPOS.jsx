import React, { useEffect, useState } from "react";
import "../css/CounterPOS.css";
import { FaTrash } from "react-icons/fa";

function CounterPOS() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("PARES");
  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);

  // --- SALES PANEL STATES ---
  const [showSales, setShowSales] = useState(false);
  const [salesDate, setSalesDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [salesList, setSalesList] = useState([]);
  const [salesTotal, setSalesTotal] = useState(0);

  const categories = ["PARES", "GOTO", "SOLO", "ADD-ONS", "DRINKS"];
  const cashier = localStorage.getItem("username") || "Cashier";

  // Fetch Products
  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
    filterProducts("PARES", data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter by Category
  const filterProducts = (cat, list = products) => {
    setCategory(cat);
    setFilteredProducts(list.filter((item) => item.category === cat));
  };

  // Add to cart
  const addToCart = (p) => {
    const exists = cart.find((i) => i._id === p._id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i._id === p._id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  // Quantity Controls
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: Math.max(item.qty - 1, 1) } : item
        )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Calculate totals
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Checkout
  const handleCheckout = async () => {
    if (!cash) return alert("Please enter cash.");
    if (cash < totalAmount) return alert("Not enough cash.");

    const orderData = {
      items: cart,
      total: totalAmount,
      cash,
      change,
      cashier,
    };

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert("Order completed!");
      setCart([]);
      setCash("");
      setChange(0);
    }
  };

  // --- LOAD SALES DATA ---
  const loadSales = async () => {
    const res = await fetch(
      `http://localhost:5000/api/orders?date=${salesDate}`
    );
    const data = await res.json();

    setSalesList(data);

    const total = data.reduce((sum, order) => sum + order.total, 0);
    setSalesTotal(total);

    setShowSales(true);
  };

  return (
    <div className="counter-container">
      <div className="top-bar">
        <h1>Counter POS</h1>

        {/* Sales Button */}
        <button className="sales-btn" onClick={loadSales}>
          View Sales
        </button>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${category === cat ? "active" : ""}`}
            onClick={() => filterProducts(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU BOX */}
      <div className="menu-box">
        <h3>{category} Menu</h3>

        <div className="menu-grid">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="menu-item"
              onClick={() => addToCart(p)}
            >
              <p className="menu-name">{p.name}</p>
              <p className="menu-price">₱{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="cart-box">
        <h3>Order Summary</h3>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">No items added</p>
          ) : (
            cart.map((item) => (
              <div className="cart-row" key={item._id}>
                <span>{item.name}</span>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item._id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item._id)}>+</button>
                </div>

                <span>₱{item.price * item.qty}</span>

                <button className="remove-btn" onClick={() => removeItem(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-total">Total: ₱{totalAmount}</div>

        <input
          className="cash-input"
          type="number"
          placeholder="Enter cash"
          value={cash}
          onChange={(e) => {
            setCash(e.target.value);
            setChange(e.target.value - totalAmount);
          }}
        />

        <div className="change-box">
          Change: ₱{change > 0 ? change : 0}
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>
          Complete Order
        </button>
      </div>

      {/* ---- SALES PANEL ---- */}
      {showSales && (
        <div className="sales-modal">
          <div className="sales-content">
            <h2>Daily Sales</h2>

            <input
              type="date"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              className="sales-date"
            />

            <button className="sales-refresh" onClick={loadSales}>
              Load Sales
            </button>

            <div className="sales-list">
              {salesList.length === 0 ? (
                <p>No transactions found</p>
              ) : (
                salesList.map((order) => (
                  <div className="sales-row" key={order._id}>
                    <span>{order.cashier}</span>
                    <span>₱{order.total}</span>
                  </div>
                ))
              )}
            </div>

            <h3 className="sales-total">
              Total Sales: ₱{salesTotal}
            </h3>

            <button className="close-sales" onClick={() => setShowSales(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CounterPOS;
