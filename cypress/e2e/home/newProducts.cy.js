import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — New Products Section', () => {

  it('shows section title from API', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Lo más nuevo').should('exist');
  });

  it('shows financing subtitle', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Descubre nuestra selección de productos disponibles con pago a plazos').should('exist');
  });

  it('shows "Ver todos" link pointing to products', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('a', 'Ver todos').should('have.attr', 'href', '/productos');
  });

  it('renders product cards from API', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('iPhone 16 Pro').should('exist');
    cy.get('main').contains('Samsung Galaxy S24').should('exist');
    cy.get('main').contains('MacBook Air M3').should('exist');
  });

  it('product cards show prices', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('$50,000').should('exist');
    cy.get('main').contains('$20,000').should('exist');
  });

  it('product cards show financing info', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Pago inicial y hasta').should('exist');
  });

  it('product card navigates to product detail on click', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('iPhone 16 Pro').click();
    cy.url().should('include', '/producto');
    cy.url().should('include', 'productId=1');
  });

  it('shows empty state when no new products from API', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated({ homeFixture: data.homeEmpty });
    });
    cy.get('main').contains('Lo más nuevo').should('exist');
    cy.get('main').contains('No hay productos disponibles').should('exist');
  });

});
