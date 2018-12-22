import { RecordsPage } from '../../support/page-objects/records.page';

context('Records', () => {
    const recordsPage = new RecordsPage();

    beforeEach(() => {
        recordsPage.resetDatabase({
            query: `
            mutation {
                resetAll(allData: {
                    users: [
                        {
                            firstName: "e2e_name", 
                            lastName: "e2e_lastname", 
                            email: "e2e-test@user.com", 
                            password: "e2e123456", 
                            records: []
                        }
                    ]
                })
            }
            `
        });
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
});
