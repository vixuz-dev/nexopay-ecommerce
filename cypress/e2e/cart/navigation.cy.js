import { visitCartAuthenticated } from '../../support/cartHelpers';

describe('Cart — Navigation', () => {

  it('navigates to products page from empty cart', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.emptyCart, data.addresses);
    });
    cy.get('main').contains('Ir a Productos').click();
    cy.url().should('include', '/productos');
  });

  it('navigates to product detail when clicking product name', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('a', 'iPhone 16 Pro').first().click();
    cy.url().should('include', '/producto');
  });

  it('navigates to products page via "Continuar Comprando" link', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Continuar Comprando').scrollIntoView().click();
    cy.url().should('include', '/productos');
  });

  it('calls create order API when clicking checkout button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('button', 'Proceder al Pago').scrollIntoView().should('not.be.disabled');
    cy.get('main').contains('button', 'Proceder al Pago').click();
    cy.wait('@createOrder');
    cy.url().should('include', '/comprar/pago');
  });

});
