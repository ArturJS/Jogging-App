import { BasePage } from './base.page';

export class RecordsPage extends BasePage {
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

    removeRecordByIndex(index) {
        this._getTableRowByIndex(index)
            .find('.btn-remove')
            .click();

        cy.get('.modal-content')
            .find('.btn-ok')
            .click();
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
