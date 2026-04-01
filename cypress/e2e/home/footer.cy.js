import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Footer', () => {

  beforeEach(() => {
    visitHomeAuthenticated();
    cy.get('footer').scrollIntoView();
  });

  it('shows NexoPay logo', () => {
    cy.get('footer').find('img[alt="NexoPay Logo"]').should('exist');
  });

  it('shows marketing description', () => {
    cy.get('footer').contains('La plataforma de crédito digital').should('exist');
  });

  it('shows security badge', () => {
    cy.get('footer').contains('Seguridad bancaria garantizada').should('exist');
  });

  it('shows navigation links section', () => {
    cy.get('footer').contains('Navegación').should('exist');
    cy.get('footer').contains('a', 'Inicio').should('have.attr', 'href', '/');
    cy.get('footer').contains('a', 'Productos').should('have.attr', 'href', '/productos');
    cy.get('footer').contains('a', 'Ver carrito').should('have.attr', 'href', '/comprar/carrito');
    cy.get('footer').contains('a', 'Mi cuenta').should('have.attr', 'href', '/mi-cuenta');
    cy.get('footer').contains('a', 'Mis pedidos').should('have.attr', 'href', '/mis-pedidos');
  });

  it('shows contact information', () => {
    cy.get('footer').contains('Contacto').should('exist');
    cy.get('footer').contains('contacto@nexopay.mx').should('exist');
    cy.get('footer').contains('351 145 7093').should('exist');
    cy.get('footer').contains('Zamora, Michoacán, México').should('exist');
  });

  it('shows terms and conditions link (external)', () => {
    cy.get('footer').contains('a', 'Términos y condiciones')
      .should('have.attr', 'href', 'https://nexopay.mx/terminos-condiciones')
      .and('have.attr', 'target', '_blank');
  });

  it('shows legal section', () => {
    cy.get('footer').contains('Legal').should('exist');
    cy.get('footer').contains('Aviso de privacidad').should('exist');
    cy.get('footer').contains('Política de cookies').should('exist');
  });

  it('shows copyright with current year and company name', () => {
    const currentYear = new Date().getFullYear();
    cy.get('footer').contains(`© ${currentYear} Nexo Technologies`).should('exist');
  });

  it('footer nav links navigate correctly', () => {
    cy.get('footer').contains('a', 'Productos').click();
    cy.url().should('include', '/productos');
  });

});
