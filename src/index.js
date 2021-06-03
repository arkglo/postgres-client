//use 'yarn dev' to start the server (development mode) - see package.json

import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './lib/registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
// For Toast.
import "./css/animate.min.css"
import "./css/toastr.min.css"

require('./lib/keep-alive')

// console.log("INDEX")

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

registerServiceWorker();