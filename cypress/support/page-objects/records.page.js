import { BasePage } from './base.page';

export class RecordsPage extends BasePage {
    addRecord({ date, distance, time }) {
        cy.get('.records-page .btn-add-record').click();
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

    checkTableRow({ index, cells }) {
        const indexSelector =
            index === 'last' ? ':last-child' : `:nth-child(${index})`;
        const rowSelector = `.rt-tbody .rt-tr-group${indexSelector}`;

        cells.forEach((cellText, cellIndex) => {
            const cellSelector = `.rt-td:nth-child(${cellIndex + 1})`;

            cy.get(rowSelector)
                .find(cellSelector)
                .invoke('text')
                .should('eq', cellText);
        });
    }
}
