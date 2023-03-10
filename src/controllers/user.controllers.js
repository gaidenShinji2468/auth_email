const catchError = require("../utils/catchError");
const Controller = require("./");
const User = require("../models/User");
const EmailCode = require("../models/EmailCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

class UserController extends Controller {
  constructor() {
    super(User);
    this.frontBaseUrl = "http://localhost:8080/users";
  }

  create() {
    return catchError(async (req, res) => {
      const data = req.body;
      const encrypted = await bcrypt.hash(data.password, 10);

      const createdUser = await User.create({...data, password: encrypted});

      const code = crypto.randomBytes(32).toString("hex");

      await sendEmail({
        to: createdUser.email,
	subject: "Verify your account",
	html: `<h3>Click on this link: <a href="${this.frontBaseUrl}/verify_email/${code}">${this.frontBaseUrl}/verify_email/${code}</a> for verify your account</h3>`
      });
      
      const createdVerifiycation = await EmailCode.create({code, userId: createdUser.id});

      res.status(201).json({
        statusCode: 201,
	message: "Created Success",
	data: createdUser
      });
    });
  }

  login() {
    return catchError(async (req, res) => {
      const {email, password} = req.body;
      const logged = await User.findOne({where: {email}});

      if(!logged)
	res.status(404).json({
          statusCode: 404,
	  message: "Not Found"
	});
    
      const isValid = await bcrypt.compare(password, logged.password);

      if(!isValid)
	res.status(403).json({
          statusCode: 403,
	  message: "Forbidden"
	});

      if(!logged.isVerified)
	res.sendStatus(401);

      const token = jwt.sign(
        {user: logged},
        process.env.TOKEN_SECRET,
        {expiresIn: "2d"}	 
      );

      res.status(200).json({
        statusCode: 200,
	message: "Created Success",
	data: {token}
      });
    });
  }

  logged() {
    return catchError(async (req, res) => {
      const loggedUser = req.user;

      res.status(200).json({
        statusCode: 200,
	message: "Read Success",
	data: loggedUser
      });
    });
  }

  verifyCode() {
    return catchError(async (req, res) => {
      const {code} = req.params;
      const emailVerified = await EmailCode.findOne({where: {code}});

      if(!emailVerified)
	res.sendStatus(401);

      const userVerified = await User.findByPk(emailVerified.userId);

      if(!userVerified)
	res.sendStatus(401);
      await User.update({isVerified: true}, {
	where: {id: userVerified.id}
      });
      await EmailCode.destroy({where: {id: emailVerified.id}});

      res.sendStatus(204);
    });
  }
};

module.exports = UserController;
