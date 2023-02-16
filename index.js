const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app)

const io = socketIo(server)
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const {v4:uuidV4} = require('uuid');


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
        socket.on('send-chat-message', message =>{
            socket.broadcast.to(roomId).emit('chat-message', {message: message, name:users[socket.id] })
        })
        socket.on('new-user',userId =>{
            users[socket.id] = userId
            socket.broadcast.emit('user-connected',userId)
        })
        socket.on('youtube-socket', (youtubeSource) => {
            console.log('inside youtube socket')
            console.log(youtubeSource)
            io.to(roomId).emit('youtube-source-in', youtubeSource)
        })
    })
        socket.on('screenshare-socket', (videoElemGrid) => {
            io.to(roomId).emit('screenshare-source-in', videoElemGrid)
        })
    
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sess = {
    secret: process.env.SESSION_SECRET,
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
