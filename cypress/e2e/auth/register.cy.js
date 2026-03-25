/**
 * E2E: Flujo de registro
 */
describe('Registro', () => {
  const REGISTER_URL = '/registro';
  const LOGIN_URL = '/iniciar-sesion';

  beforeEach(() => {
    cy.clearCookies();
    cy.visit(REGISTER_URL);
  });

  it('debe mostrar la página de registro con todos los campos', () => {
    cy.contains('Crea tu cuenta NexoPay').should('be.visible');
    cy.get('input#name').should('be.visible');
    cy.get('input#paternalLastname').should('be.visible');
    cy.get('input#maternalLastname').should('be.visible');
    cy.get('input#telefono').should('be.visible');
    cy.get('input#password').should('be.visible');
  });

  it('debe mostrar error con campos vacíos al enviar', () => {
    cy.get('form').submit();
    cy.contains(/requerido/i).should('be.visible');
  });

  it('debe mostrar error con teléfono inválido', () => {
    cy.get('input#name').type('Juan');
    cy.get('input#paternalLastname').type('Pérez');
    cy.get('input#maternalLastname').type('García');
    cy.get('input#telefono').type('123');
    cy.get('input#password').type('Password123.');
    cy.get('form').submit();
    cy.contains('El teléfono debe tener exactamente 10 dígitos').should('be.visible');
  });

  it('debe mostrar error con contraseña corta', () => {
    cy.get('input#name').type('Juan');
    cy.get('input#paternalLastname').type('Pérez');
    cy.get('input#maternalLastname').type('García');
    cy.get('input#telefono').type('3511477103');
    cy.get('input#password').type('Abc1');
    cy.get('form').submit();
    cy.contains('La contraseña debe tener al menos 8 caracteres').should('be.visible');
  });

  it('debe navegar a login al hacer clic en Inicia sesión', () => {
    cy.contains('Inicia sesión').click();
    cy.url().should('include', 'iniciar-sesion');
    cy.contains(/Inicia sesión/i).should('be.visible');
  });

  it('debe redirigir a validar OTP al completar registro exitoso', () => {
    cy.intercept('POST', '**/otp/insert', { statusCode: 201, body: { statusMessage: 'OK' } }).as('insertOtp');

    cy.get('input#name').type('Juan');
    cy.get('input#paternalLastname').type('Pérez');
    cy.get('input#maternalLastname').type('García');
    cy.get('input#telefono').type('3511477103');
    cy.get('input#password').type('Password123.');
    cy.get('form').submit();

    cy.url({ timeout: 10000 }).should('include', 'validar-otp');
    cy.contains('Verifica tu número').should('be.visible');
  });
});
