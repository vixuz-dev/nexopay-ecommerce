/**
 * E2E: Cerrar sesión
 */
describe('Logout', () => {
  const LOGIN_URL = '/iniciar-sesion';
  const HOME_URL = '/';

  beforeEach(() => {
    cy.clearCookies();
  });

  it('debe cerrar sesión y redirigir a login', () => {
    cy.login();
    cy.visit(HOME_URL);
    cy.get('[aria-label="Menú de usuario"]').trigger('mouseenter');
    cy.contains('Cerrar sesión').click();

    cy.url({ timeout: 5000 }).should('include', 'iniciar-sesion');
  });

  it('debe redirigir a login al acceder a ruta protegida tras logout', () => {
    cy.login();
    cy.visit('/mi-cuenta');
    cy.url().should('include', 'mi-cuenta');

    cy.get('[aria-label="Menú de usuario"]').trigger('mouseenter');
    cy.contains('Cerrar sesión').click();
    cy.url({ timeout: 5000 }).should('include', 'iniciar-sesion');

    cy.visit('/mi-cuenta');
    cy.url({ timeout: 5000 }).should('include', 'iniciar-sesion');
  });
});
