describe('Unauthorized', () => {
  it('Unauthorized page can be opened', () => {
    cy.visit('http://localhost:3000/unauthorized');
    cy.contains('Unauthorized. Access is restricted to users with admin permission on the Discord server specified in the site configuration.');
  });
});
