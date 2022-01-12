import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import App from './App';

const app = dva();

app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add  (count) { return count + 1 },
    minus(count) { return count - 1 },
  },
});

// 4. Router
app.router(() => 
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// 5. Start
app.start('#root');

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );