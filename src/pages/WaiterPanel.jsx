import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Minus, Check, X, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://restoranback.onrender.com';

const WaiterPanel = () => {
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [waiterId, setWaiterId] = useState(2); // Hardcoded for demo (Ali Valiyev - waiter)
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tablesRes, categoriesRes, menuRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/tables`),
        fetch(`${API_URL}/api/categories`),
        fetch(`${API_URL}/api/menu-items`),
        fetch(`${API_URL}/api/users`)
      ]);
      const [tablesData, categoriesData, menuData, usersData] = await Promise.all([
        tablesRes.json(),
        categoriesRes.json(),
        menuRes.json(),
        usersRes.json()
      ]);
      
      setTables(tablesData);
      setCategories(categoriesData);
      setMenuItems(menuData.filter(i => i.is_available));
      if (categoriesData.length > 0) setActiveCategory(categoriesData[0].id);
      
      // Auto-assign a waiter ID if available
      if (usersData && usersData.length > 0) {
        const waiter = usersData.find(u => u.role === 'waiter') || usersData[0];
        setWaiterId(waiter.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadActiveOrder = async (tableId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/active/${tableId}`);
      const data = await res.json();
      setCurrentOrder(data);
    } catch (error) {
      console.error('Error fetching active order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    loadActiveOrder(table.id);
  };

  const handleCreateOrder = async () => {
    if (!selectedTable) return;
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waiter_id: waiterId, table_id: selectedTable.id })
      });
      if (res.ok) {
        const newOrder = await res.json();
        newOrder.items = [];
        setCurrentOrder(newOrder);
        // Refresh tables to update status
        fetchData();
      } else {
        const errData = await res.json();
        alert("Xatolik: " + (errData.error || errData.message || "Baza bilan bog'lanishda muammo"));
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleAddItem = async (menuItem) => {
    if (!currentOrder) {
      alert("Oldin zakaz oching!");
      return;
    }
    try {
      await fetch(`${API_URL}/api/orders/${currentOrder.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_item_id: menuItem.id, quantity: 1 })
      });
      loadActiveOrder(selectedTable.id);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleRemoveItem = async (orderItemId) => {
    try {
      await fetch(`${API_URL}/api/orders/items/${orderItemId}`, { method: 'DELETE' });
      loadActiveOrder(selectedTable.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCloseOrder = async () => {
    if (!currentOrder || !window.confirm("Zakazni yopishga ishonchingiz komilmi?")) return;
    try {
      await fetch(`${API_URL}/api/orders/${currentOrder.id}/close`, { method: 'PUT' });
      setCurrentOrder(null);
      setSelectedTable(null);
      fetchData(); // Refresh tables
    } catch (error) {
      console.error('Error closing order:', error);
    }
  };

  const filteredItems = menuItems.filter(item => item.category_id === activeCategory);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Ofitsiant Paneli</h2>
      </div>

      <div className="waiter-layout">
        {/* Left Sidebar - Tables */}
        <div className="tables-list">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Stollar</h3>
          <div className="tables-grid">
            {tables.map(table => (
              <div 
                key={table.id} 
                className={`waiter-table-card ${table.status} ${selectedTable?.id === table.id ? 'active' : ''}`}
                onClick={() => handleTableClick(table)}
              >
                <span className="table-number">{table.table_number}</span>
                <span className="table-status">{table.status === 'available' ? 'Bo\'sh' : 'Band'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Menu (Only visible if table selected) */}
        <div className="waiter-menu-section">
          {!selectedTable ? (
            <div className="empty-state">
              <Coffee size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Zakaz olish uchun stolni tanlang</p>
            </div>
          ) : (
            <>
              <div className="menu-categories-scroll">
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="menu-items-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="waiter-item-card" onClick={() => handleAddItem(item)}>
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{item.price.toLocaleString()} so'm</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right - Current Order */}
        <div className="current-order-panel">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            {selectedTable ? `${selectedTable.table_number}-stol Zakazi` : 'Joriy Chek'}
          </h3>
          
          {!selectedTable ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Stol tanlanmagan</p>
          ) : loading ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>Yuklanmoqda...</p>
          ) : !currentOrder ? (
            <div className="empty-state" style={{ height: 'auto', padding: '2rem 0' }}>
              <p style={{ marginBottom: '1rem' }}>Bu stolda ochiq zakaz yo'q</p>
              <button className="btn btn-primary" onClick={handleCreateOrder}>Yangi Zakaz Ochish</button>
            </div>
          ) : (
            <div className="order-details">
              <div className="order-items-list">
                {currentOrder.items && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((oi, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="oi-info">
                        <span className="oi-name">{oi.name}</span>
                        <span className="oi-price">{(oi.price * oi.quantity).toLocaleString()} so'm</span>
                      </div>
                      <div className="oi-actions">
                        <span className="oi-qty">x{oi.quantity}</span>
                        <button className="icon-btn delete" onClick={() => handleRemoveItem(oi.id)}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>Hali hech narsa qo'shilmagan</p>
                )}
              </div>
              
              <div className="order-summary">
                <div className="total-row">
                  <span>Umumiy Summa:</span>
                  <span className="total-amount">{currentOrder.final_amount.toLocaleString()} so'm</span>
                </div>
                <button className="btn btn-success" style={{ width: '100%' }} onClick={handleCloseOrder}>
                  <Check size={18} /> Hisobni Yopish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterPanel;
