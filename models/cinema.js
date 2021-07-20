module.exports = (sequelize, Datatypes) => {

  const Cinema = sequelize.define("Cinema", {
    name: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: Datatypes.STRING,
      allowNull: true
    }
  });
  Cinema.associate = function (models) { 
    Cinema.hasMany(models.Theater, {
      foreignKey: 'cinema_id',
      sourceKey: 'id',
      as: 'theater'
    });
  };
  Cinema.findById = async function (id) {
    return Cinema.findByPk(id);
  };
  return Cinema;
}


