const express = require("express");
const {getSecrets,createSecret,deleteSecret} = require("../controller/handleSecrets");

const router = express.Router();

router.get("/",getSecrets);
router.post("/",createSecret);
router.delete("/delete/:id",deleteSecret);

module.exports = router;