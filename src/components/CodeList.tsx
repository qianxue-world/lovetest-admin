import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ActivationCode } from '../types';
import './CodeList.css';

interface CodeListProps {
  codes: ActivationCode[];
  onEdit: (code: ActivationCode) => void;
  onDelete: (ids: string[]) => void;
  onCreate: () => void;
}

export default function CodeList({ codes, onEdit, onDelete, onCreate }: CodeListProps) {
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const filteredCodes = useMemo(() => {
    if (!searchQuery) return codes;
    const query = searchQuery.toLowerCase();
    return codes.filter(
      code =>
        code.code.toLowerCase().includes(query) ||
        code.userId?.toLowerCase().includes(query) ||
        code.status.toLowerCase().includes(query)
    );
  }, [codes, searchQuery]);

  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCodes = filteredCodes.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: ActivationCode['status']) => {
    const statusClasses = {
      active: 'status-badge status-active',
      inactive: 'status-badge status-inactive',
      used: 'status-badge status-used',
    };
    const statusLabels = {
      active: t.active,
      inactive: t.inactive,
      used: t.used,
    };
    return <span className={statusClasses[status]}>{statusLabels[status]}</span>;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedCodes.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    const confirmMsg = t.deleteBulkConfirm.replace('{count}', selectedIds.size.toString());
    if (confirm(confirmMsg)) {
      onDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const isAllSelected = paginatedCodes.length > 0 && paginatedCodes.every(c => selectedIds.has(c.id));

  return (
    <div className="code-list">
      <div className="list-header">
        <h2>
          {t.activationCodes} ({filteredCodes.length})
        </h2>
        <div className="header-actions">
          <button onClick={onCreate} className="create-button">
            {t.createCodes}
          </button>
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDelete} className="delete-bulk-button">
              {t.deleteSelected} ({selectedIds.size})
            </button>
          )}
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
              <th className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>{t.code}</th>
              <th>{t.status}</th>
              <th>{t.createdAt}</th>
              <th>{t.usedAt}</th>
              <th>{t.userId}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCodes.map(code => (
              <tr key={code.id} className={selectedIds.has(code.id) ? 'selected-row' : ''}>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(code.id)}
                    onChange={e => handleSelectOne(code.id, e.target.checked)}
                  />
                </td>
                <td className="code-cell">{code.code}</td>
                <td>{getStatusBadge(code.status)}</td>
                <td>{formatDate(code.createdAt)}</td>
                <td>{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
                <td>{code.userId || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(code)} className="edit-button">
                      {t.edit}
                    </button>
                    <button onClick={() => onDelete([code.id])} className="delete-button">
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            {t.previous}
          </button>
          <span className="page-info">
            {t.pageOf} {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}
