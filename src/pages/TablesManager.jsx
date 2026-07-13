import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const TablesManager = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');

  const fetchTables = async () => {
    try {
      const res = await fetch('https://restoranback.onrender.com/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNum) return;

    try {
      const res = await fetch('https://restoranback.onrender.com/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: parseInt(newTableNum), status: 'available' })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTableNum('');
        fetchTables();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Stollar (Tables)</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Yangi stol qoshish
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Stol Raqami</th>
                <th>Holati</th>
              </tr>
            </thead>
            <tbody>
              {tables.map(table => (
                <tr key={table.id}>
                  <td>#{table.id}</td>
                  <td>Stol {table.table_number}</td>
                  <td>
                    <span className={`badge ${table.status}`}>
                      {table.status}
                    </span>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Stollar mavjud emas</td>
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
              <h3 className="modal-title">Yangi stol qoshish</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddTable}>
              <div className="form-group">
                <label className="form-label">Stol raqami</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newTableNum} 
                  onChange={e => setNewTableNum(e.target.value)}
                  required
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

export default TablesManager;
