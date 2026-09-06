import { Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Submit from "./pages/public/Submit";
import Track from "./pages/public/Track";
import Login from "./pages/staff/Login";
import Dashboard from "./pages/staff/Dashboard";
import TicketDetail from "./pages/staff/TicketDetail";
import Agents from "./pages/staff/Agents";
import Categories from "./pages/staff/Categories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/track" element={<Track />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tickets/:id" element={<TicketDetail />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
}

export default App;
