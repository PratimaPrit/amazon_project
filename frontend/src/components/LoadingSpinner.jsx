// src/components/LoadingSpinner.jsx
// Loading animation component

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Optimizing your product listing...</p>
      <p className="spinner-subtext">This may take 20-30 seconds</p>
    </div>
  );
}
