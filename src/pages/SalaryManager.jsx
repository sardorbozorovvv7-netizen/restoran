import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

const SalaryManager = () => {
  const [staff, setStaff] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');

  const fetchData = async () => {
    try {
      const [staffRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:3000/api/staff'),
        fetch('http://localhost:3000/api/payments')
      ]);
      setStaff(await staffRes.json());
      setPayments(await paymentsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;

    try {
      const res = await fetch('http://localhost:3000/api/pay-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser.id, amount: parseFloat(amount) })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setAmount('');
        setSelectedUser(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPayModal = (user) => {
    setSelectedUser(user);
    setAmount(user.salary); // Default to base salary
    setIsModalOpen(true);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Xodimlar Maoshi (Salaries)</h2>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '1rem', fontWeight: 600}}>Xodimlar ro'yxati</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ism familiya</th>
                <th>Lavozim</th>
                <th>Oylik maosh</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(user => (
                <tr key={user.id}>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <span className={`badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.salary.toLocaleString()} so'm</td>
                  <td>
                    <button className="btn btn-success" style={{padding: '0.5rem 1rem'}} onClick={() => openPayModal(user)}>
                      <CreditCard size={16} /> To'lash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 style={{marginBottom: '1rem', fontWeight: 600}}>To'lovlar tarixi</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Xodim</th>
                <th>Miqdor</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.expense_date)}</td>
                  <td>{payment.first_name} {payment.last_name} <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>({payment.role})</span></td>
                  <td style={{color: 'var(--success)', fontWeight: 600}}>+{payment.amount.toLocaleString()} so'm</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Tarix bo'sh</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Maosh to'lash</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handlePay}>
              <div className="form-group" style={{marginBottom: '1rem'}}>
                <p style={{color: 'var(--text-muted)'}}>Xodim: <strong style={{color: 'var(--text-main)'}}>{selectedUser.first_name} {selectedUser.last_name}</strong></p>
                <p style={{color: 'var(--text-muted)'}}>Lavozim: <strong style={{color: 'var(--text-main)', textTransform: 'capitalize'}}>{selectedUser.role}</strong></p>
              </div>
              <div className="form-group">
                <label className="form-label">To'lov miqdori (so'm)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)'}}>Bekor qilish</button>
                <button type="submit" className="btn btn-success">To'lash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManager;
