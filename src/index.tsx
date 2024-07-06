import './index.css';
import '@arco-design/web-react/dist/css/arco.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { Provider } from 'jotai';
import { store } from './state';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
}
