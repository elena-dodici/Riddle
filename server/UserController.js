const UserDao = require("./PersistantManager");

// exports.putPointsById = async function (req, res) {
//   //get point

//   let userId = req.user.id;
//   let oldpoint = await UserDao.loadOneByOneAttribute(
//     "User",
//     "points",
//     "id",
//     userId
//   );
//   let points = req.body.points;
//   let newPoint = points + oldpoint.points;

//   let result = await UserDao.update("User", { points: newPoint }, "id", userId);

//   if (result) res.status(200).json();
//   else res.status(500).json();
// };

exports.getUserById = async function (req, res) {
  let id = req.params.id;
  try {
    let result = await UserDao.loadOneByAttributeSelected("User", "id", id, [
      "name",
      "points",
    ]);
    console.log(result);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(503).json("generic error");
  }
};

exports.getPointsOrder = async function (req, res) {
  try {
    let userList = await UserDao.loadAllRowsByOrder("User", "points");

    if (userList.length === 0) return Promise.reject("DB no user");
    return res.status(200).json(userList);
  } catch (err) {
    res.status(503).json("generic error");
  }
};
