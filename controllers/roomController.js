const express = require("express");
const router = express.Router();
// const app = express();
// const {User,Room} = require('../models');
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
const {v4:uuidV4} = require('uuid');
const session = require("express-session");
const exphbs = require("express-handlebars");


router.get("/", (req,res)=> {
    if (!req.session.user) {
        return res.render('login');
    } else {
        res.redirect(`/room/${uuidV4()}`)
    console.log("connected to /rooms")
    }

})

router.get("/:room", (req,res)=> {
    if (!req.session.user) {
        return res.redirect('/login');
    } else {
    res.render('room',{ roomId: req.params.room})
}
})



module.exports = router;