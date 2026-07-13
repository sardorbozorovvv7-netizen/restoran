import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: 'waiter',
    salary: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://restoranback.onrender.com/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://restoranback.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary) || 0
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ first_name: '', last_name: '', role: 'waiter', salary: '' });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Xodimlar (Staff)</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Yangi xodim qoshish
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ism familiya</th>
                <th>Lavozim</th>
                <th>Oylik maosh</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <span className={`badge ${user.role === 'manager' ? 'manager' : user.role === 'cashier' ? 'cashier' : user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.salary ? `${user.salary.toLocaleString()} so'm` : '0'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Xodimlar mavjud emas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Yangi xodim qoshish</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Ism</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.first_name} 
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Familiya</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.last_name} 
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lavozim</label>
                <select 
                  className="form-control" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="waiter">Ofitsiant (Waiter)</option>
                  <option value="chef">Oshpaz (Chef)</option>
                  <option value="manager">Menejer (Manager)</option>
                  <option value="cashier">Kassir (Cashier)</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Oylik maosh (so'm)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.salary} 
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)'}}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
