const express = require("express");
const router = express.Router();
const {  registerRenter, loginRenter,getRenterData,allRenters } = require("../controllers/renterController");

router.post("/register", registerRenter);
router.post("/login", loginRenter);
router.get("/:id", getRenterData);

router.get("/all",allRenters);


module.exports = router;
