import { SignUpPage } from '../../support/page-objects/sign-up.page';

context('Sign Up', () => {
    const signUpPage = new SignUpPage();

    beforeEach(() => {
        signUpPage.resetDatabase();
    });

    it('should render sign-up page', () => {
        cy.visit('/sign-up');
        cy.title().should('eq', 'Jogging App: Create an account');
    });

    it('should redirect to /records page after sign up', () => {
        signUpPage.signUp({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john-doe@email.com',
            password: 'qwe123456',
            repeatPassword: 'qwe123456'
        });

        cy.title().should('eq', 'Jogging App: Records');
    });
});
