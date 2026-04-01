import { visitHomeAuthenticated } from '../../support/homeHelpers';

/** Fila visible del navbar con Productos, Ver carrito, Mi cuenta, Mis pedidos (no el dropdown del avatar). */
const DESKTOP_NAV_ITEMS = 'nav div.hidden.md\\:flex.items-center.gap-6.pb-4';

describe('Home — Navbar', () => {

  it('shows NexoPay logo linking to home', () => {
    visitHomeAuthenticated();
    cy.get('nav').find('a').first().should('have.attr', 'href', '/');
    cy.get('nav').find('img[alt="NexoPay"]').should('exist');
  });

  it('shows search bar with placeholder', () => {
    visitHomeAuthenticated();
    cy.get('nav').find('input[placeholder*="Buscar"]').should('exist');
  });

  it('shows cart icon button', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Carrito de compras"]').should('exist');
  });

  it('shows navigation links', () => {
    visitHomeAuthenticated();
    cy.get('nav').contains('Productos').should('exist');
    cy.get('nav').contains('Ver carrito').should('exist');
    cy.get('nav').contains('Mi cuenta').should('exist');
    cy.get('nav').contains('Mis pedidos').should('exist');
  });

  it('shows categories dropdown trigger', () => {
    visitHomeAuthenticated();
    cy.get('nav').contains('Categorías').should('exist');
  });

  it('shows delivery address with zip code when user has address', () => {
    visitHomeAuthenticated();
    cy.get('nav').contains('Enviar a').should('exist');
    cy.get('nav').contains('CP 06000').should('exist');
  });

  it('shows "Agrega dirección" when user has no addresses', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated({ addressesFixture: data.addressesEmpty });
    });
    cy.get('nav').contains('Agrega dirección').should('exist');
  });

  it('navigates to products page from nav link', () => {
    visitHomeAuthenticated();
    cy.get(DESKTOP_NAV_ITEMS).contains('a', 'Productos').click();
    cy.url().should('include', '/productos');
  });

  it('navigates to cart page from nav link', () => {
    visitHomeAuthenticated();
    cy.get(DESKTOP_NAV_ITEMS).contains('a', 'Ver carrito').click();
    cy.url().should('include', '/comprar/carrito');
  });

  it('navigates to account page from nav link', () => {
    visitHomeAuthenticated();
    cy.get(DESKTOP_NAV_ITEMS).contains('a', 'Mi cuenta').click();
    cy.url().should('include', '/mi-cuenta');
  });

  it('navigates to orders page from nav link', () => {
    visitHomeAuthenticated();
    cy.get(DESKTOP_NAV_ITEMS).contains('a', 'Mis pedidos').click();
    cy.url().should('include', '/mis-pedidos');
  });

  it('opens cart sidebar when clicking cart icon', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Carrito de compras"]').first().click();
    cy.get('[aria-label="Cerrar carrito"]').should('be.visible');
  });

  it('shows user avatar / menu button', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Menú de usuario"]').should('exist');
  });

});
