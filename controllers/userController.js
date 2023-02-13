const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");

router.get("/",(req,res)=>{
    User.findAll().then(userData=>{
     res.json(userData)
    }).catch(err=>{
     console.log(err);
     res.status(500).json(err)
    })
 })

 router.get("/logout", (req, res) => {
   req.session.destroy();
   res.redirect("/");
 })
 
 router.get('/login', (req, res) => {
    if (!req.session.user) {
        return res.render('login');
    } else {
        return res.render('home');
    };
 
 });
 router.get("/:id",(req,res)=>{
    User.findByPk(req.params.id,{
     include:[Room]
    }).then(userData=>{
     res.json(userData)
    }).catch(err=>{
     console.log(err);
     res.status(500).json(err)
    })
 })
 router.post("/",(req,res)=>{
   console.log(req.body);
  User.create({
   name:req.body.name,
   email:req.body.email,
   password:req.body.password
  }).then(userData=>{
   req.session.user = {
      id: userData.id,
      name: userData.name,
      email:userData.email
   };
   res.json(userData)
  }).catch(err=>{
   console.log(err);
   res.status(500).json({msg:"oh noes!",err})
  })
})
router.post("/login", (req, res) => {
   User.findOne({
      where:{
         email:req.body.email
      }
   }).then(userData => {
      if(!userData) {
         return res.status(401).json({msge:"Incorrect email or password."})
      } else {
         if(bcrypt.compareSync(req.body.password, userData.password)) {
            req.session.user = {
               id: userData.id,
               name: userData.name,
               email: userData.email
            }
            return res.json(userData)
         } else {
            return res.status(401).json({msg:"Incorrect email or password." })
         }
      }
   }).catch(err => {
      console.log(err);
      res.status(500).json(err);
   })
})

module.exports = router;