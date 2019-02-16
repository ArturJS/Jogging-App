import { createDIModule } from '../../di/create-di-module';
import { RECORDS_DI_TYPES } from '../records/records.di';
import { ReportsBLL } from './reports.bll';

export const REPORTS_DI_TYPES = {
    ReportsBLL: Symbol('ReportsBLL')
};

export const ReportsDI = createDIModule({
    providers: [
        {
            type: REPORTS_DI_TYPES.ReportsBLL,
            useClass: ReportsBLL,
            dependencies: [RECORDS_DI_TYPES.RecordsBLL]
        }
    ]
});
