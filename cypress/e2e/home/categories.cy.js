import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Categories Section', () => {

  it('shows "Busca por categorías" heading', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Busca por categorías').should('exist');
  });

  it('shows subtitle text', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Explora nuestras categorías de productos').should('exist');
  });

  it('renders category cards from API', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('Electrónica').should('exist');
    cy.get('main').contains('Moda').should('exist');
    cy.get('main').contains('Hogar').should('exist');
    cy.get('main').contains('Belleza').should('exist');
  });

  it('shows "Ver todas" link pointing to categories page', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('a', 'Ver todas').should('have.attr', 'href', '/categorias');
  });

  it('category cards link to filtered products', () => {
    visitHomeAuthenticated();
    cy.get('main').contains('a', 'Electrónica')
      .should('have.attr', 'href')
      .and('include', '/productos')
      .and('include', 'categoryId=2');
  });

  it('does not render section when no categories', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated({ categoriesFixture: data.categoriesEmpty });
    });
    cy.get('main').contains('Busca por categorías').should('not.exist');
  });

});
