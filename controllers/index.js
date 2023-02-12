const express = require('express');
const router = express.Router();

const userRoutes = require('./userController.js');
router.use("/user",userRoutes)

const roomRoutes = require('./roomController.js');
router.use("/room",roomRoutes)

const frontEndRoutes = require('./frontEndController');
router.use("/",frontEndRoutes);

module.exports = router;