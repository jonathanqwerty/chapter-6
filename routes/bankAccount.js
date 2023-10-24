const express = require("express");
const controller = require("../controllers/bankAccount.controller/index");

const router = express.Router();

// ACCOUNT Route
router.post("/accounts", controller.createAccount);
router.get("/accounts", controller.getAccounts);
router.get("/accounts/:accountId", controller.getAccountById);

module.exports = router;
