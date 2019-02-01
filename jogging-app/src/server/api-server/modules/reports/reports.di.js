import { createDIModule } from '../../di/create-di-module';
import { DI_TYPES as RECORDS_DI_TYPES } from '../records/records.di';
import { ReportsBLL } from './reports.bll';

export const DI_TYPES = {
    ReportsBLL: Symbol('ReportsBLL')
};

export const ReportsDI = createDIModule({
    providers: [
        {
            type: DI_TYPES.ReportsBLL,
            useClass: ReportsBLL,
            dependencies: [RECORDS_DI_TYPES.RecordsBLL]
        }
    ]
});
