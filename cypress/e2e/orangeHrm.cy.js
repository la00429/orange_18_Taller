/// <reference types="cypress" />

describe('OrangeHRM Login', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show an error message with invalid credentials', () => {
    cy.get('input[name="username"]').type('invalidUser');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('be.visible');
  });

  it('should show a required message for empty username', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group > .oxd-text').should('contain', 'Required');
  });

  it('should show a required message for empty password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group > .oxd-text').should('contain', 'Required');
  });

  it('should show required messages for empty username and password', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group > .oxd-text').should('have.length', 2);
    cy.get('.oxd-input-group > .oxd-text').first().should('contain', 'Required');
    cy.get('.oxd-input-group > .oxd-text').last().should('contain', 'Required');
  });

  it('should navigate to the reset password page when "Forgot your password?" is clicked', () => {
    cy.get('.orangehrm-login-forgot > .oxd-text').click();
    cy.url().should('include', '/auth/requestPasswordResetCode');
  });
});
