'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Poll, {
        as: 'polls',
        foreignKey: 'creator_id',
        onDelete: 'RESTRICT',
      });
      
      User.hasMany(models.Vote, {
        as: 'votes',
        foreignKey: 'voter_id',
        onDelete: 'RESTRICT',
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Username already in use.'
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is required."
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email address already in use.'
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required."
        },
        isEmail: {
          msg: "Email must be given in the correct format."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required."
        },
      }
  },
    role: {
      type: DataTypes.ENUM('Voter', 'Editor', 'Admin'),
      allowNull: false, 
      defaultValue: 'Voter',
      validate: {
        notNull: {
          msg: "Role is required."
        },
        isIn: { 
          args: [['Voter', 'Editor', 'Admin']],
          msg: "Role is not a valid value."
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      order: [['createdAt', 'ASC']]
    },
  });
  
  return User;
};