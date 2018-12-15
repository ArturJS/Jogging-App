import { SignUpPage } from '../../support/page-objects/sign-up.page';

context('Login', () => {
    const signUpPage = new SignUpPage();

    beforeEach(() => {
        signUpPage.resetDatabase();
    });

    it('should render sign-up page', () => {
        cy.visit('/sign-up');
        cy.title().should('eq', 'Jogging App: Create an account');
    });

    it('should redirect to /records page after login', () => {
        signUpPage.signIn({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });

        cy.title().should('eq', 'Jogging App: Records');
    });
});
