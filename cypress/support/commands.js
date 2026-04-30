// Comando personalizado para login
Cypress.Commands.add('loginUser', (username, password) => {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

// Comando para interceptar login automáticamente
Cypress.Commands.add('interceptLogin', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('loginRequest');
});