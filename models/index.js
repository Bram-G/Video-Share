const User = require("./User");
const Room = require("./Room");

Room.belongsTo(User, {
    through: "hostUserId",
    as: "Host"
})

Room.hasMany(User);

User.belongsTo(Room, {
    through: "hostUserId",
    as: "Participant"
})

module.exports = {
    Room, User
};