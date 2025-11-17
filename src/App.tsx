import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { LanguageProvider } from './i18n/LanguageContext';
import type { User } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (username: string, password: string, errorMsg: string) => {
    // Demo authentication - replace with real API call
    if (username === 'admin' && password === 'admin123') {
      setUser({ username, role: 'admin' });
    } else {
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <LanguageProvider>
      {!user ? <Login onLogin={handleLogin} /> : <Dashboard user={user} onLogout={handleLogout} />}
    </LanguageProvider>
  );
}

export default App;
