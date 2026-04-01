import { visitCartAuthenticated } from '../../support/cartHelpers';

describe('Cart — Display', () => {

  it('shows empty state when cart has no products', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.emptyCart, data.addresses);
    });
    cy.get('main').contains('Tu carrito está vacío').should('exist');
    cy.get('main').contains('Agrega productos para comenzar a comprar').should('exist');
    cy.get('main').contains('Ir a Productos').should('exist');
  });

  it('shows product names when cart has items', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('iPhone 16 Pro').should('exist');
    cy.get('main').contains('Samsung Galaxy S24').should('exist');
  });

  it('shows product count in header', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('2 productos en tu carrito').should('exist');
  });

  it('shows the page title', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Carrito de Compras').should('exist');
  });

  it('shows order summary section with subtotal and total', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Resumen del Pedido').scrollIntoView().should('be.visible');
    cy.get('main').contains('Subtotal').should('exist');
    cy.get('main').contains('Total:').should('exist');
  });

  it('shows payment plan section', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Plan de Pagos').scrollIntoView().should('be.visible');
    cy.get('main').contains('Pago inicial:').should('exist');
    cy.get('main').contains('Pago mensual:').should('exist');
  });

  it('shows product attributes', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Color: Negro').should('exist');
    cy.get('main').contains('Almacenamiento: 256 GB').should('exist');
  });

  it('shows the purchase flow breadcrumb', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Carrito').should('exist');
  });

});
