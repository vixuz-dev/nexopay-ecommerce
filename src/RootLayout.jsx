import { Outlet } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ThemeProvider } from './context/ThemeContext';
import { useAuthInit } from './hooks/useAuthInit';
import { swrConfig } from './api/config/swrConfig';
import CartSidebar from './components/ecommerce/CartSidebar';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/common/ToastContainer';
import EmailVerificationBanner from './components/common/EmailVerificationBanner';
import CreditLineBlockedBanner from './components/common/CreditLineBlockedBanner';
import GlobalLoader from './components/common/GlobalLoader';
import useUIStore from './stores/uiStore';

/**
 * Shell global: providers, banners, carrito y salida de rutas (`Outlet`).
 */
function RootLayout() {
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
          <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
          <GlobalLoader />
          <ToastContainer />
          <Outlet />
        </div>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default RootLayout;
