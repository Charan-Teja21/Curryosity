import React from 'react';

function App() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  };

  const textStyle = {
    color: '#333',
    fontSize: '2em',
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const constructionIconStyle = {
    fontSize: '50px',
    margin: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={constructionIconStyle}>🚧</div>
      <div style={textStyle}>
        We're currently under construction. Check back soon!
      </div>
    </div>
  );
}

export default App;
