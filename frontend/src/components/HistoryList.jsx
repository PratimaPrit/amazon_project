// src/components/HistoryList.jsx
// Optimization history table

import { useState, useEffect } from 'react';
import { getAllHistory } from '../services/api';

export default function HistoryList({ onSelectOptimization }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getAllHistory();
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;
  if (error) return <div className="error">{error}</div>;
  if (history.length === 0) return <div>No optimization history yet.</div>;

  return (
    <div className="history-container">
      <h3>Optimization History</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>ASIN</th>
            <th>Date</th>
            <th>Original Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id}>
              <td>{item.asin}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="title-preview">{item.original.title.substring(0, 60)}...</td>
              <td>
                <button onClick={() => onSelectOptimization(item)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
