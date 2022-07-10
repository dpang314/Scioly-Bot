if (!Cypress.env('MOCK_APP')) {
  describe('Unauthorized', () => {
    ['/tournaments', '/templates'].forEach(async (route) => {
      console.log(Cypress.env);
      it(`${route} returns unauthorized page`, () => {
        cy.visit(Cypress.config().baseUrl + route);
        cy.contains('Unauthorized');
      });
    });
  });
}
