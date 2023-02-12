const sequelize = require("../config/connection");
const {User, Room} = require("../models");

const seed = async () => {
    await sequelize.sync({force: true});
    const users = await User.bulkCreate([
        {
            name:"Binh",
            email: "binh@binh.binh",
            password: "password",
        },
        {
            name:"Bret",
            email: "bret@bret.bret",
            password: "password",
        },
        {
            name:"Brady",
            email: "brady@brady.brady",
            password: "password",
        },
        {
            name:"Bram",
            email: "bram@bram.bram",
            password: "password",
        }
    ],{
        individualHooks: true
    })
}