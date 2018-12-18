import { BasePage } from './base.page';

export class SignUpPage extends BasePage {
    signIn({ email, password }) {
        cy.get('.login-form [name="authEmail"]').type(email);
        cy.get('.login-form [name="authPassword"]').type(password);
        cy.get('.login-form button[type="submit"]').click();
    }

    signUp({ firstName, lastName, email, password, repeatPassword }) {
        cy.get('.sign-up-form [name="firstName"]').type(firstName);
        cy.get('.sign-up-form [name="lastName"]').type(lastName);
        cy.get('.sign-up-form [name="email"]').type(email);
        cy.get('.sign-up-form [name="password"]').type(password);
        cy.get('.sign-up-form [name="repeatPassword"]').type(repeatPassword);
        cy.get('.sign-up-form button[type="submit"]').click();
    }
}
