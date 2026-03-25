/**
 * E2E: Verificación de correo electrónico
 * Requiere usuario autenticado.
 */
describe('Verificación de correo', () => {
  const VERIFICATION_URL = '/verificacion-correo';
  const ENTER_CODE_URL = '/verificacion-correo/ingresar-codigo';

  beforeEach(() => {
    cy.clearCookies();
  });

  it('debe solicitar código y navegar a ingresar código', () => {
    cy.login();
    cy.intercept('POST', '**/add-email-verification', {
      statusCode: 200,
      body: {},
    }).as('addEmail');

    cy.visit(VERIFICATION_URL);
    cy.contains('Verifica tu correo electrónico').should('be.visible');
    cy.get('button[type="submit"]').contains('Verificar').click();

    cy.wait('@addEmail');
    cy.url({ timeout: 5000 }).should('include', 'ingresar-codigo');
    cy.contains('Ingresa el código').should('be.visible');
  });

  it('debe mostrar error con código incorrecto', () => {
    cy.login();
    cy.intercept('POST', '**/add-email-verification', { statusCode: 200, body: {} }).as('addEmail');
    cy.intercept('POST', '**/validate-email-otp', {
      statusCode: 200,
      body: { valid: false, statusMessage: 'Código inválido' },
    }).as('validateOtp');

    cy.visit(VERIFICATION_URL);
    cy.get('button[type="submit"]').contains('Verificar').click();
    cy.wait('@addEmail');

    cy.get('#email-otp-0').type('1');
    cy.get('#email-otp-1').type('2');
    cy.get('#email-otp-2').type('3');
    cy.get('#email-otp-3').type('4');
    cy.get('form').submit();

    cy.contains(/inválido|incorrecto/i, { timeout: 10000 }).should('be.visible');
  });

  it('debe completar verificación con código correcto', () => {
    cy.login();
    cy.intercept('POST', '**/add-email-verification', { statusCode: 200, body: {} }).as('addEmail');
    cy.intercept('POST', '**/validate-email-otp', {
      statusCode: 200,
      body: { valid: true },
    }).as('validateOtp');

    cy.visit(VERIFICATION_URL);
    cy.get('button[type="submit"]').contains('Verificar').click();
    cy.wait('@addEmail');

    cy.get('#email-otp-0').type('1');
    cy.get('#email-otp-1').type('2');
    cy.get('#email-otp-2').type('3');
    cy.get('#email-otp-3').type('4');
    cy.get('form').submit();

    cy.contains('¡Correo verificado!', { timeout: 10000 }).should('be.visible');
  });

  it('debe mostrar botón reenviar tras cooldown de 40s', () => {
    cy.login();
    cy.intercept('POST', '**/add-email-verification', { statusCode: 200, body: {} }).as('addEmail');

    cy.visit(VERIFICATION_URL);
    cy.get('button[type="submit"]').contains('Verificar').click();
    cy.wait('@addEmail');
    cy.url().should('include', 'ingresar-codigo');

    cy.clock();
    cy.contains('Reenviar código').should('not.exist');
    cy.tick(41000);
    cy.contains('Reenviar código').should('be.visible');
  });
});
