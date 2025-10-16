// src/components/ASINInput.jsx
// ASIN input form with validation

import { useState } from 'react';

export default function ASINInput({ onOptimize, onSubmit, disabled, loading }) {
  const [asin, setAsin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    // Validate ASIN format
    const cleanAsin = asin.trim().toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(cleanAsin)) {
      setError('ASIN must be exactly 10 alphanumeric characters');
      return;
    }

    setError('');
    // Support both prop names
    if (onOptimize) {
      onOptimize(cleanAsin);
    } else if (onSubmit) {
      onSubmit(cleanAsin);
    }
  };

  return (
    <div className="asin-input-container">
      <h2>Amazon Product Listing Optimizer</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter ASIN (e.g., B08N5WRWNW)"
            value={asin}
            onChange={e => setAsin(e.target.value)}
            disabled={disabled || loading}
            maxLength={10}
          />
          <button type="submit" disabled={disabled || loading || !asin}>
            {loading ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
