const express = require("express"),
  router = express.Router(),
  controller = require("../controller/authController"),
  verifyToken = require("../middlewares/verifyToken"),
  validator = require("../middlewares/validation"),
  schema = require("../validation/authSchema");

// AUTH Route
router.post("/register", validator(schema.register), controller.register);
router.post("/login", validator(schema.login), controller.login);
router.get("/profile", verifyToken, controller.profile);
router.put(
  "/change-password",
  verifyToken,
  validator(schema.changePassword),
  controller.changePassword
);

module.exports = router;
