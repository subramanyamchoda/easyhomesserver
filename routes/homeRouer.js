const express = require("express");
const { homeSender , getHomes, deleteHome } = require("../controllers/homeController");
const {verifiTokens}=require('../middlewares/verifyToken')
const router = express.Router();


router.post("/send", verifiTokens,homeSender);
router.get("/get", getHomes);
router.delete("/:id", deleteHome);
module.exports = router;
