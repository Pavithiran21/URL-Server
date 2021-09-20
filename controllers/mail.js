const nodemailer = require("nodemailer");

const mailSender={
     SendMail:async(emailObj)=>{
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "0987bcd10d5bf2",
            pass: "c1edae4a3d21d6"
          }
        });
          let info = await transporter.sendMail(emailObj);
          console.log("Message sent: %s", info.messageId);
    }
}


module.exports=mailSender