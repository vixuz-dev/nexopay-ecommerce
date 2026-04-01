import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Layout & Rendering', () => {

  it('renders the home page for authenticated user', () => {
    visitHomeAuthenticated();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('redirects unauthenticated user to login', () => {
    cy.intercept('GET', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: [] } });
    cy.intercept('GET', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: [] } });

    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        win.localStorage.removeItem('user-storage');
        win.localStorage.removeItem('profile-storage');
      },
    });
    cy.url().should('include', '/iniciar-sesion');
  });

  it('renders the navbar', () => {
    visitHomeAuthenticated();
    cy.get('nav').should('exist');
  });

  it('renders the footer', () => {
    visitHomeAuthenticated();
    cy.get('footer').scrollIntoView().should('be.visible');
  });

  it('renders main content area', () => {
    visitHomeAuthenticated();
    cy.get('main').should('exist');
  });

  it('shows banner carousel section', () => {
    visitHomeAuthenticated();
    cy.get('main').find('img[alt*="Banner"]').should('exist');
  });

  it('shows "Lo más nuevo" products section', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Lo más nuevo').should('exist');
  });

  it('shows "Productos destacados" section', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Productos destacados').scrollIntoView().should('be.visible');
  });

  it('shows categories section when categories available', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Busca por categorías').should('exist');
  });

  it('hides categories section when no categories', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated({ categoriesFixture: data.categoriesEmpty });
    });
    cy.get('main').contains('Busca por categorías').should('not.exist');
  });

  it('shows email verification banner for unverified user', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated({ userStorageKey: 'userStorageUnverified' });
    });
    cy.contains('Verifica tu correo electrónico').should('exist');
    cy.contains('Verificar correo').should('exist');
  });

  it('does not show email verification banner for verified user', () => {
    visitHomeAuthenticated();
    cy.contains('Verifica tu correo electrónico').should('not.exist');
  });

});
