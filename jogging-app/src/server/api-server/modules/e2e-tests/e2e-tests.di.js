import { createDIModule } from '../../di/create-di-module';
import { DI_TYPES as AUTH_DI_TYPES } from '../auth/auth.di';
import { DI_TYPES as RECORDS_DI_TYPES } from '../records/records.di';
import { E2ETestsDAL } from './e2e-tests.dal';
import { E2ETestsBLL } from './e2e-tests.bll';

const PRIVATE_DI_TYPES = {
    E2ETestsDAL: Symbol('E2ETestsDAL')
};

export const DI_TYPES = {
    E2ETestsBLL: Symbol('E2ETestsBLL')
};

export const E2ETestsDI = createDIModule({
    providers: [
        {
            type: PRIVATE_DI_TYPES.E2ETestsDAL,
            useClass: E2ETestsDAL
        },
        {
            type: DI_TYPES.E2ETestsBLL,
            useClass: E2ETestsBLL,
            dependencies: [
                PRIVATE_DI_TYPES.E2ETestsDAL,
                AUTH_DI_TYPES.AuthBLL,
                RECORDS_DI_TYPES.RecordsBLL
            ]
        }
    ]
});
