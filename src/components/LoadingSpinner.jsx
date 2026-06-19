const LoadingSpinner = ({ fullPage = false, size = 'default', white = false }) => {
  const spinnerClass = `spinner${size === 'sm' ? ' spinner-sm' : ''}${white ? ' spinner-white' : ''}`;

  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className={spinnerClass}></div>
        <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="spinner-overlay">
      <div className={spinnerClass}></div>
      <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
