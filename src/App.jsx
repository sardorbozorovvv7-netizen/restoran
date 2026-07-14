import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, LogOut, Menu, X, ShoppingBag, Coffee } from 'lucide-react';
import TablesManager from './pages/TablesManager';
import SalaryManager from './pages/SalaryManager';
import UsersManager from './pages/UsersManager';
import MenuManager from './pages/MenuManager';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import WaiterPanel from './pages/WaiterPanel';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!userRole) {
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
              
              {userRole === 'superadmin' && (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    Dashboard
                  </NavLink>
                  <NavLink to="/tables" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <ShoppingBag size={20} />
                    Stollar
                  </NavLink>
                  <NavLink to="/waiter" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Coffee size={20} />
                    Ofitsiant
                  </NavLink>
                  <NavLink to="/menu" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Utensils size={20} />
                    Taomnoma
                  </NavLink>
                  <NavLink to="/managers" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    Menejerlar
                  </NavLink>
                  <NavLink to="/salaries" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    Xodimlar Maoshi
                  </NavLink>
                </>
              )}

              {userRole === 'manager' && (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    Statistika
                  </NavLink>
                  <NavLink to="/waiter" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Coffee size={20} />
                    Ofitsiant
                  </NavLink>
                  <NavLink to="/staff" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    Xodimlar
                  </NavLink>
                </>
              )}

              {userRole === 'cashier' && (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <ShoppingBag size={20} />
                    Stollar
                  </NavLink>
                  <NavLink to="/waiter" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Coffee size={20} />
                    Ofitsiant
                  </NavLink>
                  <NavLink to="/waiters" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    Ofitsiantlar
                  </NavLink>
                </>
              )}

              {userRole === 'waiter' && (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <Coffee size={20} />
                    Ofitsiant
                  </NavLink>
                </>
              )}
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
            {userRole === 'superadmin' && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tables" element={<TablesManager />} />
                <Route path="/waiter" element={<WaiterPanel />} />
                <Route path="/menu" element={<MenuManager />} />
                <Route path="/managers" element={<UsersManager allowedRoles={['manager']} />} />
                <Route path="/salaries" element={<SalaryManager />} />
              </>
            )}

            {userRole === 'manager' && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/waiter" element={<WaiterPanel />} />
                <Route path="/staff" element={<UsersManager allowedRoles={['waiter', 'cashier', 'chef']} />} />
              </>
            )}

            {userRole === 'cashier' && (
              <>
                <Route path="/" element={<TablesManager />} />
                <Route path="/waiter" element={<WaiterPanel />} />
                <Route path="/waiters" element={<UsersManager allowedRoles={['waiter']} />} />
              </>
            )}

            {userRole === 'waiter' && (
              <>
                <Route path="/" element={<WaiterPanel />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
