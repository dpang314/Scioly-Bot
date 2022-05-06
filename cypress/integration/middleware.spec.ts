describe('middleware', () => {
  it('middleware redirects from / to /tournaments', () => {
    cy.visit('http://localhost:3000/').url().should('equal', 'http://localhost:3000/tournaments');
  });
});
