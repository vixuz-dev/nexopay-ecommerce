import { Navigate, createBrowserRouter, useSearchParams } from 'react-router-dom';
import RootLayout from './RootLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import { ROUTES, getOrderDetailUrl } from './utils/routes';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ValidateOtp from './pages/ValidateOtp';
import PasswordResetFlowLayout from './pages/PasswordResetFlowLayout';
import PasswordResetPhonePage from './pages/PasswordResetPhonePage';
import PasswordResetOtpPage from './pages/PasswordResetOtpPage';
import PasswordResetNewPasswordPage from './pages/PasswordResetNewPasswordPage';
import VerificacionCorreo from './pages/VerificacionCorreo';
import VerificacionCorreoIngresarCodigo from './pages/VerificacionCorreoIngresarCodigo';
import RequestCredit from './pages/RequestCredit';
import MyCredit from './pages/MyCredit';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import MyProfile from './pages/MyProfile';
import AccountMovements from './pages/AccountMovements';
import AccountPayments from './pages/AccountPayments';
import MyInvoices from './pages/MyInvoices';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

const InvoiceDetailRedirect = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  return (
    <Navigate to={orderId ? getOrderDetailUrl(orderId) : ROUTES.MY_ORDERS} replace />
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.VALIDATE_OTP,
        element: (
          <PublicRoute>
            <ValidateOtp />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.PASSWORD_RESET,
        element: (
          <PublicRoute>
            <PasswordResetFlowLayout />
          </PublicRoute>
        ),
        children: [
          { index: true, element: <PasswordResetPhonePage /> },
          { path: 'codigo', element: <PasswordResetOtpPage /> },
          { path: 'nueva-contrasena', element: <PasswordResetNewPasswordPage /> },
        ],
      },
      {
        path: ROUTES.EMAIL_VERIFICATION,
        element: (
          <ProtectedRoute>
            <VerificacionCorreo />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EMAIL_VERIFICATION_ENTER_CODE,
        element: (
          <ProtectedRoute>
            <VerificacionCorreoIngresarCodigo />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REQUEST_CREDIT,
        element: (
          <ProtectedRoute>
            <RequestCredit />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_CREDIT,
        element: (
          <ProtectedRoute>
            <MyCredit />
          </ProtectedRoute>
        ),
      },
      { path: '/mi-credito', element: <Navigate to={ROUTES.MY_CREDIT} replace /> },
      { path: ROUTES.CREDIT_REQUEST, element: <Navigate to={ROUTES.MY_CREDIT} replace /> },
      {
        path: ROUTES.CATEGORIES,
        element: (
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PRODUCTS,
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_ACCOUNT,
        element: (
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: (
          <ProtectedRoute>
            <InvoiceDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_ORDERS,
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_PROFILE,
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ACCOUNT_MOVEMENTS,
        element: (
          <ProtectedRoute>
            <AccountMovements />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ACCOUNT_PAYMENTS,
        element: (
          <ProtectedRoute>
            <AccountPayments />
          </ProtectedRoute>
        ),
      },
      { path: '/movimientos-credito', element: <Navigate to={ROUTES.ACCOUNT_MOVEMENTS} replace /> },
      {
        path: ROUTES.MY_INVOICES,
        element: (
          <ProtectedRoute>
            <MyInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INVOICE_DETAIL,
        element: <InvoiceDetailRedirect />,
      },
      { path: '/mis-compras', element: <Navigate to={ROUTES.MY_ORDERS} replace /> },
      { path: '/carrito', element: <Navigate to={ROUTES.CART} replace /> },
      { path: '/pago', element: <Navigate to={ROUTES.CHECKOUT} replace /> },
      { path: '/confirmacion', element: <Navigate to={ROUTES.ORDER_CONFIRMATION} replace /> },
      {
        path: ROUTES.CART,
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDER_CONFIRMATION,
        element: (
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        ),
      },
      { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    ],
  },
]);
