/**
 * E2E: Validación OTP (post-registro)
 * Requiere venir desde el flujo de registro con state.
 */
describe('Validación OTP', () => {
  const VALIDATE_OTP_URL = '/validar-otp';
  const REGISTER_URL = '/registro';

  beforeEach(() => {
    cy.clearCookies();
  });

  it('debe redirigir a registro si se visita sin state', () => {
    cy.visit(VALIDATE_OTP_URL);
    cy.url({ timeout: 5000 }).should('include', 'registro');
  });

  it('debe mostrar página de OTP cuando viene desde registro', () => {
    cy.intercept('POST', '**/otp/insert', { statusCode: 201, body: { statusMessage: 'OK' } }).as('insertOtp');

    cy.visit(REGISTER_URL);
    cy.get('input#name').type('Juan');
    cy.get('input#paternalLastname').type('Pérez');
    cy.get('input#maternalLastname').type('García');
    cy.get('input#telefono').type('3511477103');
    cy.get('input#password').type('Password123.');
    cy.get('form').submit();

    cy.url({ timeout: 10000 }).should('include', 'validar-otp');
    cy.contains('Verifica tu número').should('be.visible');
    cy.contains('Ingresa el código de verificación').should('be.visible');
    cy.get('input[id^="otp-"]').should('have.length', 6);
  });

  it('debe mostrar error con OTP inválido', () => {
    cy.intercept('POST', '**/otp/insert', { statusCode: 201, body: { statusMessage: 'OK' } }).as('insertOtp');
    cy.intercept('POST', '**/otp/validate_otp', {
      statusCode: 200,
      body: { statusMessage: 'OTP inválido' },
    }).as('validateOtp');

    cy.visit(REGISTER_URL);
    cy.get('input#name').type('Juan');
    cy.get('input#paternalLastname').type('Pérez');
    cy.get('input#maternalLastname').type('García');
    cy.get('input#telefono').type('3511477103');
    cy.get('input#password').type('Password123.');
    cy.get('form').submit();

    cy.url({ timeout: 10000 }).should('include', 'validar-otp');
    cy.get('#otp-0').type('1');
    cy.get('#otp-1').type('2');
    cy.get('#otp-2').type('3');
    cy.get('#otp-3').type('4');
    cy.get('#otp-4').type('5');
    cy.get('#otp-5').type('6');
    cy.get('form').submit();

    cy.contains(/incorrecto|inválido/i, { timeout: 10000 }).should('be.visible');
  });
});
