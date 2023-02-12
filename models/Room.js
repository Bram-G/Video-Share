const {Model, DataTypes} = require('sequelize');
const sequelize = require("../config/connection");

class Room extends Model {}

Room.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    hostUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize
});

module.exports = Room;