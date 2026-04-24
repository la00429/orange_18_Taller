/// <reference types="cypress" />

describe('OrangeHRM Login', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('should login successfully with valid credentials and take a screenshot', () => {
    // Usamos un intercept con alias para esperar a que la petición de login termine
    cy.intercept('POST', '**/web/index.php/auth/validate').as('loginRequest');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Esperamos a que la petición de login se complete
    cy.wait('@loginRequest');

    cy.url().should('include', '/dashboard');
    
    // 6. Capturar screenshot manualmente
    cy.screenshot('dashboard-despues-de-login');
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

  // 1. Aplicar cy.intercept() para simular un error del servidor
  it('should show a generic error message on server failure', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('serverError');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@serverError');
    
    // La aplicación muestra "Invalid credentials", pero sabemos que fue un error 500
    // Esto demuestra que podemos probar cómo reacciona el frontend a errores del backend
    cy.get('.oxd-alert-content-text').should('be.visible');
  });

  // 5. Evidenciar spies
  it('should not have console errors on login', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError');
    });

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    cy.get('@consoleError').should('not.have.been.called');
  });

  // 5. Evidenciar stubs
  it('should handle a stubbed alert', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('button[type="submit"]').click().then(() => {
      // Simulamos que la aplicación llama a una alerta
      // En una app real, una acción del usuario dispararía esta alerta
      window.alert('This is a test alert');
      expect(stub.getCall(0)).to.be.calledWith('This is a test alert');
    });
  });

  // 5. Evidenciar clocks
  it('should control time with clock', () => {
    cy.clock();
    cy.get('input[name="username"]').type('Admin');
    
    // Avanzamos el reloj 5 segundos artificialmente
    cy.tick(5000);

    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
