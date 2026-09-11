import { Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Submit from "./pages/public/Submit";
import Track from "./pages/public/Track";
import Portal from "./pages/public/Portal";
import Login from "./pages/staff/Login";
import Register from "./pages/staff/Register";
import Dashboard from "./pages/staff/Dashboard";
import TicketDetail from "./pages/staff/TicketDetail";
import Agents from "./pages/staff/Agents";
import Categories from "./pages/staff/Categories";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/track" element={<Track />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <Agents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
