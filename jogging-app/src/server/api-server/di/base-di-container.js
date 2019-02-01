import 'reflect-metadata';
import { AuthDI, DI_TYPES as AUTH_DI_TYPES } from '../modules/auth/auth.di';
import {
    E2ETestsDI,
    DI_TYPES as E2E_TESTS_DI_TYPES
} from '../modules/e2e-tests/e2e-tests.di';
import {
    RecordsDI,
    DI_TYPES as RECORDS_DI_TYPES
} from '../modules/records/records.di';
import {
    ReportsDI,
    DI_TYPES as REPORTS_DI_TYPES
} from '../modules/reports/reports.di';
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
