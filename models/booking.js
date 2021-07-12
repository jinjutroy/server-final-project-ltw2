module.exports = (sequelize, Datatypes) => {
  var Booking = sequelize.define("Booking", {
    id: {
      primaryKey: true,
      type: Datatypes.UUID,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: Datatypes.INTEGER,
      allowNull: false
    },
    showtime_id: {
      type: Datatypes.INTEGER,
      allowNull: false
    },
    bookingtime: {
      type: Datatypes.STRING,
      allowNull: false
    },
    totalprice: {
      type: Datatypes.INTEGER,
      allowNull: false
    },
  });

  Booking.associate = function (models) {
    Booking.belongsTo(models.Showtime, {
      foreignKey: 'showtime_id',
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      as: "showtime"
    });
  
    Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      as: 'user'
    });

    Booking.hasMany(models.Ticket, {
      foreignKey: 'booking_id',
      sourceKey: 'id',
      as: 'tickets'
    });
  }

  return Booking;
}
