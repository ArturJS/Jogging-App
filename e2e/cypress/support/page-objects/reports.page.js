import { BasePage } from './base.page';

export class ReportsPage extends BasePage {
    resetDatabase({ records }) {
        // graphql doesn't allow double quotes around object property names
        const recordsPayload = JSON.stringify(records).replace(/"/g, '');

        super.resetDatabase({
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
        });
    }

    checkTableRow({ index, cells }) {
        cells.forEach((cellText, cellIndex) => {
            const cellSelector = `.rt-td:nth-child(${cellIndex + 1})`;

            this._getTableRowByIndex(index)
                .find(cellSelector)
                .invoke('text')
                .should('eq', cellText);
        });
    }

    _getTableRowByIndex(index) {
        const indexSelector =
            index === 'last' ? ':last-child' : `:nth-child(${index})`;
        const rowSelector = `.rt-tbody .rt-tr-group${indexSelector}`;

        return cy.get(rowSelector);
    }
}
