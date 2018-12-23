import { BasePage } from './base.page';

export class RecordsPage extends BasePage {
    resetDatabaseAndRecords(records) {
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

    addRecord({ date, distance, time }) {
        cy.get('.records-page .btn-add-record').click();
        this._editRecordForm({ date, distance, time });
    }

    editRecord({ index, payload: { date, distance, time } }) {
        this._getTableRowByIndex(index)
            .find('.btn-edit')
            .click();
        this._editRecordForm({ date, distance, time });
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

    _editRecordForm({ date, distance, time }) {
        cy.get('.edit-record-form input[name="date"]')
            .clear()
            .type(date);
        cy.get('.edit-record-form input[name="distance"]')
            .clear()
            .type(distance);
        cy.get('.edit-record-form input[name="time"]').click();
        cy.get('.rc-time-picker-panel-input')
            .clear()
            .type(time);
        cy.get('.modal-title').click();
        cy.get('.edit-record-form button[type="submit"]').click();
    }
}
