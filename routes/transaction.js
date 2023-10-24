const express = require("express");
const controller = require("../controllers/transaction.controller/index");

const router = express.Router();

// TRANSACTION Route
router.post("/transactions", controller.createTransaction);
router.get("/transactions", controller.getTransactions);
router.get("/transactions/:transactionsId", controller.getTransactionById);

module.exports = router;
