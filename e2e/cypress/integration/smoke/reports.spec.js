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
});
