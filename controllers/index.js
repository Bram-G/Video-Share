const express = require('express');
const router = express.Router();

router.get("/",(req,res) => {
    res.render('home')
})

router.get('/signup',(req,res) => {
    res.render('signup')
})

router.get('/login', (req, res) => {
    if (!req.session.user) {
        return res.render('login');
    } else {
        req.session.destroy();
        res.send(`
        <script>
          alert("You have logged out!");
          window.location.href = "/";
        </script>
      `)
    };

});
const userRoutes = require('./userController.js');
router.use("/user",userRoutes)

const roomRoutes = require('./roomController.js');
router.use("/room",roomRoutes)

module.exports = router;