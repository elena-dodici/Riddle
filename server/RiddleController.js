const RDao = require("./PersistantManager");
// exports.getRiddleByState = {
//   state: {
//     isInt: {
//       option: { min: 0 },
//     },
//   },
// };

// exports.postPlanByIdSchema = {
//   id: {
//     notEmpty: true,
//     isNumeric: true,
//     isInt: {
//       option: { min: 0 },
//     },
//   },
// };
// exports.deletePlanByIdSchema = {
//   id: {
//     notEmpty: true,
//     isNumeric: true,
//     isInt: {
//       option: { min: 0 },
//     },
//   },
// };

// exports.putPlanByIdSchema = {
//   id: {
//     notEmpty: true,
//     isNumeric: true,
//     isInt: {
//       option: { min: 0 },
//     },
//   },
// };

async function postRiddle(req, res) {
  try {
    let riddle = req.body.riddle;

    riddle["rid"] = null;
    await RDao.store("Riddle", riddle);
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
exports.postRiddle = postRiddle;

//get all riddle
exports.getRiddles = async function (req, res) {
  try {
    let result = await RDao.loadAllRows("Riddle");
    if (result.length === 0) return Promise.reject("This state cannot find");
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("generic error");
  }
};

//get riddle By state
exports.getRiddlesByState = async function (req, res) {
  try {
    let state = req.params.state;

    let result = await RDao.loadAllRowsByOneAttribute("Riddle", "state", state);

    if (result.length === 0) return Promise.reject("This state cannot find");
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("generic error");
  }
};

//get riddle By authorId
exports.getRiddlesByAutId = async function (req, res) {
  try {
    let authorId = req.user.id;

    let result = await RDao.loadAllRowsByOneAttribute(
      "Riddle",
      "authorId",
      authorId
    );

    if (result.length === 0)
      return Promise.reject("This author doesn't have riddle");
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("generic error");
  }
};

//update riddle :
exports.putCloseTimeByRId = async function (req, res) {
  let RId = req.params.rid;
  let newTime = req.body;

  try {
    updateresult = await RDao.update("Riddle", newTime, "rid", RId);
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
