import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ActivationCode } from '../types';
import './CodeList.css';

interface CodeListProps {
  codes: ActivationCode[];
  onDelete: (code: string) => void;
  onCreate: () => void;
  onDeleteExpired: () => void;
  onBatchDelete: () => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  hasMore: boolean;
}

export default function CodeList({ codes, onDelete, onCreate, onDeleteExpired, onBatchDelete, onLoadMore, onRefresh, hasMore }: CodeListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCodes = useMemo(() => {
    if (!searchQuery) return codes;
    const query = searchQuery.toLowerCase();
    return codes.filter(code => code.code.toLowerCase().includes(query));
  }, [codes, searchQuery]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (code: ActivationCode) => {
    const now = new Date();
    const isExpired = code.expiresAt && new Date(code.expiresAt) < now;
    
    if (code.isUsed) {
      if (isExpired) {
        return <span className="status-badge status-expired">{t.expired}</span>;
      }
      return <span className="status-badge status-active">{t.active}</span>;
    }
    return <span className="status-badge status-unused">{t.unused}</span>;
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="code-list">
      <div className="list-header">
        <h2>
          {t.activationCodes} ({filteredCodes.length})
        </h2>
        <div className="header-actions">
          <button onClick={onRefresh} className="refresh-button">
            {t.refresh}
          </button>
          <button onClick={onBatchDelete} className="batch-delete-button">
            {t.batchDelete}
          </button>
          <button onClick={onDeleteExpired} className="delete-expired-button">
            {t.deleteExpired}
          </button>
          <button onClick={onCreate} className="create-button">
            {t.createCodes}
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="codes-table">
          <thead>
            <tr>
              <th>{t.code}</th>
              <th>{t.status}</th>
              <th>{t.activatedAt}</th>
              <th>{t.expiresAt}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCodes.map(code => (
              <tr key={code.id}>
                <td className="code-cell">{code.code}</td>
                <td>{getStatusBadge(code)}</td>
                <td>{formatDate(code.activatedAt)}</td>
                <td>{formatDate(code.expiresAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onDelete(code.code)} className="delete-button">
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCodes.length === 0 && (
        <div className="empty-state">
          <p>{searchQuery ? t.noCodesMatch : t.noCodesYet}</p>
        </div>
      )}

      {hasMore && (
        <div className="load-more-container">
          <button onClick={onLoadMore} className="load-more-button">
            {t.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
