// ***********************************************
// Custom commands for Cypress E2E tests
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (phone, password) => {
  const loginUrl = '/iniciar-sesion';
  const phoneValue = phone || Cypress.env('testPhone') || '3511477103';
  const passwordValue = password || Cypress.env('testPassword') || 'Roger2244.';

  cy.visit(loginUrl);
  cy.get('input#telefono').type(phoneValue);
  cy.get('input#password').type(passwordValue);
  cy.get('form').submit();
  cy.url({ timeout: 15000 }).should('not.include', 'iniciar-sesion');
});
