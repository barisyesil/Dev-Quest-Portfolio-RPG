import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(username, password);
      
      // Token'ı tarayıcı hafızasına kaydet
      localStorage.setItem('admin_token', data.token);
      
      // Admin paneline yönlendir
      navigate('/admin');
    } catch {
      setError('ACCESS DENIED: Invalid Credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>SYSTEM LOGIN</h1>
        <p style={styles.subtitle}>SECURE TERMINAL ACCESS</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="text" 
            placeholder="USERNAME" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button type="submit" style={styles.button}>AUTHENTICATE</button>
        </form>
        <a href="/" style={styles.backLink}>← RETURN TO GAME</a>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#0f172a', color: '#0f0',
    fontFamily: 'monospace'
  },
  loginBox: {
    border: '2px solid #0f0', padding: '40px', borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)', width: '300px',
    textAlign: 'center', backgroundColor: '#000'
  },
  title: { fontSize: '24px', marginBottom: '10px', fontFamily: "'Press Start 2P', cursive" },
  subtitle: { fontSize: '10px', color: '#005500', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '10px', backgroundColor: '#111', border: '1px solid #005500',
    color: '#0f0', fontFamily: 'monospace', outline: 'none'
  },
  button: {
    padding: '12px', backgroundColor: '#0f0', color: '#000', fontWeight: 'bold',
    border: 'none', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive", fontSize: '12px'
  },
  error: { color: 'red', fontSize: '12px', fontWeight: 'bold' },
  backLink: { display: 'block', marginTop: '20px', color: '#555', textDecoration: 'none', fontSize: '12px' }
};

export default Login;