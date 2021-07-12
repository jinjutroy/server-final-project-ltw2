
const Utils = require("../utils/utils");
module.exports = (sequelize, Datatypes) => {
  const Movie = sequelize.define("Movie", {
    name: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    image: {
      type: Datatypes.BLOB,
      allowNull: false,
    },
    trailer: {
      type: Datatypes.STRING,
      allowNull: true,
    },
    introduce: {
      type: Datatypes.TEXT,
      allowNull: true,
    },
    opening_day: {
      type: Datatypes.DATE,
      allowNull: true,
      get: function () {
        return Utils.formatDate(this.getDataValue('opening_day'))
      }
    },
    minute_time: {
      type: Datatypes.INTEGER,
      allowNull: true
    },
    view: {
      type: Datatypes.INTEGER,
      allowNull: true,
    }
  })
  Movie.associate = function (models) {
    Movie.hasMany(models.Showtime, {
      foreignKey: 'movie_id'
    });
  };
  return Movie;
};
