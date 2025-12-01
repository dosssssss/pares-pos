import React, { useEffect, useState } from "react";
import "../css/CounterPOS.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CounterPOS() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("PARES");

  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);

  const navigate = useNavigate();

  // UPDATED CATEGORIES
  const categories = ["PARES", "GOTO", "SOLO", "EXTRA", "DRINKS"];

  const cashier = localStorage.getItem("username");

  // Load products
  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
    setFilteredProducts(data.filter((p) => p.category === "PARES"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

const filterProducts = (cat) => {
  setCategory(cat);

  // Map EXTRA tab to ADD-ONS category in the database
  const dbCategory = cat === "EXTRA" ? "ADD-ONS" : cat;

  setFilteredProducts(products.filter((p) => p.category === dbCategory));
};


  const addToCart = (p) => {
    const existing = cart.find((item) => item._id === p._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === p._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((i) => (i._id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((i) =>
        i._id === id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("No items added");
      return;
    }

    const cashNum = Number(cash);

    if (!cashNum) {
      alert("Enter cash amount");
      return;
    }

    if (cashNum < totalAmount) {
      alert("Not enough cash!");
      return;
    }

    const order = {
      items: cart.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total: totalAmount,
      cash: cashNum,
      change: cashNum - totalAmount,
      cashier,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        alert("Order Completed!");
        setCart([]);
        setCash("");
        setChange(0);
      } else {
        alert("Server error saving order");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="counter-container">
      {/* Header */}
      <div className="top-bar">
        <h1>Counter POS</h1>

        <div className="user-section">
          <span className="username">{cashier}</span>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => filterProducts(cat)}
            className={`cat-btn ${category === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="menu-box">
        <h3>{category} Menu</h3>

        <div className="menu-grid">
          {filteredProducts.map((p) => (
            <div
              className="menu-item"
              key={p._id}
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

        {cart.length === 0 ? (
          <p className="empty-cart">No items added</p>
        ) : (
          cart.map((item) => (
            <div className="cart-row" key={item._id}>
              <span className="item-name">{item.name}</span>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>

              <span className="item-total">
                ₱{item.price * item.qty}
              </span>

              <button
                className="remove-btn"
                onClick={() => removeItem(item._id)}
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}

        <div className="cart-total">Total: ₱{totalAmount}</div>

        <input
          className="cash-input"
          type="number"
          placeholder="Enter cash"
          value={cash}
          onChange={(e) => {
            setCash(e.target.value);
            setChange(Number(e.target.value) - totalAmount);
          }}
        />

        <div className="change-box">
          Change: ₱{change > 0 ? change : 0}
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>
          Complete Order
        </button>
      </div>

      {/* FLOATING SALES BUTTON */}
      <button
        className="floating-sales-btn"
        onClick={() => navigate("/counter/sales")}
      >
        SALES
      </button>
    </div>
  );
}

export default CounterPOS;
