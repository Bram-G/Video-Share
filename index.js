const express = require("express");
const app = express();
const server = require('http').Server(app)
// const socket = require("socket.io");
const io = require('socket.io')(server)
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const {v4:uuidV4} = require('uuid');

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({});
app.use(express.static("public"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", allRoutes);

io.on('connection',(socket) => {
    socket.on('join-room',(roomId,userId) =>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', ()=>{
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})



sequelize.sync({ force: true }).then(function() {
    server.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});
