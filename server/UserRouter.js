const express = require("express");
const router = express.Router();
const u = require("./UserController");
const passport = require("passport");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
}

router.post("/sessions", passport.authenticate("local"), (req, res) => {
  res.status(201).json(req.user);
});

router.get("/session/current", isLoggedIn, (req, res) => {
  //check is still valid
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

router.delete("/session/current", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// router.put("/user/:id", isLoggedIn, u.putPointsById);
router.get("/users", u.getPointsOrder);
router.get("/user/:id", isLoggedIn, u.getUserById);

module.exports = router;
