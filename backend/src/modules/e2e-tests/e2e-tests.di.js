import { createDIModule } from 'di-utils';
import { AUTH_DI_TYPES } from '../auth/auth.di';
import { RECORDS_DI_TYPES } from '../records/records.di';
import { E2ETestsDAL } from './e2e-tests.dal';
import { E2ETestsBLL } from './e2e-tests.bll';

const PRIVATE_DI_TYPES = {
    E2ETestsDAL: Symbol('E2ETestsDAL')
};

export const E2E_TESTS_DI_TYPES = {
    E2ETestsBLL: Symbol('E2ETestsBLL')
};

export const E2ETestsDI = createDIModule({
    providers: [
        {
            type: PRIVATE_DI_TYPES.E2ETestsDAL,
            useClass: E2ETestsDAL
        },
        {
            type: E2E_TESTS_DI_TYPES.E2ETestsBLL,
            useClass: E2ETestsBLL,
            dependencies: [
                PRIVATE_DI_TYPES.E2ETestsDAL,
                AUTH_DI_TYPES.AuthBLL,
                RECORDS_DI_TYPES.RecordsBLL
            ]
        }
    ]
});
