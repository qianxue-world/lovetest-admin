import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { apiService } from '../services/api';
import type { BatchDeleteResponse } from '../types';
import './BatchDelete.css';

interface BatchDeleteProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BatchDelete({ onClose, onSuccess }: BatchDeleteProps) {
  const { t } = useLanguage();
  const [pattern, setPattern] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewResult, setPreviewResult] = useState<BatchDeleteResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const buildPattern = (input: string, isRegex: boolean): string => {
    if (isRegex) {
      return input;
    }
    // 如果不是正则，则进行模糊匹配（包含子串）
    // 转义特殊字符
    const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `.*${escaped}.*`;
  };

  const handlePreview = async () => {
    setError('');
    
    if (!pattern.trim()) {
      setError(t.patternRequired);
      return;
    }

    setLoading(true);
    try {
      const finalPattern = buildPattern(pattern, useRegex);
      const result = await apiService.batchDeleteCodes({
        pattern: finalPattern,
        dryRun: true,
      });
      
      setPreviewResult(result);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!previewResult) return;

    if (!confirm(t.batchDeleteConfirm.replace('{count}', previewResult.matchedCount.toString()))) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const finalPattern = buildPattern(pattern, useRegex);
      const result = await apiService.batchDeleteCodes({
        pattern: finalPattern,
        dryRun: false,
      });
      
      alert(result.message);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowPreview(false);
    setPreviewResult(null);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content batch-delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.batchDeleteTitle}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {!showPreview ? (
          <div className="batch-delete-form">
            <div className="form-group">
              <label htmlFor="pattern">{t.deletePattern}</label>
              <input
                id="pattern"
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder={t.deletePatternPlaceholder}
                disabled={loading}
                className="pattern-input"
              />
              <span className="field-hint">
                {useRegex ? t.regexHint : t.substringHint}
              </span>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useRegex}
                  onChange={e => setUseRegex(e.target.checked)}
                  disabled={loading}
                />
                <span>{t.useRegex}</span>
              </label>
            </div>

            {useRegex && (
              <div className="regex-examples">
                <p className="examples-title">{t.regexExamples}:</p>
                <ul>
                  <li><code>^TEST-.*</code> - {t.regexExample1}</li>
                  <li><code>.*-2024$</code> - {t.regexExample2}</li>
                  <li><code>^DEMO-\d+$</code> - {t.regexExample3}</li>
                </ul>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
                {t.cancel}
              </button>
              <button type="button" onClick={handlePreview} className="preview-button" disabled={loading}>
                {loading ? t.loading : t.preview}
              </button>
            </div>
          </div>
        ) : (
          <div className="preview-result">
            <div className={`result-summary ${previewResult?.matchedCount === 0 ? 'no-match' : 'has-match'}`}>
              <h3>{t.previewResult}</h3>
              <p className="match-count">
                {t.foundMatches.replace('{count}', previewResult?.matchedCount.toString() || '0')}
              </p>
              
              {previewResult && previewResult.matchedCount > 0 && (
                <>
                  <div className="matched-codes-preview">
                    <p className="preview-label">{t.matchedCodes}:</p>
                    <div className="codes-list">
                      {previewResult.matchedCodes.slice(0, 10).map((code, index) => (
                        <div key={index} className="code-item">{code}</div>
                      ))}
                      {previewResult.matchedCount > 10 && (
                        <div className="more-indicator">
                          {t.andMore.replace('{count}', (previewResult.matchedCount - 10).toString())}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="warning-box">
                    <span className="warning-icon">⚠️</span>
                    <span>{t.deleteWarning}</span>
                  </div>
                </>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={handleReset} className="cancel-button" disabled={loading}>
                {t.back}
              </button>
              {previewResult && previewResult.matchedCount > 0 && (
                <button 
                  type="button" 
                  onClick={handleDelete} 
                  className="delete-button" 
                  disabled={loading}
                >
                  {loading ? t.deleting : t.confirmDelete}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
