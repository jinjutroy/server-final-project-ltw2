module.exports = (sequelize, Datatypes) => {
//Rạp chiếu phim
const Theater = sequelize.define("Theater", {
  name: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  cinema_id: {
    type: Datatypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cinemas',
      key: 'id'
    }
  },
  type: {
    type: Datatypes.ENUM,
    values: ['2d', '3d', '4dx'],
    allowNull: false,
    validate: {
      notNull: { args: true, msg: "type cannot be null" }
    },
  },
  number_row: {
    type: Datatypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { args: true, msg: "number_row cannot be null" }
    },
  },
  number_column: {
    type: Datatypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { args: true, msg: "number_column cannot be null" }
    },
  }
});
Theater.associate = function (models) {
  Theater.belongsTo(models.Cinema, {
    foreignKey: 'cinema_id',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'cinema'
  });
  Theater.hasMany(models.Showtime, {
    foreignKey: {name:'theater_id',
                unique:false},
    sourceKey: 'id',
    as: 'showtime'
  });
  
  //Theater.belongsToMany(models.Movie,{through:models.Showtime,foreignKey: 'theater_id'});

  Theater.findById = async function(id){
    return Theater.findByPk(id);
  };
};
return Theater;
};


