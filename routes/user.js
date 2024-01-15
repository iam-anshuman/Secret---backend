const express = require("express");
const { login, signup } = require("../controller/handleUser");
const {handleForgetPassword,handlResetLink,handleSetNewPassword} = require("../controller/handleforgetPassword");

const router = express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.post("/forget-password",handleForgetPassword);
router.get("/reset-password/:id/:token",handlResetLink);
router.post("/set-new-password/:id/:token",handleSetNewPassword);

module.exports = router;