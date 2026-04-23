// ***********************************************
// Custom commands for Cypress E2E tests
// https://on.cypress.io/custom-commands
// ***********************************************

const AUTH_COOKIE = 'authToken';
const PERSISTED_STORES = ['user-storage', 'profile-storage', 'cart-storage', 'credit-form-storage'];
const SESSION_REGISTER_DRAFT = 'nexopay-register-draft';

/**
 * Clears all authentication state: cookie + localStorage tokens and persisted stores.
 * Use before any test that requires an unauthenticated user.
 */
Cypress.Commands.add('clearAuth', () => {
  cy.clearCookie(AUTH_COOKIE);
  cy.window({ log: false }).then((win) => {
    win.localStorage.removeItem(AUTH_COOKIE);
    PERSISTED_STORES.forEach((key) => win.localStorage.removeItem(key));
    win.sessionStorage.removeItem(SESSION_REGISTER_DRAFT);
  });
});

/**
 * Sets up a fake authenticated session (cookie + persisted user store).
 * Use before any test that requires an authenticated user.
 */
Cypress.Commands.add('mockAuth', (overrides = {}) => {
  const token = overrides.token || 'cy-fake-token';
  const user = {
    client_id: 1,
    name: 'Cypress',
    email: 'cypress@test.com',
    emailVerified: true,
    ...overrides.user,
  };

  cy.setCookie(AUTH_COOKIE, token);
  cy.window({ log: false }).then((win) => {
    win.localStorage.setItem(AUTH_COOKIE, token);
    win.localStorage.setItem('user-storage', JSON.stringify({ state: { user }, version: 0 }));
  });
});

/**
 * Performs a real login via the UI.
 */
Cypress.Commands.add('login', (phone, password) => {
  const phoneValue = phone || Cypress.env('testPhone') || '3511477103';
  const passwordValue = password || Cypress.env('testPassword') || 'Roger2244.';

  cy.visit('/iniciar-sesion');
  cy.get('input#telefono').type(phoneValue);
  cy.get('input#password').type(passwordValue);
  cy.get('form').submit();
  cy.url({ timeout: 15000 }).should('not.include', 'iniciar-sesion');
});
