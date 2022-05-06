if (Cypress.env('APP_ENV') === 'test') {
  describe('Authorized', () => {
    it('Template page can be opened when authorized', () => {
      cy.visit('http://localhost:3000/templates');
    });
  });
} else {
  describe('Unauthorized', () => {
    it('Unauthorized template page is redirected to login', () => {
      // When APP_ENV is not set to test, tournament page should require authentication
      cy.visit('http://localhost:3000/templates').url().should('contain', 'http://localhost:3000/api/auth/signin?error=SessionRequired');
    });
  });
}
