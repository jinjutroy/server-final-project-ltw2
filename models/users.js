var DataTypes = require('sequelize/lib/data-types');

module.exports = (sequelize, Datatypes) => {
  
const User = sequelize.define('User', {
    // Model attributes are defined here
    email: { 
      type: Datatypes.STRING(150),
      allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    googleId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    facebookId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fullname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    numphone:{
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });
    User.associate = models => {
      User.hasMany(models.Booking, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'booking'
      });
    };

    User.findByGoogleId = async function(googleId){
      return User.findOne({
          where:{
                googleId,
            },
        }); 
      };
    User.findByEmail = async function(email){
    return User.findOne({
        where:{
              email,
          },
      }); 
    };

    User.findById = async function(id){
        return User.findByPk(id);
    };

return User;
};



