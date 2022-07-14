const UserDao = require("./PersistantManager");

exports.getUserById = async function (req, res) {
  let id = req.params.id;
  try {
    let result = await UserDao.loadOneByAttributeSelected("User", "id", id, [
      "name",
      "points",
    ]);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(503).json("generic error");
  }
};

exports.getPointsOrder = async function (req, res) {
  try {
    let userList = await UserDao.loadAllRowsByOrder("User", "points", [
      "name",
      "points",
      "id",
    ]);

    let count = 1;
    let topThreeList = [];
    topThreeList.push(userList[0]);
    for (let i = 1; i < userList.length; i++) {
      if (count === 3) break;
      let prevPoint = userList[i - 1].points;
      if (userList[i].points === prevPoint) {
      } else {
        count += 1;
      }
      topThreeList.push(userList[i]);
    }

    if (userList.length === 0) return Promise.reject("DB no user");

    return res.status(200).json(topThreeList);
  } catch (err) {
    res.status(503).json("generic error");
  }
};
