const express = require("express");
const router = express.Router();
const history = require("./HistoryController");
const { checkSchema } = require("express-validator");

//retrive
router.get(
  "/history/:rid",
  checkSchema(history.getHistoryByRIdSchema),
  history.getHistoryByRId
);

//post
router.post("/history", history.postHistory);

module.exports = router;
