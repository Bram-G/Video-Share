const User = require("./User");
const Room = require("./Room");

Room.belongsTo(User, {
    foreignKey: "hostUserId",
})

Room.hasMany(User);

User.belongsTo(Room)

module.exports = {
    Room, User
};