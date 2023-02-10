const express = require("express");
const router = express.Router();
const app = express();
// const {User,Room} = require('../models');
const server = require("http").Server(app);
const {v4:uuidV4} = require('uuid');
const io = require("socket.io")(server);
const session = require("express-session");
const exphbs = require("express-handlebars");


router.get("/", (req,res)=> {
    res.redirect(`/room/${uuidV4()}`)
    console.log("connected to /rooms")
})

router.get("/:room", (req,res)=> {
    res.render('home',{ roomId: req.params.room})
})

io.on('connection',socket => {
    socket.on('join-room',(roomId,userId) =>{
        console.log(roomId,userId)
    })
})

module.exports = router;