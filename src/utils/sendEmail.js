const nodemailer = require("nodemailer");

const sendEmail = (options) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    ...options
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error, info);
    if(error) {
      console.log();
      reject({message: "An error has ocurred"});
    }
    resolve({message: "Email sent successfully"});
  });
});

module.exports = sendEmail;
