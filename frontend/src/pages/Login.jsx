import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser, getImageUrl, currentUser } = useCart();

  const [activeTab, setActiveTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const nextUrl = searchParams.get('next') || '/';

  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      navigate(nextUrl);
    }
  }, [currentUser, navigate, nextUrl]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      triggerToast('Email and password are required.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email: loginEmail.trim(),
          password: loginPassword
        }
      });

      loginUser(data.user, data.token);
      triggerToast(`Welcome back, ${data.user.name}!`);
      setTimeout(() => navigate(nextUrl), 700);
    } catch (error) {
      triggerToast(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      triggerToast('Name is required.', 'error');
      return;
    }
    if (!signupEmail.trim() || !signupPassword.trim()) {
      triggerToast('Email and password are required.', 'error');
      return;
    }
    if (signupPassword.length < 6) {
      triggerToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (!termsAccepted) {
      triggerToast('Please accept terms to continue.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPassword
        }
      });

      loginUser(data.user, data.token);
      triggerToast('Account created successfully.');
      setTimeout(() => navigate(nextUrl), 700);
    } catch (error) {
      triggerToast(error.message || 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', fontFamily: "'Poppins', sans-serif", padding: '80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <img src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" style={{ position: 'absolute', left: '-8%', top: '-4%', opacity: 0.12, width: '380px' }} />
      <img src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" style={{ position: 'absolute', right: '-8%', bottom: '-4%', opacity: 0.12, width: '380px', transform: 'rotate(180deg)' }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 3 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#7E7870', fontSize: '14px', fontWeight: 500 }}>Back to Store</Link>

        <main style={{ background: '#FFF', border: '1px solid #ECE7E0', borderRadius: '20px', padding: '32px', marginTop: '16px' }}>
          <header style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src={getImageUrl('logo.png')} alt="HOMMED" style={{ width: '120px', marginBottom: '8px' }} />
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1E1E1E' }}>Login / Signup</h1>
          </header>

          <div style={{ display: 'flex', borderRadius: '10px', background: '#FAF6F0', padding: '4px', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('login')} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '10px', background: activeTab === 'login' ? '#FFF' : 'transparent', color: activeTab === 'login' ? '#B87A00' : '#7E7870', fontWeight: 600 }}>Login</button>
            <button onClick={() => setActiveTab('signup')} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '10px', background: activeTab === 'signup' ? '#FFF' : 'transparent', color: activeTab === 'signup' ? '#B87A00' : '#7E7870', fontWeight: 600 }}>Signup</button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '14px' }}>
              <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" placeholder="Email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8DCC8' }} />
              <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" placeholder="Password" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8DCC8' }} />
              <button disabled={isLoading} type="submit" style={{ height: '44px', border: 'none', borderRadius: '8px', background: '#B87A00', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'grid', gap: '14px' }}>
              <input value={signupName} onChange={(e) => setSignupName(e.target.value)} type="text" placeholder="Full Name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8DCC8' }} />
              <input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} type="email" placeholder="Email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8DCC8' }} />
              <input value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type="password" placeholder="Password" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8DCC8' }} />
              <label style={{ fontSize: '13px', color: '#7E7870' }}>
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} style={{ marginRight: '8px' }} />
                I agree to terms and privacy policy
              </label>
              <button disabled={isLoading} type="submit" style={{ height: '44px', border: 'none', borderRadius: '8px', background: '#B87A00', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </main>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#FFF', border: '1px solid #ECE7E0', borderRadius: '10px', padding: '12px 16px', color: toast.type === 'error' ? '#D32F2F' : '#2E7D32', fontSize: '13px', fontWeight: 600 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
