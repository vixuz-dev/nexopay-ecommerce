import { visitCartAuthenticated } from '../../support/cartHelpers';

describe('Cart — Out of Stock', () => {

  it('shows "No disponible" label on out-of-stock product', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('No disponible').should('exist');
    });
  });

  it('shows "Remover del carrito" link on out-of-stock product', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('Remover del carrito').should('exist');
    });
  });

  it('applies reduced opacity to out-of-stock product', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').first()
      .should('have.class', 'opacity-75');
  });

  it('shows warning banner when out-of-stock items exist', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Uno o más de tus productos ya no están disponibles').should('exist');
  });

  it('disables checkout button when out-of-stock items exist', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('button', 'Proceder al Pago').scrollIntoView().should('be.disabled');
  });

  it('removes out-of-stock item via "Remover del carrito" link', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('Remover del carrito').click();
    });
    cy.get('main').contains('Xiaomi 18 Pro').should('not.exist');
  });

  it('enables checkout after removing all out-of-stock items', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('button', 'Proceder al Pago').scrollIntoView().should('be.disabled');
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('Remover del carrito').click();
    });
    cy.get('main').contains('button', 'Proceder al Pago').should('not.be.disabled');
  });

  it('does not show warning banner when no out-of-stock items', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Uno o más de tus productos ya no están disponibles').should('not.exist');
  });

  it('does not show quantity controls for out-of-stock items', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithOutOfStock, data.addresses);
    });
    cy.get('main').contains('Xiaomi 18 Pro').parents('[class*="rounded-xl"]').within(() => {
      cy.contains('Cantidad').should('not.exist');
    });
  });

});
