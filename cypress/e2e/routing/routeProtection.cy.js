const LOGIN_PATH = '/iniciar-sesion';

const PROTECTED_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/verificacion-correo', name: 'Email Verification' },
  { path: '/verificacion-correo/ingresar-codigo', name: 'Email Verification Code' },
  { path: '/solicitar-credito', name: 'Request Credit' },
  { path: '/mis-solicitudes', name: 'My Credit' },
  { path: '/categorias', name: 'Categories' },
  { path: '/productos', name: 'Products' },
  { path: '/producto', name: 'Product Detail' },
  { path: '/mi-cuenta', name: 'My Account' },
  { path: '/mis-pedidos', name: 'My Orders' },
  { path: '/mi-perfil', name: 'My Profile' },
  { path: '/mi-cuenta/movimientos', name: 'Account Movements' },
  { path: '/mi-cuenta/pagos', name: 'Account Payments' },
  { path: '/mis-facturas', name: 'My Invoices' },
  { path: '/comprar/carrito', name: 'Cart' },
  { path: '/comprar/pago', name: 'Checkout' },
  { path: '/comprar/confirmacion', name: 'Order Confirmation' },
];

const PUBLIC_ROUTES = [
  { path: '/iniciar-sesion', name: 'Login' },
  { path: '/registro', name: 'Register' },
  { path: '/validar-otp', name: 'Validate OTP' },
];

const FAKE_TOKEN = 'cy-fake-token';
const FAKE_USER_STORAGE = JSON.stringify({
  state: { user: { client_id: 1, name: 'Cypress', email: 'cy@test.com', emailVerified: true } },
  version: 0,
});

function visitUnauthenticated(path) {
  cy.visit(path, {
    failOnStatusCode: false,
    onBeforeLoad(win) {
      win.document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      win.localStorage.removeItem('authToken');
      win.localStorage.removeItem('user-storage');
      win.localStorage.removeItem('profile-storage');
    },
  });
}

function visitAuthenticated(path) {
  cy.visit(path, {
    failOnStatusCode: false,
    onBeforeLoad(win) {
      win.document.cookie = `authToken=${FAKE_TOKEN}; path=/;`;
      win.localStorage.setItem('user-storage', FAKE_USER_STORAGE);
    },
  });
}

describe('Route Protection', () => {

  describe('Unauthenticated — protected routes redirect to login', () => {
    PROTECTED_ROUTES.forEach(({ path, name }) => {
      it(`${name} (${path})`, () => {
        visitUnauthenticated(path);
        cy.url({ timeout: 10000 }).should('include', LOGIN_PATH);
      });
    });
  });

  describe('Unauthenticated — public routes are accessible', () => {
    PUBLIC_ROUTES.forEach(({ path, name }) => {
      it(`${name} (${path})`, () => {
        visitUnauthenticated(path);
        cy.url({ timeout: 10000 }).should('include', path);
      });
    });
  });

  describe('Authenticated — public routes redirect away from login', () => {
    PUBLIC_ROUTES.forEach(({ path, name }) => {
      it(`${name} (${path})`, () => {
        visitAuthenticated(path);
        cy.url({ timeout: 10000 }).should('not.include', LOGIN_PATH);
      });
    });
  });

  describe('Authenticated — protected routes are accessible', () => {
    PROTECTED_ROUTES.forEach(({ path, name }) => {
      it(`${name} (${path})`, () => {
        visitAuthenticated(path);
        cy.url({ timeout: 10000 }).should('not.include', LOGIN_PATH);
      });
    });
  });

});
