import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { apiService } from '../services/api';
import type { ActivationCode, User, StatsResponse } from '../types';
import CodeList from './CodeList';
import CodeEditor from './CodeEditor';
import ChangePassword from './ChangePassword';
import BatchDelete from './BatchDelete';
import LanguageSwitcher from './LanguageSwitcher';
import VersionBadge from './VersionBadge';
import './Dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showBatchDelete, setShowBatchDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nextSkipToken, setNextSkipToken] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadCodes = async (skipToken?: number) => {
    try {
      const response = await apiService.getCodes(undefined, skipToken, 100);
      if (skipToken) {
        setCodes(prev => [...prev, ...response.codes]);
      } else {
        setCodes(response.codes);
      }
      setNextSkipToken(response.nextSkipToken);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error('Failed to load codes:', err);
      alert(err instanceof Error ? err.message : 'Failed to load codes');
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    Promise.all([loadCodes(), loadStats()])
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleSave = async (count: number, prefix?: string) => {
    try {
      await apiService.generateCodes({ count, prefix });
      setIsCreating(false);
      // Reload codes and stats
      await Promise.all([loadCodes(), loadStats()]);
      alert(t.success);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate codes');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(t.deleteConfirm)) return;
    
    try {
      await apiService.deleteCode(code);
      await Promise.all([loadCodes(), loadStats()]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete code');
    }
  };

  const handleDeleteExpired = async () => {
    if (!confirm(t.deleteExpiredConfirm)) return;
    
    try {
      const result = await apiService.deleteExpiredCodes();
      alert(result.message);
      await Promise.all([loadCodes(), loadStats()]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete expired codes');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleLoadMore = () => {
    if (nextSkipToken !== null) {
      loadCodes(nextSkipToken);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([loadCodes(), loadStats()])
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <VersionBadge />
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t.dashboardTitle}</h1>
          <div className="header-actions">
            <LanguageSwitcher />
            <button onClick={() => setShowChangePassword(true)} className="change-password-button">
              {t.changePassword}
            </button>
            <span className="user-info">
              {t.welcome}, {user.username}
            </span>
            <button onClick={onLogout} className="logout-button">
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">{t.totalCodes}:</span>
            <span className="stat-value">{stats.totalCodes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t.unusedCodes}:</span>
            <span className="stat-value">{stats.unusedCodes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t.usedCodes}:</span>
            <span className="stat-value">{stats.usedCodes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t.activeCodes}:</span>
            <span className="stat-value">{stats.activeCodes}</span>
          </div>
        </div>
      )}

      <main className="dashboard-main">
        <div className="dashboard-content">
          {isCreating ? (
            <CodeEditor onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <CodeList
              codes={codes}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onDeleteExpired={handleDeleteExpired}
              onBatchDelete={() => setShowBatchDelete(true)}
              onLoadMore={handleLoadMore}
              onRefresh={handleRefresh}
              hasMore={hasMore}
            />
          )}
        </div>
      </main>

      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {}}
        />
      )}

      {showBatchDelete && (
        <BatchDelete
          onClose={() => setShowBatchDelete(false)}
          onSuccess={() => {
            Promise.all([loadCodes(), loadStats()]);
          }}
        />
      )}
    </div>
  );
}
