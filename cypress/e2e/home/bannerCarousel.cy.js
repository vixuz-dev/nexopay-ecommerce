import { visitHomeAuthenticated } from '../../support/homeHelpers';

describe('Home — Banner Carousel', () => {

  it('renders banner images', () => {
    visitHomeAuthenticated();
    cy.get('main').find('img[alt*="Banner informativo"]').should('have.length.at.least', 1);
  });

  it('shows navigation dots for multiple banners', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Ir al banner 1"]').should('exist');
    cy.get('[aria-label="Ir al banner 2"]').should('exist');
  });

  it('shows previous/next arrow buttons on hover', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Banner anterior"]').should('exist');
    cy.get('[aria-label="Banner siguiente"]').should('exist');
  });

  it('changes slide when clicking next arrow', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Ir al banner 1"]').then(($dot) => {
      const initialClasses = $dot.attr('class');
      cy.get('[aria-label="Banner siguiente"]').click({ force: true });
      cy.get('[aria-label="Ir al banner 2"]').should('have.class', 'w-8');
    });
  });

  it('changes slide when clicking a dot', () => {
    visitHomeAuthenticated();
    cy.get('[aria-label="Ir al banner 2"]').click();
    cy.get('[aria-label="Ir al banner 2"]').should('have.class', 'w-8');
  });

  it('banners link to products page', () => {
    visitHomeAuthenticated();
    cy.get('main').find('a[aria-label*="Banner informativo"]').first()
      .should('have.attr', 'href', '/productos');
  });

});
