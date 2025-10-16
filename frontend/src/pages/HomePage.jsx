import { useState } from 'react';
import ASINInput from '../components/ASINInput';
import ComparisonView from '../components/ComparisonView';
import LoadingSpinner from '../components/LoadingSpinner';
import { optimizeProduct } from '../services/api';

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [currentOptimization, setCurrentOptimization] = useState(null);
  const [error, setError] = useState('');

  const handleOptimize = async asin => {
    setLoading(true);
    setError('');
    setCurrentOptimization(null);

    try {
      const response = await optimizeProduct(asin);
      setCurrentOptimization(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to optimize product listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Amazon Listing Optimizer</h1>
        <p className="subtitle">Transform your product listings with AI-powered optimization</p>
      </div>

      <div className="search-section">
        <ASINInput onOptimize={handleOptimize} disabled={loading} />
        {error && <div className="error-message">{error}</div>}
      </div>

      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      )}

      {currentOptimization && (
        <div className="results-section">
          <ComparisonView data={currentOptimization} />
        </div>
      )}

      {!loading && !currentOptimization && !error && (
        <div className="info-section">
          <div className="info-card">
            <h3>How it works</h3>
            <ol>
              <li>Enter an Amazon product ASIN</li>
              <li>AI analyzes and optimizes the listing</li>
              <li>Compare original vs optimized content</li>
              <li>Get keyword suggestions</li>
            </ol>
          </div>
          <div className="info-card">
            <h3>Features</h3>
            <ul>
              <li>SEO-optimized titles</li>
              <li>Enhanced bullet points</li>
              <li>Enhanced descriptions</li>
              <li>Keyword recommendations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
