
const Utils = require("../utils/utils");
module.exports = (sequelize, Datatypes) => {
const Showtime = sequelize.define("Showtime", {
    id: {
        type: Datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "id cannot be null" }
        }
    },
    movie_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notNull: { args: true, msg: "theater_id cannot be null" }
        }
    },
    theater_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notNull: { args: true, msg: "theater_id cannot be null" }
        }
    },
    start_time: {
        type: Datatypes.DATE,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "start_time cannot be null" }
        },
        get: function () {
            return Utils.formatDate(this.getDataValue('start_time'))
        }
    },
    end_time: {
        type: Datatypes.DATE,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "end_time cannot be null" }
        },
        get: function () {
            return Utils.formatDate(this.getDataValue('end_time'))
        }
    },
    price: {
        type: Datatypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "price cannot be null" }
        }
    },
})

Showtime.associate = function (models) {
    Showtime.hasMany(models.Booking, {
        foreignKey: 'showtime_id',
        sourceKey: 'id',
        as: 'bookings'
    });

    Showtime.belongsTo(models.Theater, {
        foreignKey: 'theater_id',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: 'theater'
    });

    Showtime.belongsTo(models.Movie, {
        foreignKey: 'movie_id',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: 'movie'
    });
};
return Showtime;
};


