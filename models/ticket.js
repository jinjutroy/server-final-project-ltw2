module.exports = (sequelize, Datatypes) => {
//Vé
const Ticket = sequelize.define("Ticket", {
  id: {
    primaryKey: true,
    type: Datatypes.UUID,
    allowNull: false,
    unique: true,
    defaultValue: sequelize.literal('gen_random_uuid()')
  },
  booking_id: {
    type: Datatypes.UUID,
    allowNull: true,
  },
  chair_id: {
    type: Datatypes.STRING,
    allowNull: true,
    unique: false
  },
  address_x: {
    type: Datatypes.STRING,
    allowNull: false
  },
  address_y: {
    type: Datatypes.STRING,
    allowNull: false
  },
  price: {
    type: Datatypes.INTEGER,
    allowNull: false
  }

});
Ticket.associate = function (models) {
  Ticket.belongsTo(models.Booking, {
    foreignKey: 'booking_id',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'booking'
  });
}
return Ticket;
};
