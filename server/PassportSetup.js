const passport = require("passport");
const UserDao = require("./PersistantManager");
const LocalStrategy = require("passport-local");

//set up passport
passport.use(
  new LocalStrategy(async function verify(useremail, password, cb) {
    const user = await UserDao.getUser(useremail, password);

    if (!user) return cb(null, false, "incorrect email or password");
    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
//every request function will use this
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

module.exports = passport;
