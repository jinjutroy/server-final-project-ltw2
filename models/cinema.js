module.exports = (sequelize, Datatypes) => {

const Cinema = sequelize.define("Cinema", {
  name: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  address: {
    type: Datatypes.TEXT,
    allowNull: true
  }
});
Cinema.associate = function (models) {
  Cinema.hasMany(models.Theater, {
    foreignKey: 'cinema_id',
    sourceKey: 'id',
    as: 'theaters'
  });
};
return Cinema;
}


