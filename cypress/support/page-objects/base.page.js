export class BasePage {
    resetDatabase({ query } = {}) {
        cy.fixture('reset-all').then(resetAllPayload => {
            let body = resetAllPayload;

            if (query) {
                body = {
                    ...body,
                    query
                };
            }

            cy.request({
                method: 'POST',
                url: '/graphql',
                body
            });
        });
    }

    signInViaNetwork({ email, password }) {
        cy.request({
            method: 'POST',
            url: '/graphql',
            body: {
                operationName: null,
                variables: {
                    email,
                    password
                },
                query: `
                    mutation ($email: String!, $password: String!) {
                        signIn(email: $email, password: $password)
                    }
                `
            }
        });
    }
}
