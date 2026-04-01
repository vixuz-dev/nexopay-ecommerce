import { visitCartAuthenticated } from '../../support/cartHelpers';

describe('Cart — Product Management', () => {

  it('increments product quantity with + button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('iPhone 16 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('1').should('exist');
      cy.get('button').contains('+').click();
      cy.contains('2').should('exist');
    });
  });

  it('decrements product quantity with - button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Samsung Galaxy S24').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('2').should('exist');
      cy.get('button').contains('-').click();
      cy.contains('1').should('exist');
    });
  });

  it('disables - button when quantity is 1', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('iPhone 16 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.get('button').contains('-').should('be.disabled');
    });
  });

  it('removes a product with the X button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('iPhone 16 Pro').should('exist');
    cy.get('main').contains('iPhone 16 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.get('[aria-label="Remover producto"]').click();
    });
    cy.get('main').contains('iPhone 16 Pro').should('not.exist');
  });

  it('clears all products with "Vaciar Carrito" button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Samsung Galaxy S24').should('exist');
    cy.get('main').contains('Vaciar Carrito').click();
    cy.get('main').contains('Tu carrito está vacío').should('exist');
  });

  it('shows "Ir a Productos" after clearing cart', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Vaciar Carrito').click();
    cy.get('main').contains('Ir a Productos').should('exist');
  });

});
