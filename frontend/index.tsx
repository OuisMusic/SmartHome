import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <459App apiBaseUrl={apiBaseUrl} />
  </React.StrictMode>,
  document.getElementById('root')
);