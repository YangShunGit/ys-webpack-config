import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import a from './a'

a()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);