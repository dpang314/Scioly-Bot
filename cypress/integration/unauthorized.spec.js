describe('Unauthorized', () => {
  ['/tournaments', '/templates'].forEach(async (route) => {
    it(`${route} returns unauthorized page`, () => {
      cy.visit(Cypress.config().baseUrl + route);
      cy.contains('Unauthorized');
    });
  });
});
