'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.belongsTo(models.Poll, {
        as: 'poll',
        foreignKey: 'poll_id',
      });

      Option.hasMany(models.Vote, {
        as: 'votes',
        foreignKey: 'option_id',
        onDelete: 'RESTRICT',
      });
    }
  }
  Option.init({
    option_text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Option text is required."
        },
      }
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Poll', key: 'id' },
      validate: {
        notNull: {
          msg: "Poll is required."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Option',
    defaultScope: {
      order: [['createdAt', 'ASC']]
    },
  });
  return Option;
};