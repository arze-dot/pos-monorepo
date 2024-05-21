import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login/Login';
import OrderPage from './pages/order/Order';
import HomePage from './pages/home/Home';
import InventoryPage from './pages/inventory/Inventory';
import OutstandingOrderPage from './pages/order/OustandingOrder';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LoginPage />
    ),
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "order",
    element: <OrderPage />,
  },
  {
    path: "order/:id",
    element: <OrderPage />,
  },
  {
    path: "inventory",
    element: <InventoryPage />,
  },
  {
    path: "outstanding-order",
    element: <OutstandingOrderPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
