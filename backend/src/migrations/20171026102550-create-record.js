module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('Records', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            distance: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            time: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            averageSpeed: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),
    down: (queryInterface /* , Sequelize */) => {
        queryInterface.dropTable('Records');
    }
};
