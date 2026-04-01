const CART_PATH = '/comprar/carrito';

export function visitCartAuthenticated(cartFixture, addressFixture) {
  cy.fixture('cart').then((data) => {
    const cartResponse = cartFixture || data.emptyCart;
    const addressResponse = addressFixture || data.addresses;

    cy.intercept('GET', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: [] } });
    cy.intercept('POST', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: {} } });
    cy.intercept('GET', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: [] } });
    cy.intercept('POST', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: {} } });

    cy.intercept('GET', '**/ecommerce/carts/get_cart', cartResponse).as('getCart');
    cy.intercept('POST', '**/ecommerce/carts/add_product_cart', { statusCode: 200, body: {} }).as('addToCart');
    cy.intercept('POST', '**/ecommerce/carts/delete_product', { statusCode: 200, body: {} }).as('deleteProduct');
    cy.intercept('POST', '**/ecommerce/carts/update_product_quantity', { statusCode: 200, body: {} }).as('updateQuantity');
    cy.intercept('POST', '**/ecommerce/carts/delete_cart', { statusCode: 200, body: {} }).as('deleteCart');
    cy.intercept('GET', '**/ecommerce/addresses/get_addresses', addressResponse).as('getAddresses');
    cy.intercept('POST', '**/ecommerce/addresses/create_delivery_address', { statusCode: 200, body: {} }).as('addAddress');
    cy.intercept('GET', '**/categories/get_active_categories', { statusCode: 200, body: { body: [] } }).as('getCategories');
    cy.intercept('GET', '**/ecommerce/profile/get_profile_information', {
      statusCode: 200,
      body: { body: { client: { client_id: 1, name: 'Cypress', email: 'cy@test.com', emailVerified: true } } },
    }).as('getProfile');
    cy.intercept('POST', '**/ecommerce/orders/create_order', {
      statusCode: 200,
      body: { body: { order_id: 999, orderId: 'ORD-999' } },
    }).as('createOrder');

    cy.visit(CART_PATH, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.document.cookie = `authToken=${data.token}; path=/;`;
        win.localStorage.setItem('user-storage', data.userStorage);
      },
    });
  });
}

export { CART_PATH };
