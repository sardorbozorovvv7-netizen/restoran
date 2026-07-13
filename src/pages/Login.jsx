import React, { useState } from 'react';
import { Utensils, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Noto\'g\'ri parol. Iltimos, qayta urinib ko\'ring.');
    }
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      width: '100%',
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--accent)',
            padding: '1rem',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}>
            <Utensils size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tizimga kirish</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Superadmin paneliga kirish uchun parolni kiriting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="Parol"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{ paddingLeft: '3rem' }}
                required
                autoFocus
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
