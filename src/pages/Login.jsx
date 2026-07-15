import React, { useState } from 'react';
import { Utensils, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1234567') {
      onLogin('superadmin');
    } else if (password === '9999') {
      onLogin('waiter');
    } else if (password === '1111') {
      onLogin('chef');
    } else if (password === '2222') {
      onLogin('manager');
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>O'z sahifangizga kirish uchun parolni kiriting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Lock size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password"
                className="form-control" 
                placeholder="Parol"
                value={password}
                readOnly
                style={{ paddingLeft: '3rem', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25rem' }}
              />
            </div>
            
            {/* Custom Numeric Keypad */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div className="vk-row">
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '1')}>1</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '2')}>2</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '3')}>3</button>
              </div>
              <div className="vk-row">
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '4')}>4</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '5')}>5</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '6')}>6</button>
              </div>
              <div className="vk-row">
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '7')}>7</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '8')}>8</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '9')}>9</button>
              </div>
              <div className="vk-row">
                <button type="button" className="vk-key" onClick={() => setPassword('')}>C</button>
                <button type="button" className="vk-key" onClick={() => setPassword(p => p + '0')}>0</button>
                <button type="button" className="vk-key backspace" onClick={() => setPassword(p => p.slice(0, -1))}>⌫</button>
              </div>
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
