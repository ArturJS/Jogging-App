import { createDIModule } from '../../di/create-di-module';
import { RecordsDAL } from './records.dal';
import { RecordsBLL } from './records.bll';

const PRIVATE_DI_TYPES = {
    RecordsDAL: Symbol('RecordsDAL')
};

export const DI_TYPES = {
    RecordsBLL: Symbol('RecordsBLL')
};

export const RecordsDI = createDIModule({
    providers: [
        {
            type: PRIVATE_DI_TYPES.RecordsDAL,
            useClass: RecordsDAL
        },
        {
            type: DI_TYPES.RecordsBLL,
            useClass: RecordsBLL,
            dependencies: [PRIVATE_DI_TYPES.RecordsDAL]
        }
    ]
});
