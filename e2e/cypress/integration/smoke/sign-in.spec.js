import { SignUpPage } from '../../support/page-objects/sign-up.page';

context('Sign In', () => {
    const signUpPage = new SignUpPage();

    before(() => {
        signUpPage.resetDatabase();
    });

    it('should render sign-up page', () => {
        cy.visit('/sign-up');
        cy.title().should('eq', 'Jogging App: Create an account');
    });

    it('should redirect to /records page after sign in', () => {
        signUpPage.signIn({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });

        cy.title().should('eq', 'Jogging App: Records');
    });
});
