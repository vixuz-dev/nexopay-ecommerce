export function visitHomeAuthenticated(options = {}) {
  const {
    homeFixture,
    categoriesFixture,
    addressesFixture,
    userStorageKey,
  } = options;

  cy.fixture('home').then((data) => {
    const homeResponse = homeFixture || data.homeWithSections;
    const categoriesResponse = categoriesFixture || data.categories;
    const addressesResponse = addressesFixture || data.addresses;
    const userStorage = userStorageKey
      ? data[userStorageKey]
      : data.userStorage;

    cy.intercept('GET', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: [] } });
    cy.intercept('POST', '**/*.herokuapp.com/**', { statusCode: 200, body: { body: {} } });
    cy.intercept('GET', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: [] } });
    cy.intercept('POST', '**/*.amazonaws.com/**', { statusCode: 200, body: { body: {} } });

    cy.intercept('GET', '**/ecommerce/home/get_home', homeResponse).as('getHome');
    cy.intercept('GET', '**/categories/get_active_categories', categoriesResponse).as('getCategories');
    cy.intercept('GET', '**/ecommerce/addresses/get_addresses', addressesResponse).as('getAddresses');
    cy.intercept('GET', '**/ecommerce/carts/get_cart', { statusCode: 200, body: [] }).as('getCart');
    cy.intercept('GET', '**/ecommerce/profile/get_profile_information', data.profile).as('getProfile');
    cy.intercept('GET', '**/ecommerce/products/**', { statusCode: 200, body: data.searchEmpty }).as('getProducts');

    const newSection = homeResponse?.body?.sections?.find((s) => s.key === 'new');
    const detailProductStub = newSection?.products?.[0];
    if (detailProductStub) {
      cy.intercept('POST', '**/ecommerce/products/get_product_by_id', (req) => {
        req.reply({
          statusCode: 200,
          body: { success: true, body: detailProductStub },
        });
      }).as('getProductById');
    }

    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.document.cookie = `authToken=${data.token}; path=/;`;
        win.localStorage.setItem('user-storage', userStorage);
        win.localStorage.removeItem('credit-storage');
        win.localStorage.removeItem('addresses-storage');
        win.localStorage.setItem('home-storage', JSON.stringify({
          state: { sections: [], lastFetchedAt: 0, isLoading: false, error: null },
          version: 0,
        }));
      },
    });
  });
}
