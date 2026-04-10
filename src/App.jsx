import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { SWRConfig } from "swr";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuthInit } from "./hooks/useAuthInit";
import { swrConfig } from "./api/config/swrConfig";
import CartSidebar from "./components/ecommerce/CartSidebar";
import ScrollToTop from "./components/common/ScrollToTop";
import ToastContainer from "./components/common/ToastContainer";
import EmailVerificationBanner from "./components/common/EmailVerificationBanner";
import CreditLineBlockedBanner from "./components/common/CreditLineBlockedBanner";
import GlobalLoader from "./components/common/GlobalLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import useUIStore from "./stores/uiStore";
import { ROUTES, getOrderDetailUrl } from "./utils/routes";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ValidateOtp from "./pages/ValidateOtp";
import VerificacionCorreo from "./pages/VerificacionCorreo";
import VerificacionCorreoIngresarCodigo from "./pages/VerificacionCorreoIngresarCodigo";
import RequestCredit from "./pages/RequestCredit";
import MyCredit from "./pages/MyCredit";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import AccountMovements from "./pages/AccountMovements";
import AccountPayments from "./pages/AccountPayments";
import MyInvoices from "./pages/MyInvoices";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

const InvoiceDetailRedirect = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  return (
    <Navigate
      to={orderId ? getOrderDetailUrl(orderId) : ROUTES.MY_ORDERS}
      replace
    />
  );
};

function App() {
  const { isCartSidebarOpen, closeCartSidebar } = useUIStore();
  const { loading: authLoading } = useAuthInit();

  if (authLoading) {
    return <GlobalLoader forceVisible />;
  }

  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider>
          <div className="min-h-screen">
            <ScrollToTop />
            <div className="sticky top-0 z-40">
              <CreditLineBlockedBanner />
              <EmailVerificationBanner />
            </div>
            <CartSidebar
              isOpen={isCartSidebarOpen}
              onClose={closeCartSidebar}
            />
            <GlobalLoader />
            <ToastContainer />
            <Routes>
              <Route
                path={ROUTES.HOME}
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LOGIN}
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.VALIDATE_OTP}
                element={
                  <PublicRoute>
                    <ValidateOtp />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.EMAIL_VERIFICATION}
                element={
                  <ProtectedRoute>
                    <VerificacionCorreo />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EMAIL_VERIFICATION_ENTER_CODE}
                element={
                  <ProtectedRoute>
                    <VerificacionCorreoIngresarCodigo />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.REQUEST_CREDIT}
                element={
                  <ProtectedRoute>
                    <RequestCredit />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_CREDIT}
                element={
                  <ProtectedRoute>
                    <MyCredit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mi-credito"
                element={<Navigate to={ROUTES.MY_CREDIT} replace />}
              />
              <Route
                path={ROUTES.CREDIT_REQUEST}
                element={<Navigate to={ROUTES.MY_CREDIT} replace />}
              />
              <Route
                path={ROUTES.CATEGORIES}
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PRODUCTS}
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PRODUCT_DETAIL}
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_ACCOUNT}
                element={
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ORDER_DETAIL}
                element={
                  <ProtectedRoute>
                    <InvoiceDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_ORDERS}
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_PROFILE}
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACCOUNT_MOVEMENTS}
                element={
                  <ProtectedRoute>
                    <AccountMovements />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACCOUNT_PAYMENTS}
                element={
                  <ProtectedRoute>
                    <AccountPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movimientos-credito"
                element={<Navigate to={ROUTES.ACCOUNT_MOVEMENTS} replace />}
              />
              <Route
                path={ROUTES.MY_INVOICES}
                element={
                  <ProtectedRoute>
                    <MyInvoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.INVOICE_DETAIL}
                element={<InvoiceDetailRedirect />}
              />
              <Route
                path="/mis-compras"
                element={<Navigate to={ROUTES.MY_ORDERS} replace />}
              />
              <Route
                path="/carrito"
                element={<Navigate to={ROUTES.CART} replace />}
              />
              <Route
                path="/pago"
                element={<Navigate to={ROUTES.CHECKOUT} replace />}
              />
              <Route
                path="/confirmacion"
                element={<Navigate to={ROUTES.ORDER_CONFIRMATION} replace />}
              />
              <Route
                path={ROUTES.CART}
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.CHECKOUT}
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ORDER_CONFIRMATION}
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Routes>
          </div>
        </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
