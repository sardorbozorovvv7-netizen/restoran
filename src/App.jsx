import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, LogOut, Menu, X } from 'lucide-react';
import TablesManager from './pages/TablesManager';
import SalaryManager from './pages/SalaryManager';
import UsersManager from './pages/UsersManager';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        
        {/* Mobile Header */}
        <div className="mobile-header">
          <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Utensils className="icon" size={24} />
            RestoAdmin
          </h1>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
        )}

        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1 className="sidebar-header">
              <Utensils className="icon" />
              RestoAdmin
            </h1>
            <nav style={{ marginTop: '2rem' }}>
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
              <NavLink to="/tables" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Utensils size={20} />
                Stollar
              </NavLink>
              <NavLink to="/users" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                Xodimlar
              </NavLink>
              <NavLink to="/salaries" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                Xodimlar Maoshi
              </NavLink>
            </nav>
          </div>
          
          <div className="logout-container" style={{ marginTop: 'auto' }}>
            <button 
              onClick={handleLogout} 
              className="nav-link" 
              style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }}
            >
              <LogOut size={20} />
              Chiqish
            </button>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TablesManager />} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/salaries" element={<SalaryManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
