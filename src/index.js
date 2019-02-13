import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './admin';
import Router from './router';
import { Provider } from 'react-redux';
import configure from './redux/store/configureStore'
import * as serviceWorker from './serviceWorker';
import configureStore from './redux/store/configureStore';
const store = configureStore()
ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
