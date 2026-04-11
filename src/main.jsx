import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Context Providers
import { AuthProvider } from './context/authContext.jsx';
import { EdicionProvider } from './context/EdicionContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EdicionProvider>
          {/* ModalProvider puede ir aquí o más afuera si no depende de los otros */}
          <ModalProvider>
            <App />
          </ModalProvider>
        </EdicionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
