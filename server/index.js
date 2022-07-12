"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const riddleRouter = require("./RiddleRouter");
const userRouter = require("./UserRouter");
const historyRouter = require("./HistoryRouter");
const passport = require("./PassportSetup");
const session = require("express-session");
// const isLoggedIn = require("./UserRouter");

// init express
const app = new express();
const port = 3001;

//set middleware
app.use(morgan("dev"));
app.use(express.json());

//set up the CORS
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
}
app.use(passport.authenticate("session"));

//Route
app.use("/api", riddleRouter);
app.use("/api", userRouter);
app.use("/api", isLoggedIn, historyRouter);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
