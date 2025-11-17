import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Login.css';

interface LoginProps {
  onLogin: (username: string, password: string, errorMsg: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t.enterBothCredentials);
      return;
    }

    onLogin(username, password, t.invalidCredentials);
  };

  return (
    <div className="login-container">
      <div className="login-lang-switcher">
        <LanguageSwitcher />
      </div>
      <div className="login-box">
        <h1>{t.loginTitle}</h1>
        <p className="login-subtitle">{t.loginSubtitle}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={t.enterUsername}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.enterPassword}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            {t.signIn}
          </button>
        </form>

        <p className="demo-hint">{t.demoHint}</p>
      </div>
    </div>
  );
}
