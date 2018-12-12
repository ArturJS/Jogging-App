import config from '../../config';

// todo create page objects

const { baseUrl, baseApiUrl, requestTimeout, visitTimeout } = config;

context('Login', () => {
    beforeEach(() => {
        cy.fixture('reset-all').then(resetAllPayload => {
            cy.request({
                method: 'POST',
                url: baseApiUrl,
                body: resetAllPayload,
                timeout: requestTimeout
            });
        });
    });

    it('should render sign-up page', () => {
        cy.visit(`${baseUrl}/sign-up`);
        cy.title().should('eq', 'Jogging App: Create an account');
    });

    it('should redirect to /records page after login', () => {
        cy.get('.login-form [name="authEmail"]').type('e2e-test@user.com');
        cy.get('.login-form [name="authPassword"]').type('e2e123456');
        cy.get('.login-form button[type="submit"]').click();
        cy.wait(5000);
        cy.title().should('eq', 'Jogging App: Records');
    });
});
