import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18
import './index.css';  // Optional: for your styles
import App from './App';  // Import the main component


// Create the root element using React 18's new API
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

