import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// 🔗 Deployed backend URL
const API_URL = "https://pares-pos.onrender.com";

const ReportsPage = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  // Fetch Weekly Sales (last 7 days)
  const fetchWeeklySales = async () => {
    const res = await fetch(`${API_URL}/api/orders`);
    const orders = await res.json();

    const today = new Date();
    const days = Array(7).fill(0); // store totals
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      const diff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

      if (diff >= 0 && diff < 7) {
        days[6 - diff] += order.total;
      }
    });

    setWeeklyData({ labels, values: days });
  };

  // Fetch Monthly Sales
  const fetchMonthlySales = async () => {
    const res = await fetch(`${API_URL}/api/orders/monthly`);
    const data = await res.json();
    setMonthlyData(data);
  };

  useEffect(() => {
    fetchWeeklySales();
    fetchMonthlySales();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales Reports</h1>

      {/* WEEKLY SALES CHART */}
      {weeklyData.labels && (
        <div style={{ marginTop: "30px" }}>
          <h2>Weekly Sales (Last 7 days)</h2>
          <Line
            data={{
              labels: weeklyData.labels,
              datasets: [
                {
                  label: "Sales (₱)",
                  data: weeklyData.values,
                  borderColor: "blue",
                  backgroundColor: "rgba(0, 0, 255, 0.3)",
                },
              ],
            }}
          />
        </div>
      )}

      {/* MONTHLY SALES CHART */}
      {Object.keys(monthlyData).length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>Monthly Sales</h2>

          <Bar
            data={{
              labels: Object.keys(monthlyData),
              datasets: [
                {
                  label: "Sales (₱)",
                  data: Object.values(monthlyData),
                  backgroundColor: "rgba(0, 200, 100, 0.6)",
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;