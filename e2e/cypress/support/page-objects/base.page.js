export class BasePage {
    resetDatabase({ records = [] } = {}) {
        // graphql doesn't allow double quotes around object property names
        const recordsPayload = JSON.stringify(records).replace(/"/g, '');

        cy.request({
            method: 'POST',
            url: '/graphql',
            body: {
                operationName: null,
                variables: {},
                query: `
                    mutation {
                        resetAll(allData: {
                            users: [
                                {
                                    firstName: "e2e_name", 
                                    lastName: "e2e_lastname", 
                                    email: "e2e-test@user.com", 
                                    password: "e2e123456", 
                                    records: ${recordsPayload}
                                }
                            ]
                        })
                    }
                `
            }
        });
    }

    signIn() {
        // todo and use instead of `signInViaNetwork`
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
