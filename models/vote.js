'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.belongsTo(models.Option, {
        as: 'option',
        foreignKey: 'option_id',
      });

      Vote.belongsTo(models.User, {
        as: 'voter',
        foreignKey: 'voter_id',
      });
    }
  }
  Vote.init({
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Option', key: 'id' },
      validate: {
        notNull: {
          msg: "Option is required."
        }
      }
    },
    voter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'User', key: 'id' },
      validate: {
        notNull: {
          msg: "Voter is required."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Vote',
    defaultScope: {
      order: [['createdAt', 'ASC']]
    },
  });
  return Vote;
};