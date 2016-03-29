'use strict';

module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    room: DataTypes.STRING,
    user: DataTypes.STRING,
    text: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return message;
};
