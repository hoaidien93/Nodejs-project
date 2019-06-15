var nodemailer = require('nodemailer');
var transporter; 
class Mailer{

    constructor(){
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hoaidien93@gmail.com',
              pass: 'hoaidienpro'
            }
          });
    }

    sendMail(to,subject,content){
        var mailOptions = {
            from: 'Trung tâm mua sắm trực tuyến',
            to: to,
            subject: subject,
            html: content
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

}

module.exports = Mailer