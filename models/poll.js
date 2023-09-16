'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Poll.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creator_id',
      });

      Poll.hasMany(models.Option, {
        as: 'options',
        foreignKey: 'poll_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Poll.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title is required."
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published', 'Closed'),
      allowNull: false,
      defaultValue: 'Draft',
      validate: {
        notNull: {
          msg: "Status is required."
        },
        isIn: { 
          args: [['Draft', 'Published', 'Closed']],
          msg: "Status is not a valid value."
        }
      },
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'User', key: 'id' },
      validate: {
        notNull: {
          msg: "Creator is required."
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Poll',
    defaultScope: {
      order: [['createdAt', 'ASC']]
    },
  });
  return Poll;
};