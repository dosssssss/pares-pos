import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CounterPOS from "./pages/CounterPOS";
import AdminProducts from "./pages/AdminProducts";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/counter" element={<CounterPOS />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Routes>
  );
}

export default App;
