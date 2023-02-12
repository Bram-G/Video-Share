const express = require("express");
const app = express();
const server = require('http').Server(app)
// const socket = require("socket.io");
const io = require('socket.io')(server)
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const {v4:uuidV4} = require('uuid');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const PORT = process.env.PORT || 3000;
const users = {}
const hbs = exphbs.create({});
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", allRoutes);

io.on('connection',(socket) => {
    socket.on('join-room',(roomId,userId) =>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', ()=>{
            userName = users[socket.id] 
            socket.to(roomId).emit('user-disconnected', userName)
            delete users[socket.id]
        })
    })
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message', {message: message, name:users[socket.id] })
    })
    socket.on('new-user',userId =>{
        users[socket.id] = userId
        socket.broadcast.emit('user-connected',userId)
    })
})



sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});
