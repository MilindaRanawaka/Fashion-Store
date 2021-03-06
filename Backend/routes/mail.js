const nodemailer = require("nodemailer");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//Get encrypted password and decrypt and store in password
const bytes = CryptoJS.AES.decrypt(process.env.passKey, process.env.jwtSecret);
const password = bytes.toString(CryptoJS.enc.Utf8);

//Specify nodemailer login
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//@route POST
//@desc Use to send email
//@input First Name, Username, Email, password
router.route("/").post((req, res) => {
  transporter.sendMail(
    {
      from: process.env.email,
      to: req.body.email,
      subject: "Your Fashion Store Account is created",
      text: `Hello, ` + req.body.firstName + ` Fashion Store account has been created as Store Manager
              User Below informations to access your Account
                    Username: ` + req.body.username +`
                    Email: ` + req.body.email +`
                    Password: ` + req.body.password +`
        Thank You`,
    },
    function (error, info) {
      if (error) {
        res.status(404);
        res.json(error);
      } else {
        res.json("Email sent: " + info.response);
      }
    }
  );
});

module.exports = router;
