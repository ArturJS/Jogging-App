const RecordModel = (sequelize, DataTypes) => {
    const Record = sequelize.define('Record', {
        date: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        distance: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        averageSpeed: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    Record.associate = models => {
        Record.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return Record;
};

module.exports = RecordModel;
