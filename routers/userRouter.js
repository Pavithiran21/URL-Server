const express = require('express');

const User = require('../Models/userModel');
var bcrypt = require('bcryptjs') 
var salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
const router = express.Router();
var handlebars = require('handlebars');
var fs = require('fs');
var UserController=require('../controllers/users')
var jwt=require('jsonwebtoken')
 
router.get('/reset-password/:id',async function(req,res){
 
  UserController.handlers.checkUser(req,res)
})
router.get('/checkid/:id',async function(req,res){
  UserController.handlers.checkId(req,res)
})
router.post('/forget-password',async function(req,res){
  UserController.handlers.forgetPassword(req,res)
})
router.get('/activation/:id',function(req,res){
  UserController.handlers.checkActivateAccount(req,res)
})
router.post('/activate/account',function(req,res){
  UserController.handlers.ActivateAccount(req,res)
})


router.post('/register',async function(req,res){
  UserController.handlers.register(req,res)
})

router.post('/login',async (req,res) => {
  UserController.handlers.login(req,res)
});


module.exports = router;