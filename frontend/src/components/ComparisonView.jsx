// src/components/ComparisonView.jsx
// Side-by-side comparison of original vs optimized listing

export default function ComparisonView({ data }) {
  if (!data) return null;

  const { original, optimized, asin } = data;

  return (
    <div className="comparison-container">
      <h3>ASIN: {asin}</h3>

      <div className="comparison-grid">
        {/* Title Comparison */}
        <div className="comparison-section">
          <h4>Title</h4>
          <div className="side-by-side">
            <div className="original">
              <h5>Original</h5>
              <p>{original.title}</p>
            </div>
            <div className="optimized">
              <h5>Optimized</h5>
              <p>{optimized.title}</p>
            </div>
          </div>
        </div>

        {/* Bullet Points Comparison */}
        <div className="comparison-section">
          <h4>Bullet Points</h4>
          <div className="side-by-side">
            <div className="original">
              <h5>Original</h5>
              <ul>
                {original.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="optimized">
              <h5>Optimized</h5>
              <ul>
                {optimized.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Description Comparison */}
        <div className="comparison-section">
          <h4>Description</h4>
          <div className="side-by-side">
            <div className="original">
              <h5>Original</h5>
              <p>{original.description}</p>
            </div>
            <div className="optimized">
              <h5>Optimized</h5>
              <p>{optimized.description}</p>
            </div>
          </div>
        </div>

        {/* Suggested Keywords */}
        <div className="comparison-section">
          <h4>Suggested Keywords</h4>
          <div className="keywords">
            {optimized.keywords.map((keyword, idx) => (
              <span key={idx} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
