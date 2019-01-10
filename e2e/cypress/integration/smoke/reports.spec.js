import { ReportsPage } from '../../support/page-objects/reports.page';

context('Reports', () => {
    const reportsPage = new ReportsPage();
    const resetDbAndSignIn = ({ records }) => {
        reportsPage.resetDatabase({ records });
        reportsPage.signInViaNetwork({
            email: 'e2e-test@user.com',
            password: 'e2e123456'
        });
    };

    it('should display empty placeholders', () => {
        resetDbAndSignIn({
            records: []
        });

        cy.visit('/records');
        cy.get('.no-records-placeholder').should('be.visible');

        cy.visit('/reports');
        cy.get('.no-reports-placeholder').should('be.visible');
    });

    it('should display reports', () => {
        resetDbAndSignIn({
            records: [
                {
                    date: 1520971200000, // 14.03.2018
                    distance: 5000,
                    time: 2460
                },
                {
                    date: 1547064000000, // 10.01.2019
                    distance: 1234,
                    time: 36064
                }
            ]
        });

        cy.visit('/reports');

        reportsPage.checkTableRow({
            index: 1,
            cells: ['1', '5000.00', '7.32']
        });

        reportsPage.checkTableRow({
            index: 2,
            cells: ['45', '1234.00', '0.12']
        });
    });
});
