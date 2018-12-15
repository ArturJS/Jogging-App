import { BasePage } from './base.page';

export class SignUpPage extends BasePage {
    signIn({ email, password }) {
        cy.get('.login-form [name="authEmail"]').type(email);
        cy.get('.login-form [name="authPassword"]').type(password);
        cy.get('.login-form button[type="submit"]').click();
    }
}
