import db from '../../models';

export class E2ETestsDAL {
    async dropAll() {
        const tableNames = Object.values(db.sequelize.models).map(
            ({ tableName }) => `public."${tableName}"`
        );

        await db.sequelize.query(`TRUNCATE TABLE ${tableNames.join(', ')}`);
    }
}
