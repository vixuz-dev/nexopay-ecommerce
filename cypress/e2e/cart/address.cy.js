import { visitCartAuthenticated } from '../../support/cartHelpers';

describe('Cart — Shipping Address', () => {

  it('shows address section with selected address', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Dirección de entrega').scrollIntoView().should('be.visible');
    cy.get('main').contains('Casa').should('exist');
  });

  it('shows multiple addresses as radio options when more than one', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Casa').scrollIntoView().should('be.visible');
    cy.get('main').contains('Oficina').should('exist');
    cy.get('main').find('input[name="deliveryAddress"]').should('have.length', 2);
  });

  it('selects principal address by default', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Casa').scrollIntoView();
    cy.get('main').contains('Casa').parents('label').find('input[type="radio"]').should('be.checked');
  });

  it('allows selecting a different address', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').contains('Oficina').scrollIntoView().click();
    cy.get('main').contains('Oficina').parents('label').find('input[type="radio"]').should('be.checked');
  });

  it('shows "No tienes direcciones" when address list is empty', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.emptyAddresses);
    });
    cy.get('main').contains('No tienes direcciones de entrega').scrollIntoView().should('be.visible');
    cy.get('main').contains('Agregar dirección').should('exist');
  });

  it('shows add address button (+) when addresses exist', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').find('[aria-label="Agregar otra dirección"]').scrollIntoView().should('be.visible');
  });

  it('opens add address modal when clicking add button', () => {
    cy.fixture('cart').then((data) => {
      visitCartAuthenticated(data.cartWithItems, data.addresses);
    });
    cy.get('main').find('[aria-label="Agregar otra dirección"]').scrollIntoView().click();
    cy.contains('Agregar nueva dirección').should('exist');
  });

});
