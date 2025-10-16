import { useState, useEffect } from 'react';
import { getHistory, searchHistoryByAsin, getOptimizationById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHistory = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await getHistory(itemsPerPage + 1, offset);

      const hasMoreData = response.data.length > itemsPerPage;
      const pageData = response.data.slice(0, itemsPerPage);

      setHistory(pageData);
      setHasMore(hasMoreData);
      setCurrentPage(page);
    } catch {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async e => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadHistory(1);
      return;
    }

    setLoading(true);
    setError('');
    setHasMore(false);
    try {
      if (/^\d+$/.test(searchTerm)) {
        const response = await getOptimizationById(searchTerm);
        setHistory([response.data]);
      } else {
        const response = await searchHistoryByAsin(searchTerm.toUpperCase());
        setHistory(response.data);
      }
      setCurrentPage(1);
    } catch {
      setError('No results found');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    loadHistory(1);
  };

  const nextPage = () => {
    if (hasMore) {
      loadHistory(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      loadHistory(currentPage - 1);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewDetails = async itemId => {
    setLoading(true);
    try {
      const response = await getOptimizationById(itemId);
      setSelectedItem(response.data);
    } catch {
      setError('Failed to load optimization details');
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const safeJsonParse = str => {
    try {
      if (typeof str === 'string') {
        return JSON.parse(str);
      }
      return str || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Optimization History</h1>
        <p className="subtitle">View all your past optimizations</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by ASIN or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Search
          </button>
          {searchTerm && (
            <button type="button" onClick={handleReset} className="btn-reset">
              Clear
            </button>
          )}
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {error && <div className="error-message">{error}</div>}

      {!loading && history.length === 0 && (
        <div className="no-history">
          <p>No optimization history found.</p>
          <p>Start optimizing products to see them here!</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <>
          {/* History Table */}
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ASIN</th>
                  <th>Original Title</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <span className="asin-badge">{item.asin}</span>
                    </td>
                    <td className="title-cell">
                      {(item.original?.title || item.original_title || 'N/A').substring(0, 60)}...
                    </td>
                    <td>{formatDate(item.createdAt || item.created_at)}</td>
                    <td>
                      <button onClick={() => viewDetails(item.id)} className="btn-view">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">Page {currentPage}</div>
            <div className="pagination-buttons">
              <button onClick={prevPage} disabled={currentPage === 1} className="btn-pagination">
                Previous
              </button>
              <span className="page-number">Page {currentPage}</span>
              <button onClick={nextPage} disabled={!hasMore} className="btn-pagination">
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeDetails} style={{ display: 'flex' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Optimization Details</h2>
              <button onClick={closeDetails} className="btn-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Product Info</h3>
                <p>
                  <strong>ASIN:</strong> {selectedItem.asin}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {formatDate(selectedItem.createdAt || selectedItem.created_at)}
                </p>
              </div>

              <div className="detail-section">
                <h3>Title</h3>
                <div className="comparison-box">
                  <div className="original">
                    <h4>Original</h4>
                    <p>{selectedItem.original?.title || selectedItem.original_title}</p>
                  </div>
                  <div className="optimized">
                    <h4>Optimized</h4>
                    <p>{selectedItem.optimized?.title || selectedItem.optimized_title}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Bullet Points</h3>
                <div className="comparison-box">
                  <div className="original">
                    <h4>Original</h4>
                    <ul>
                      {(
                        selectedItem.original?.bullets ||
                        safeJsonParse(selectedItem.original_bullets)
                      ).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="optimized">
                    <h4>Optimized</h4>
                    <ul>
                      {(
                        selectedItem.optimized?.bullets ||
                        safeJsonParse(selectedItem.optimized_bullets)
                      ).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <div className="comparison-box">
                  <div className="original">
                    <h4>Original</h4>
                    <p>{selectedItem.original?.description || selectedItem.original_description}</p>
                  </div>
                  <div className="optimized">
                    <h4>Optimized</h4>
                    <p>
                      {selectedItem.optimized?.description || selectedItem.optimized_description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Keywords</h3>
                <div className="keywords">
                  {(
                    selectedItem.optimized?.keywords ||
                    safeJsonParse(selectedItem.suggested_keywords)
                  ).map((keyword, i) => (
                    <span key={i} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
