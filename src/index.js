import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css'; 
import App from './App'; 

// Rendering the App component inside the "root" div from index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Mounting React to the "root" div
);
