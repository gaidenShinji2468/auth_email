const {DataTypes} = require("sequelize");
const sequelize = require("../utils/connection");
const User = require("./User");
const EmailCode = sequelize.define("email_code", {
  code: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

EmailCode.belongsTo(User);
User.hasOne(EmailCode);

module.exports = EmailCode;
