import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await apiRequest('/admin/login', {
        method: 'POST',
        body: { email, password },
        token: ''
      });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminEmail', data.admin?.email || email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f8f4ec' }}>
      <section style={{ width: '100%', maxWidth: '420px', background: '#fff', border: '1px solid #e9dcc8', borderRadius: '14px', padding: '24px' }}>
        <h1 style={{ margin: '0 0 10px', fontSize: '30px' }}>Admin Login</h1>
        <p style={{ margin: '0 0 16px', color: '#6f675c', fontSize: '14px' }}>Login to view all customer orders.</p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '10px' }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Admin Email"
            required
            style={{ height: '42px', border: '1px solid #d7c8b1', borderRadius: '10px', padding: '0 12px', fontSize: '14px' }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            style={{ height: '42px', border: '1px solid #d7c8b1', borderRadius: '10px', padding: '0 12px', fontSize: '14px' }}
          />

          {error && (
            <p style={{ margin: 0, color: '#a42824', fontSize: '13px', fontWeight: 700 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: '4px', height: '44px', border: 'none', borderRadius: '10px', background: '#b57a08', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
};
