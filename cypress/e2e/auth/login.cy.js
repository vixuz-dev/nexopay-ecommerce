/**
 * E2E: Flujo de inicio de sesión
 * Credenciales: usar Cypress.env o valores por defecto para pruebas.
 */
describe('Login', () => {
  const LOGIN_URL = '/iniciar-sesion';

  const testUser = {
    phone: Cypress.env('testPhone') || '3511477103',
    password: Cypress.env('testPassword') || 'Roger2244.',
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.visit(LOGIN_URL);
  });

  it('debe mostrar la página de login', () => {
    cy.contains('Inicia sesión en NexoPay').should('be.visible');
    cy.get('input#telefono').should('be.visible');
    cy.get('input#password').should('be.visible');
  });

  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.get('input#telefono').type(testUser.phone);
    cy.get('input#password').type(testUser.password);
    cy.get('form').submit();

    cy.url({ timeout: 15000 }).should('not.include', 'iniciar-sesion');
  });

  it('debe mostrar error con teléfono vacío', () => {
    cy.get('input#password').type(testUser.password);
    cy.get('form').submit();
    cy.contains('teléfono es requerido').should('be.visible');
  });

  it('debe mostrar error con contraseña vacía', () => {
    cy.get('input#telefono').type(testUser.phone);
    cy.get('form').submit();
    cy.contains('contraseña es requerida').should('be.visible');
  });

  it('debe mostrar error con credenciales incorrectas', () => {
    cy.get('input#telefono').type('9999999999');
    cy.get('input#password').type('WrongPassword123.');
    cy.get('form').submit();

    cy.contains(/incorrectas|incorrecto|error/i, { timeout: 10000 }).should('be.visible');
  });

  it('debe mostrar error con teléfono inválido (menos de 10 dígitos)', () => {
    cy.get('input#telefono').type('12345');
    cy.get('input#password').type(testUser.password);
    cy.get('form').submit();
    cy.contains('El teléfono debe tener exactamente 10 dígitos').should('be.visible');
  });

  it('debe redirigir a Home si ya está autenticado', () => {
    cy.login();
    cy.visit('/iniciar-sesion');
    cy.url({ timeout: 5000 }).should('not.include', 'iniciar-sesion');
  });

  it('debe navegar a registro al hacer clic en Regístrate aquí', () => {
    cy.contains('Regístrate aquí').click();
    cy.url().should('include', '/registro');
    cy.contains('Crea tu cuenta NexoPay').should('be.visible');
  });
});
