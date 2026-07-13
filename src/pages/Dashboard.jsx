import React, { useState, useEffect } from 'react';
import { Users, Utensils, Banknote, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_tables: 0,
    total_staff: 0,
    total_salaries_paid: 0,
    revenue_by_staff: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://restoranback.onrender.com/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Superadmin Dashboard (Statistika)</h2>
      </div>
      
      <div className="grid-cards" style={{marginBottom: '2rem'}}>
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent)'}}>
              <Utensils size={32} />
            </div>
            <div>
              <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase'}}>Jami Stollar</p>
              <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{stats.total_tables}</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)'}}>
              <Users size={32} />
            </div>
            <div>
              <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase'}}>Jami Xodimlar</p>
              <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{stats.total_staff} kishi</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: '#ec4899'}}>
              <Banknote size={32} />
            </div>
            <div>
              <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase'}}>To'langan Maoshlar</p>
              <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{stats.total_salaries_paid.toLocaleString()} so'm</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
          <TrendingUp size={24} style={{color: 'var(--accent)'}} />
          <h3 style={{fontWeight: 600}}>Xodimlar olib kelgan daromad</h3>
        </div>
        
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Xodim</th>
                <th>Lavozimi</th>
                <th>Jami olib kelgan daromadi</th>
              </tr>
            </thead>
            <tbody>
              {stats.revenue_by_staff.map((staff, idx) => (
                <tr key={idx}>
                  <td style={{fontWeight: 500}}>{staff.first_name} {staff.last_name}</td>
                  <td>
                    <span className={`badge ${staff.role}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td style={{color: 'var(--success)', fontWeight: 600}}>
                    {staff.revenue ? staff.revenue.toLocaleString() : '0'} so'm
                  </td>
                </tr>
              ))}
              {(!stats.revenue_by_staff || stats.revenue_by_staff.length === 0) && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Ma'lumot topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
