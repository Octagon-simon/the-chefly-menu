import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MenuPage } from "./pages/menu-page"
import { AdminPage } from "./pages/admin-page"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
