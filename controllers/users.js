const User = require('../Models/userModel');
var bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');
const mailSender = require('./mail.js')
const path=require('path')
var crypto = require('crypto');
var jwt=require('jsonwebtoken')
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};


function sendActivationLink(emailObj){
   try{
       readHTMLFile(emailObj.path,function(err,html){
           var  template=handlebars.compile(html)
            var replacement={
                ACTIVATION_URL:emailObj.link
            }
            delete emailObj.path
            delete emailObj.link
            var htmltoSend=template(replacement)
            emailObj.html=htmltoSend
            mailSender.SendMail(emailObj)
       })
   }
   catch(ex){

   }

}

const UserController = {
    handlers:{
        login:async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await User.findOne({ email: email,isActive:true});
                console.log(user)
                if (user) {
                    if ((await bcrypt.compare(password, user.password))) {
                        const token = jwt.sign(
                            { user_id: user._id, email },
                            process.env.JWT_TOKEN,
                            {
                              expiresIn: "2h",
                            }
                          );
                         
                          console.log(token)
                        res.status(200).json({ status: true, data: user,user_token:token});
                    }
                    else {
                        res.json({ status: false, message: "You have entered an invalid username or password" })
                    }
                }
                else {
                    res.json({ status: false, message: "Your Account is still inactive" })
                }

            } catch (err) {
                console.log(err)
                res.json({ status: false, message: "Something went wrong Please try again later" })
            }
        },
        register:async (req, res) => {
            try {
                let { firstname, lastname, email, password } = req.body
                let users = await User.findOne({ "email": email })
                if (users == null) {
                    user = new User()
                    

                    user.password = await bcrypt.hash(password, salt)
                    user.firstname = firstname
                    user.lastname = lastname
                    user.email = email
                    user.update_ts = Date.now()
                    const buf = await crypto.randomBytes(20); 
                   
                    user.activeToken=buf.toString('hex')
                   console.log(buf)
                  
                    user.activeExpires=Date.now() + 24 * 3600 * 1000;
                    
                    let emailObj = {
                        from: 'Urlshortner@gmail.com',
                        to: user.email,
                        subject: "Thanks for Registering || Activation mail",
                        html: '',
                        link:process.env.BASE_URL+'/activate/'+user.activeToken,
                        path:path.join(__dirname,'../templates/Activation.html')
                    }
                    sendActivationLink(emailObj)
                    user.save()
                    res.json({ status: true, message: "User Registered Successfully",data:user })
                }
                else {
                    res.json({ status: false, message: "Already Registered" })
                }
            } catch (ex) {
                console.log(ex)
                res.json({ status: false, message: "Already Registered" })
                //  res.send("Something went wrong")
            }
        },
        ActivateAccount :async(req,res) => {
            try {
                console.log(req.body)
                console.log(Date.now())
                    let users = await User.findOne({"activeToken": req.body.id,isActive:false})
                    console.log(users)
                    if (users) {
                                
                        users.isActive = true
                        users.activation_id=""
                        users.save()
                        
                        res.json({ status: true, message: "User Activated Successfully" })

                        setTimeout(() => {
                            users.activation_id=""
                            users.save()
                        }, 600000)
                    }
                    else {
                        res.json({ status: false, message: "User Not found" })
                    }
                
            } 
            catch(ex){
                console.log(ex)
                res.json({status:false,message:"Something went wrong"})
            }

        },
        checkActivateAccount:async(req,res)=>{
          try{
                if(req.params.id){
                   
                    let users = await User.findOne({"activeToken": req.params.id,isActive:false })
                    if(users){
                           res.json({status:true,data:users})
                    }
                    else{
                        res.json({ status: false, message: "Invalid link" })
                    }
                }
                else{

                }
          }
          catch(e){
           console.log(e)

          }
        },
        forgetPassword:async (req, res) => {
            try {
                let data = req.body
                console.log(data)
                let users = await User.findOne({ "_id": data.user_id })
                if (users) {
                    users.isActive = false
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        users.password = hash
                        users.update_ts = Date.now()
                        users.save()
                    });
                    res.json({ status: true, message: "Forget Password updated Successfully" })
                }
                else {
                    res.json({ status: false, message: "Invalid Link.Please try again" })
                }

            } catch (ex) {
                res.json({ status: false, message: "Something went wrong" })
            }
        },
        checkId:async (req, res) => {
            try {
                console.log(req.params)
                let user = await User.findOne({ _id: req.params.id, isActive: true })
                console.log(user)
                if (user) {
                    res.json({ status: true, data: user, message: "" })
                }
                else {
                    res.json({ status: false, message: "Invalid Link.Please try again" })
                }
            } catch (ex) {
                console.log(ex)
                res.send("Something went wrong")
            }
        },
        checkUser:async (req, res) => {
            try {
                if (req.params.id) {
                    let users = await User.findOne({"email": req.params.id })

                    if (users) {
                        let id = uuidv4()
                        let url = process.env.BASE_URL + '/#/reset/' + users.id              
                        users.password = null
                        users.isActive = true
                        users.save()
                        let emailObj = {
                            from: 'Urlshortner@gmail.com',
                            to: users.email,
                            subject: "Password Recovery Mail",
                             text: url,
                            // link:url,
                            // path:path.join(__dirname,'../templates/forgetPassword.html')
                        }
                        // sendActivationLink(emailObj)
                        mailSender.SendMail(emailObj)
                        res.json({ status: true, message: users.email })

                        setTimeout(() => {
                            users.isActive = false
                            users.save()
                        }, 600000)
                    }
                    else {
                        res.json({ status: false, message: "User Not found" })
                    }
                }
                else {
                    res.send("Invalid Request")
                }
            }
            catch (e) {
                console.log(e)
                res.json({ status: false, message: "Something went wrong" })
            }
        }
    }
}

module.exports = UserController


