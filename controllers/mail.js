const nodemailer = require("nodemailer");

const mailSender={
     SendMail:async(emailObj)=>{
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 587,
          auth: {
            user: "2ef6a64c87dcbc",
            pass: "f639360e88c3fb"
          }
        });
          let info = await transporter.sendMail(emailObj);
          console.log("Message sent: %s", info.messageId);
    }
}


module.exports=mailSender
