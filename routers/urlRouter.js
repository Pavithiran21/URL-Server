const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const Url = require("../Models/urlModel");
const router = express.Router()
var UrlController=require('../controllers/url-shortner')
var jwt=require('jsonwebtoken')
const sessionCheck=(req,res,next)=>{
  let token=req.headers.token || req.body.token
  if(token)
  {
    try{
      var decoded = jwt.verify(token,  process.env.JWT_TOKEN);
      console.log(decoded)
      req.user=decoded
      next()
      
    }
    catch(ex){
      console.log(ex)
       res.status(401).json({status:false,message:"Invalidd token"})
    }
    
  }
  else{
    res.status(403).json({status:false,message:"Need Token"})
  }
  
}

router.post("/shorten-url", sessionCheck,async (req, res) => {
  UrlController.handlers.shortenURL(req,res)
});


router.get("/list", sessionCheck,async (req, res) => {
   UrlController.handlers.listURL(req,res)
});

router.get("/dashboard",sessionCheck, async (req, res) => {
   UrlController.handlers.getURLCount(req,res)
});

router.get("/:shortUrl", async (req, res) => {
  UrlController.handlers.redirectURL(req,res)
    
});
router.post("/delete/", sessionCheck,async (req, res) => {
  UrlController.handlers.deleteURL(req,res)
    
});
router.post("/update/", sessionCheck,async (req, res) => {
 
  UrlController.handlers.updateURL(req,res)
    
});
module.exports = router;
  
