import { Base, Record, User } from '../../db';

export class E2ETestsDAL {
    async dropAll() {
        const tableNames = [Record, User].map(
            ({ tableName }) => `public."${tableName}"`
        );

        await Base.raw(`TRUNCATE TABLE ${tableNames.join(', ')}`);
    }
}
