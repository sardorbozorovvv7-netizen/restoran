import React, { useState } from 'react';
import { Utensils, Lock, Users, Coffee, ShoppingBag, LayoutDashboard, ArrowLeft } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'superadmin' && password === '5555') {
      onLogin('superadmin');
    } else if (selectedRole === 'manager' && password === '7777') {
      onLogin('manager');
    } else if (selectedRole === 'cashier' && password === '8888') {
      onLogin('cashier');
    } else if (selectedRole === 'waiter' && password === '9999') {
      onLogin('waiter');
    } else {
      setError('Noto\'g\'ri parol. Iltimos, qayta urinib ko\'ring.');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setPassword('');
    setError('');
  };

  const roleDetails = {
    superadmin: { title: 'Super Admin', icon: <LayoutDashboard size={40} />, color: 'var(--accent)' },
    manager: { title: 'Menejer', icon: <Users size={40} />, color: '#10b981' },
    cashier: { title: 'Kassir', icon: <ShoppingBag size={40} />, color: '#f59e0b' },
    waiter: { title: 'Ofitsiant', icon: <Coffee size={40} />, color: '#ef4444' }
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
      
      {!selectedRole ? (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>RestoAdmin Tizimi</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>O'z lavozimingizni tanlang</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1rem'
          }}>
            {Object.entries(roleDetails).map(([roleKey, details]) => (
              <div 
                key={roleKey}
                onClick={() => setSelectedRole(roleKey)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = details.color;
                  e.currentTarget.style.boxShadow = `0 8px 15px ${details.color}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ color: details.color, marginBottom: '1rem' }}>
                  {details.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{details.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative' }}>
          
          <button 
            onClick={handleBack}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <ArrowLeft size={20} /> Orqaga
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: roleDetails[selectedRole].color,
              marginBottom: '1rem'
            }}>
              {roleDetails[selectedRole].icon}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{roleDetails[selectedRole].title} Panel</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Kirish uchun parolni kiriting</p>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', background: roleDetails[selectedRole].color, borderColor: roleDetails[selectedRole].color }}>
            Kirish
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default Login;
