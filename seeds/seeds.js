const sequelize = require('../config/connection.js');
const User = require('../models/userModel.js');

// create user data
const users = [];

async function seed(){
    await sequelize.sync({force:true});
    await User.bulkCreate(users, {individualHooks: true});
    process.exit(0);
};
seed();