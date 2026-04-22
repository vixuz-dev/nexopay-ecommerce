import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './styles/globals.css';

// En desarrollo, StrictMode ejecuta efectos dos veces; si algo de terceros falla solo en dev, prueba sin StrictMode.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
