import db from '../../models';

const e2eTestsDAL = {
    async dropAll() {
        const tableNames = Object.values(db.sequelize.models).map(
            ({ tableName }) => `public."${tableName}"`
        );

        await db.sequelize.query(`TRUNCATE TABLE ${tableNames.join(', ')}`);
    }
};

export default e2eTestsDAL;
