const express = require("express");
const app = express();
const server = require("http").Server(app);

const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const {v4:uuidV4} = require('uuid');
const io = require("socket.io")(server);

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(allRoutes);



app.use(express.static("public"));

sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});