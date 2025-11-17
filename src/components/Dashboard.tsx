import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ActivationCode, User } from '../types';
import CodeList from './CodeList';
import CodeEditor from './CodeEditor';
import LanguageSwitcher from './LanguageSwitcher';
import './Dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Generate demo data
const generateDemoCodes = (count: number): ActivationCode[] => {
  const codes: ActivationCode[] = [];
  const statuses: ActivationCode['status'][] = ['active', 'inactive', 'used'];

  for (let i = 1; i <= count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const code: ActivationCode = {
      id: i.toString(),
      code: `ACT-2024-${String(i).padStart(6, '0')}`,
      status,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    if (status === 'used') {
      code.usedAt = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString();
      code.userId = `user${Math.floor(Math.random() * 1000)}`;
    }

    codes.push(code);
  }

  return codes;
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const [codes, setCodes] = useState<ActivationCode[]>(() => generateDemoCodes(20000));
  const [editingCode, setEditingCode] = useState<ActivationCode | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const generateCode = (index: number): string => {
    const timestamp = Date.now();
    return `ACT-${new Date().getFullYear()}-${String(timestamp + index).slice(-6)}`;
  };

  const handleEdit = (code: ActivationCode) => {
    setEditingCode(code);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingCode(null);
  };

  const handleSave = (code: ActivationCode, count?: number) => {
    if (isCreating && count) {
      // Bulk create
      const newCodes: ActivationCode[] = [];
      const baseTimestamp = Date.now();

      for (let i = 0; i < count; i++) {
        newCodes.push({
          id: `${baseTimestamp}-${i}`,
          code: generateCode(i),
          status: code.status,
          createdAt: new Date().toISOString(),
        });
      }

      setCodes([...newCodes, ...codes]);
    } else if (!isCreating) {
      // Edit existing
      setCodes(codes.map(c => (c.id === code.id ? code : c)));
    }

    setEditingCode(null);
    setIsCreating(false);
  };

  const handleDelete = (ids: string[]) => {
    setCodes(codes.filter(c => !ids.includes(c.id)));
  };

  const handleCancel = () => {
    setEditingCode(null);
    setIsCreating(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t.dashboardTitle}</h1>
          <div className="header-actions">
            <LanguageSwitcher />
            <span className="user-info">
              {t.welcome}, {user.username}
            </span>
            <button onClick={onLogout} className="logout-button">
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {editingCode !== null || isCreating ? (
            <CodeEditor
              code={editingCode}
              isCreating={isCreating}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <CodeList codes={codes} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
          )}
        </div>
      </main>
    </div>
  );
}
