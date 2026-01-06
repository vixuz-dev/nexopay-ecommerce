import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CartSidebar from './components/ecommerce/CartSidebar';
import ScrollToTop from './components/common/ScrollToTop';
import useUIStore from './stores/uiStore';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Login from './pages/Login';
import SolicitarCredito from './pages/SolicitarCredito';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import MyProfile from './pages/MyProfile';
import CreditTransactions from './pages/CreditTransactions';
import MyInvoices from './pages/MyInvoices';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';

function App() {
  const { isCartSidebarOpen, closeCartSidebar } = useUIStore();

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen">
          <ScrollToTop />
          <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciar-sesion" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/solicitar-credito" element={<SolicitarCredito />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto" element={<ProductDetail />} />
            <Route path="/mi-cuenta" element={<MyAccount />} />
            <Route path="/mis-compras" element={<MyOrders />} />
            <Route path="/mi-perfil" element={<MyProfile />} />
            <Route path="/movimientos-credito" element={<CreditTransactions />} />
            <Route path="/mis-facturas" element={<MyInvoices />} />
            <Route path="/factura" element={<InvoiceDetailPage />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/pago" element={<Checkout />} />
            <Route path="/confirmacion" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
