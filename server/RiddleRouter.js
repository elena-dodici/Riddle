const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();
const r = require("./RiddleController");
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
}
//get all riddle
router.get("/riddles", r.getRiddles);

//get riddle by state
router.get("/riddles/:state", isLoggedIn, r.getRiddlesByState);

//get riddle by authorId
router.get(
  "/riddle/:uid",
  isLoggedIn,
  checkSchema(r.postRiddleSchema),
  r.getRiddlesByAutId
);

router.post("/riddle", isLoggedIn, r.postRiddle);

router.put("/riddle/state/:rid", isLoggedIn, r.putStateByRId);

module.exports = router;
