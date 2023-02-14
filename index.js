const express = require("express");
const app = express();
const http = require("http");
const socket = require("socket.io");
const server = http.createServer(app)

const io = require('socket.io')(server)
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const {v4:uuidV4} = require('uuid');
var bodyParser = require('body-parser')

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const PORT = process.env.PORT || 3000;


const users = {}


io.on('connection',(socket) => {
    socket.on('join-room',(roomId,userId) =>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', ()=>{
            userName = users[socket.id] 
            socket.to(roomId).emit('user-disconnected', userName)
            delete users[socket.id]
            console.log(users)
        })
    })
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message', {message: message, name:users[socket.id] })
    })
    socket.on('new-user',userId =>{
        users[socket.id] = userId
        socket.broadcast.emit('user-connected',userId)
    })
    socket.on('youtube-socket', (youtubeSource) => {
        console.log('inside youtube socket')
        console.log(youtubeSource)
        socket.broadcast.emit('youtube-source-in', youtubeSource)
    } )
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sess = {
    // secret: process.env.SESSION_SECRET,
    secret: "secret",
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));
app.use(express.static("public"));
const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use("/", allRoutes);

sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});
