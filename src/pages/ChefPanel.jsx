import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Clock, CheckCircle, Flame, RefreshCw, UtensilsCrossed } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://restoranback.onrender.com';

const STATUS_CONFIG = {
  pending: {
    label: 'Kutilmoqda',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.4)',
    icon: Clock,
    next: 'cooking',
    nextLabel: '🔥 Tayyorlanmoqda'
  },
  cooking: {
    label: 'Tayyorlanmoqda',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.4)',
    icon: Flame,
    next: 'ready',
    nextLabel: '✅ Tayyor'
  }
};

const ChefPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/kitchen/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (itemId, newStatus) => {
    setUpdatingIds(prev => new Set([...prev, itemId]));
    try {
      const res = await fetch(`${API_URL}/api/kitchen/items/${itemId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o =>
          o.id === itemId ? { ...o, status: newStatus } : o
        ));
        // Remove "ready" items after animation
        if (newStatus === 'ready') {
          setTimeout(() => {
            setOrders(prev => prev.filter(o => o.id !== itemId));
          }, 600);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  // Group orders by table
  const groupedByTable = orders.reduce((acc, item) => {
    const key = item.table_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const cookingCount = orders.filter(o => o.status === 'cooking').length;

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ChefHat size={28} color="var(--accent)" />
          <h2 className="page-title" style={{ margin: 0 }}>Oshpaz Paneli</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastUpdated && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Yangilandi: {lastUpdated.toLocaleTimeString('uz-UZ')}
            </span>
          )}
          <button
            onClick={fetchOrders}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Yangilash
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
          <Clock size={20} color="#f59e0b" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kutilmoqda</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #ef4444' }}>
          <Flame size={20} color="#ef4444" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{cookingCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tayyorlanmoqda</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid var(--accent)' }}>
          <UtensilsCrossed size={20} color="var(--accent)" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{Object.keys(groupedByTable).length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faol stollar</div>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && !loading && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '300px', gap: '1rem'
        }}>
          <CheckCircle size={64} color="var(--success, #22c55e)" style={{ opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Hamma taomlar tayyor! 🎉</h3>
          <p style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Yangi buyurtmalar kutilmoqda...</p>
        </div>
      )}

      {/* Orders Grid grouped by table */}
      {Object.entries(groupedByTable).map(([tableId, items]) => (
        <div key={tableId} style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '0.75rem', padding: '0.5rem 0.75rem',
            background: 'var(--card-bg, rgba(255,255,255,0.05))',
            borderRadius: '8px', border: '1px solid var(--border, rgba(255,255,255,0.1))'
          }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>🪑 {tableId}-Stol</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {items.length} ta taom</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {items.map(item => {
              const config = STATUS_CONFIG[item.status];
              if (!config) return null;
              const Icon = config.icon;
              const isUpdating = updatingIds.has(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    transition: 'all 0.3s ease',
                    opacity: isUpdating ? 0.6 : 1,
                    transform: isUpdating ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {item.item_name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          background: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                          borderRadius: '20px',
                          padding: '2px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Icon size={12} /> {config.label}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}>
                      ×{item.quantity}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStatusUpdate(item.id, config.next)}
                    disabled={isUpdating}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                      background: config.color,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.filter = 'brightness(1.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
                  >
                    {isUpdating ? '⏳ Yangilanmoqda...' : config.nextLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChefPanel;
