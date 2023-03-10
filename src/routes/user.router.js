const router = require("express").Router();
const UserController = require("../controllers/user.controllers");
const verifyJWT = require("../utils/verifyJWT");
const userController = new UserController();

// public endpoints
router
  .route("/")
  .get(verifyJWT, userController.getAll()) // protected
  .post(userController.create());
router
  .route("/verify_email/:code")
  .get(userController.verifyCode());
router
  .route("/login")
  .post(userController.login());

// protected endpoints
router.use(verifyJWT); 
router
  .route("/me")
  .get(userController.logged());
router
  .route("/:id")
  .get(userController.getOne())
  .put(userController.update())
  .delete(userController.remove());

module.exports = router;
