import React from 'react';
import ReactDOM from 'react-dom/client';
// Ya no necesitamos importar BrowserRouter aquí porque está en App.jsx
import App from './App.jsx';
import './index.css';

// Context Providers
import { AuthProvider } from './context/authContext.jsx';
import { EdicionProvider } from './context/EdicionContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <EdicionProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </EdicionProvider>
    </AuthProvider>
  </React.StrictMode>
);