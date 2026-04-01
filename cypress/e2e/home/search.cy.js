import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Search Bar', () => {

  it('shows search input with placeholder', () => {
    visitHomeAuthenticated();
    cy.get('input[placeholder*="Buscar productos"]').should('exist');
  });

  it('shows search results dropdown when typing 2+ characters', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated();
      cy.intercept('GET', '**/ecommerce/products/**', data.searchResults).as('searchProducts');
    });
    cy.get('input[placeholder*="Buscar productos"]').first().type('iPho');
    cy.wait('@searchProducts');
    cy.contains('iPhone 16 Pro').should('be.visible');
  });

  it('does not show results for single character', () => {
    visitHomeAuthenticated();
    cy.get('input[placeholder*="Buscar productos"]').first().type('i');
    cy.contains('Buscando...').should('not.exist');
  });

  it('shows "Buscando..." while loading results', () => {
    visitHomeAuthenticated();
    cy.intercept('GET', '**/ecommerce/products/**', (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { body: { products: [], totalCount: 0 } } });
    }).as('slowSearch');
    cy.get('input[placeholder*="Buscar productos"]').first().type('iPhone');
    cy.contains('Buscando...').should('be.visible');
  });

  it('shows no results message when search returns empty', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated();
      cy.intercept('GET', '**/ecommerce/products/**', data.searchEmpty).as('searchEmpty');
    });
    cy.get('input[placeholder*="Buscar productos"]').first().type('xyznotfound');
    cy.wait('@searchEmpty');
    cy.contains('No se encontraron productos').should('be.visible');
  });

  it('navigates to product detail when clicking a search result', () => {
    cy.fixture('home').then((data) => {
      visitHomeAuthenticated();
      cy.intercept('GET', '**/ecommerce/products/**', data.searchResults).as('searchProducts');
    });
    cy.get('input[placeholder*="Buscar productos"]').first().type('iPho');
    cy.wait('@searchProducts');
    cy.contains('button', 'iPhone 16 Pro').click();
    cy.url().should('include', '/producto');
  });

  it('submits search form and navigates to products page', () => {
    visitHomeAuthenticated();
    cy.get('input[placeholder*="Buscar productos"]').first().type('Samsung{enter}');
    cy.url().should('include', '/productos');
    cy.url().should('include', 'q=Samsung');
  });

});
