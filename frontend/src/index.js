import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// highlight-start
// 1. Import the AuthProvider we just created
import { AuthProvider } from './context/AuthContext';
// highlight-end

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* // highlight-start */}
    {/* 2. Wrap the entire App component with the AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
    {/* // highlight-end */}
  </React.StrictMode>
);