const User = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Record, {
      foreignKey: 'userId',
      as: 'recordsList',
    });
  };

  User.validPassword = (password, userPassword, done, user) => { // todo use encryption
    if (password === userPassword) {
      done(null, user);
    }
    else {
      done('Wrong email or password', null);
    }
  };

  return User;
};

module.exports = User;
