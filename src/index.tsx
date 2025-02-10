import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import App from './App';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
