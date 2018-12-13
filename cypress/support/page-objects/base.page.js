import config from '../../config';

const { baseApiUrl, requestTimeout } = config;

export class BasePage {
    resetDatabase() {
        cy.fixture('reset-all').then(resetAllPayload => {
            cy.request({
                method: 'POST',
                url: baseApiUrl,
                body: resetAllPayload,
                timeout: requestTimeout
            });
        });
    }
}
