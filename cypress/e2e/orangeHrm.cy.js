/// <reference types="cypress" />

describe('OrangeHRM Login - Taller Completo', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  // Punto 1: INTERCEPT - POST
  it('Interceptar solicitud POST de login', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('loginRequest');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
    cy.screenshot('01-login-exitoso');
  });

  // Punto 1: INTERCEPT - GET
  it('Interceptar solicitud GET', () => {
    cy.intercept('GET', '**/web/index.php/auth/login*').as('getLogin');
    cy.reload();

    cy.wait('@getLogin').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
    });

    cy.screenshot('02-pagina-login-cargada');
  });

  // Punto 4: DEBUG - cy.pause()
  /*it('Debug - cy.pause()', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.pause();
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  }); */

  // Punto 4: DEBUG - cy.debug()
  /* it('Debug - cy.debug()', () => {
    cy.get('input[name="username"]').debug().type('Admin');
    cy.get('input[name="password"]').debug().type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  }); */

  // Punto 4: DEBUG - debugger
  it('Debug - debugger statement', () => {
    cy.get('input[name="username"]').then((element) => {
      debugger;
      cy.wrap(element).type('Admin');
    });
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  // Punto 5: STUBS
  it('Stubs - interceptar window.alert', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('input[name="username"]').type('invalidUser');
    cy.get('input[name="password"]').type('wrongPass');
    cy.get('button[type="submit"]').click();

    cy.pause();

    cy.url().should('include', 'login');
    cy.screenshot('03-error-credenciales');
  });

  // Punto 5: SPIES
  it('Spies - monitorear console.error', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError');
      cy.spy(win.console, 'log').as('consoleLog');
    });

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('@consoleError').should('not.have.been.called');
  });

  // Punto 5: CLOCKS
  it('Clocks - medir tiempo de respuesta', () => {
    const startTime = Date.now();

    cy.intercept('POST', '**/web/index.php/auth/validate', (req) => {
      req.reply((res) => {
        const responseTime = Date.now() - startTime;
        cy.log('Tiempo de respuesta: ' + responseTime + 'ms');
      });
    }).as('timedRequest');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@timedRequest');
    cy.url().should('include', '/dashboard');
  });

  // Punto 8: CONDITIONAL TESTING - SKIP
  it.skip('Conditional - skip test', () => {
    cy.visit('https://nonexistent-url.com');
  });

  // Punto 8: CONDITIONAL TESTING - RETRY
  it('Conditional - retry automático', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  // Punto 8: CONDITIONAL TESTING - VIEWPORT
  it('Conditional - ejecutar en viewport desktop', function () {
    if (Cypress.env('MOBILE')) {
      cy.skip();
    }

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to reset password page', () => {
    cy.get('.orangehrm-login-forgot > .oxd-text').click();
    cy.url().should('include', '/auth/requestPasswordResetCode');
  });

  cy.inter

});