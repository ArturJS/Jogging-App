import createAllPayload from '../../fixtures/create-all';
import dropAllPayload from '../../fixtures/drop-all';

const defaultTimeout = 30000;
const requestTimeout = defaultTimeout;
const visitTimeout = defaultTimeout;

context('Login', () => {
    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/graphql',
            body: dropAllPayload,
            timeout: requestTimeout
        });
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/graphql',
            body: createAllPayload,
            timeout: requestTimeout
        });
    });

    it('should render sign-up page', () => {
        cy.visit('http://localhost:3000/sign-up');
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
