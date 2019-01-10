import { RecordsPage } from '../../support/page-objects/records.page';

context('Records', () => {
    const recordsPage = new RecordsPage();

    beforeEach(() => {
        recordsPage.resetDatabase({ records: [] });
        recordsPage.signInViaNetwork({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });
    });

    it('should redirect to /records page if already authorized', () => {
        cy.visit('/sign-up');
        cy.location('pathname').should('eq', '/records');
        cy.title().should('eq', 'Jogging App: Records');
    });

    it('should display no records placeholder', () => {
        cy.visit('/records');
        cy.get('.no-records-placeholder').should('be.visible');
    });

    it('should add record', () => {
        cy.visit('/records');

        recordsPage.addRecord({
            date: '22.12.2018',
            distance: '1500',
            time: '00:03:00'
        });

        recordsPage.checkTableRow({
            index: 'last',
            cells: ['22.12.2018', '1500', '00:03:00', '30.00']
        });
    });

    it('should edit record', () => {
        const initialRecord = {
            date: 1520971200000, // 14.03.2018
            distance: 5000,
            time: 2460
        };

        recordsPage.resetDatabase({ records: [initialRecord] });
        recordsPage.signInViaNetwork({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });

        cy.visit('/records');

        recordsPage.checkTableRow({
            index: 1,
            cells: ['14.03.2018', '5000', '00:41:00', '7.32']
        });

        recordsPage.editRecord({
            index: 1,
            payload: {
                date: '22.12.2018',
                distance: '1500',
                time: '00:03:00'
            }
        });

        recordsPage.checkTableRow({
            index: 1,
            cells: ['22.12.2018', '1500', '00:03:00', '30.00']
        });
    });

    it('should remove record', () => {
        const initialRecord = {
            date: 1520971200000, // 14.03.2018
            distance: 5000,
            time: 2460
        };

        recordsPage.resetDatabase({ records: [initialRecord] });
        recordsPage.signInViaNetwork({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });

        cy.visit('/records');

        recordsPage.removeRecordByIndex(1);

        cy.get('.no-records-placeholder').should('be.visible');
    });
});
