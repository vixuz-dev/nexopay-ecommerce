describe('CartSidebar', () => {

  const FAKE_TOKEN = 'cy-fake-token';
  const FAKE_USER_STORAGE = JSON.stringify({
    state: { user: { client_id: 1, name: 'Cypress', email: 'cy@test.com', emailVerified: true } },
    version: 0,
  });

  function setupInterceptsAndVisitHome(cartResponse) {
    cy.fixture('cart').then((data) => {
      const cart = cartResponse || data.cartWithItems;

      cy.intercept('GET', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: [] } });
      cy.intercept('POST', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: {} } });
      cy.intercept('GET', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: [] } });
      cy.intercept('POST', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: {} } });

      cy.intercept('GET', '**/ecommerce/carts/get_cart', cart).as('getCart');
      cy.intercept('POST', '**/ecommerce/carts/**', { statusCode: 200, body: {} }).as('cartAction');
      cy.intercept('GET', '**/ecommerce/addresses/get_addresses', data.addresses).as('getAddresses');
      cy.intercept('GET', '**/categories/get_active_categories', { statusCode: 200, body: { body: [] } }).as('getCategories');
      cy.intercept('GET', '**/ecommerce/profile/get_profile_information', {
        statusCode: 200,
        body: { body: { client: { client_id: 1, name: 'Cypress', email: 'cy@test.com', emailVerified: true } } },
      }).as('getProfile');
      cy.intercept('GET', '**/ecommerce/home/get_home', { statusCode: 200, body: { body: [] } }).as('getHome');
      cy.intercept('GET', '**/ecommerce/products/**', { statusCode: 200, body: { body: { products: [], totalCount: 0 } } }).as('getProducts');

      const cartStorage = JSON.stringify({
        state: {
          items: cart.body.map((item) => ({
            id: item.productId,
            name: item.productName,
            image: item.variantImageUrl,
            price: item.finalPrice,
            category: item.categoryName,
            categoryId: item.categoryId,
            subcategoryId: item.subcategoryId,
            size: 'Estándar',
            stock: item.stock,
            quantity: item.quantity,
            total: item.finalPrice * item.quantity,
            unitInitialPayment: item.initialPaymentCost,
            unitDeferredAmount: item.remainingBalance,
            productVariantId: item.productVariantId,
            attributes: item.attributes || [],
          })),
          deferralMonths: 6,
        },
        version: 0,
      });

      cy.visit('/', {
        failOnStatusCode: false,
        onBeforeLoad(win) {
          win.document.cookie = `authToken=${FAKE_TOKEN}; path=/;`;
          win.localStorage.setItem('user-storage', FAKE_USER_STORAGE);
          win.localStorage.setItem('cart-storage', cartStorage);
        },
      });
    });
  }

  function openSidebar() {
    cy.get('[aria-label="Cerrar carrito"]').should('not.exist');
    cy.get('[aria-label="Carrito de compras"]').first().click();
  }

  it('opens sidebar when clicking cart icon in navbar', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.get('[aria-label="Cerrar carrito"]').should('be.visible');
  });

  it('shows products in sidebar', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.contains('iPhone 16 Pro').should('be.visible');
    cy.contains('Samsung Galaxy S24').should('be.visible');
  });

  it('shows total items count in sidebar header', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.contains('Carrito (3)').should('be.visible');
  });

  it('closes sidebar with X button', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.get('[aria-label="Cerrar carrito"]').click();
    cy.get('[aria-label="Cerrar carrito"]').should('not.be.visible');
  });

  it('shows subtotal and total in sidebar footer', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.contains('Subtotal').should('be.visible');
    cy.contains('Total:').should('be.visible');
  });

  it('navigates to full cart page from sidebar', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.contains('Continuar al pago').click();
    cy.url().should('include', '/comprar/carrito');
  });

  it('shows empty state in sidebar when cart is empty', () => {
    cy.fixture('cart').then((data) => {
      setupInterceptsAndVisitHome(data.emptyCart);
    });
    openSidebar();
    cy.contains('Tu carrito está vacío').should('be.visible');
  });

  it('clears cart from sidebar with "Vaciar Carrito" button', () => {
    setupInterceptsAndVisitHome();
    openSidebar();
    cy.contains('Vaciar Carrito').click();
    cy.contains('Tu carrito está vacío').should('be.visible');
  });

  it('shows "No disponible" for out-of-stock items in sidebar', () => {
    cy.fixture('cart').then((data) => {
      setupInterceptsAndVisitHome(data.cartWithOutOfStock);
    });
    openSidebar();
    cy.contains('No disponible').should('be.visible');
  });

});
