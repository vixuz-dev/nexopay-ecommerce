import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Featured Products Section', () => {

  it('shows "Productos destacados" heading', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Productos destacados').scrollIntoView().should('be.visible');
  });

  it('shows section description', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Explora nuestras categorías y productos más populares')
      .scrollIntoView().should('be.visible');
  });

  it('shows "Ver más" link to products', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Productos destacados').scrollIntoView();
    cy.get('main').contains('a', 'Ver más').last()
      .should('have.attr', 'href', '/productos');
  });

  it('renders the four featured category tiles', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Productos destacados').scrollIntoView();
    cy.get('main').contains('Electrónica').should('exist');
    cy.get('main').contains('Hogar').should('exist');
    cy.get('main').contains('Moda').should('exist');
    cy.get('main').contains('Belleza').should('exist');
  });

  it('shows description on each tile', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Los mejores productos tecnológicos').scrollIntoView().should('exist');
    cy.get('main').contains('Todo para tu hogar').should('exist');
    cy.get('main').contains('Las últimas tendencias').should('exist');
    cy.get('main').contains('Cuida tu imagen').should('exist');
  });

  it('tiles link to category-filtered products', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Productos destacados').scrollIntoView();
    cy.get('main').contains('a', 'Electrónica').closest('a')
      .should('have.attr', 'href')
      .and('include', '/productos');
  });

});
