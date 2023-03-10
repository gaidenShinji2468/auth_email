const express = require('express');
const router = express.Router();
const user = require("./user.router");

// colocar las rutas aquí
router.use("/users", user);

module.exports = router;
