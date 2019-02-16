const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;

const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = models => {
        User.hasMany(models.Record, {
            foreignKey: 'userId',
            as: 'recordsList'
        });
    };

    User.validPassword = (password, userPassword, done, user) => {
        bcrypt.compare(password, userPassword, (err, isMatch) => {
            if (err) {
                throw err;
            }

            if (isMatch) {
                return done(null, user);
            }
            return done('Wrong email or password', false);
        });
    };

    User.beforeCreate(
        user =>
            new Promise((resolve, reject) => {
                const salt = bcrypt.genSalt(
                    SALT_WORK_FACTOR,
                    (err, saltValue) => {
                        if (err) {
                            throw err;
                        }

                        return saltValue;
                    }
                );

                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // eslint-disable-next-line no-param-reassign
                    user.password = hash;
                    resolve(user);
                });
            })
    );

    User.beforeUpdate(
        user =>
            new Promise((resolve, reject) => {
                const salt = bcrypt.genSalt(
                    SALT_WORK_FACTOR,
                    (err, saltValue) => {
                        if (err) {
                            throw err;
                        }

                        return saltValue;
                    }
                );

                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // eslint-disable-next-line no-param-reassign
                    user.password = hash;
                    resolve(user);
                });
            })
    );

    return User;
};

module.exports = UserModel;
