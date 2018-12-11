import config from '../../config';
import createAllPayload from '../../fixtures/create-all';
import dropAllPayload from '../../fixtures/drop-all';

// todo load fixtures correctly

// todo create page objects

const { baseUrl, baseApiUrl, requestTimeout, visitTimeout } = config;

context('Login', () => {
    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: baseApiUrl,
            body: dropAllPayload,
            timeout: requestTimeout
        });
        cy.request({
            method: 'POST',
            url: baseApiUrl,
            body: createAllPayload,
            timeout: requestTimeout
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
