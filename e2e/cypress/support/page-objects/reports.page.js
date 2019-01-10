import { BasePage } from './base.page';

export class ReportsPage extends BasePage {
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
