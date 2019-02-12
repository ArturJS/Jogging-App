import 'reflect-metadata';
import { AuthDI, AUTH_DI_TYPES } from '../modules/auth/auth.di';
import {
    E2ETestsDI,
    E2E_TESTS_DI_TYPES
} from '../modules/e2e-tests/e2e-tests.di';
import { RecordsDI, RECORDS_DI_TYPES } from '../modules/records/records.di';
import { ReportsDI, REPORTS_DI_TYPES } from '../modules/reports/reports.di';
import { createDIContainer } from './create-di-container';

const diContainer = createDIContainer({
    modules: [AuthDI, E2ETestsDI, RecordsDI, ReportsDI]
});

export const baseDIContainer = {
    getAuthService() {
        return diContainer.get(AUTH_DI_TYPES.AuthBLL);
    },

    getE2ETestsService() {
        return diContainer.get(E2E_TESTS_DI_TYPES.E2ETestsBLL);
    },

    getRecordsService() {
        return diContainer.get(RECORDS_DI_TYPES.RecordsBLL);
    },

    getReportsService() {
        return diContainer.get(REPORTS_DI_TYPES.ReportsBLL);
    }
};
