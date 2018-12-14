export class BasePage {
    resetDatabase() {
        cy.fixture('reset-all').then(resetAllPayload => {
            cy.request({
                method: 'POST',
                url: '/graphql',
                body: resetAllPayload
            });
        });
    }
}
