const RDao = require("./PersistantManager");
const dayjs = require("dayjs");
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

exports.putStateByRId = async function (req, res) {
  let rid = req.params.rid;
  let newState = req.body;

  const updateState = async (newState) => {
    try {
      updateresult = await RDao.update("Riddle", newState, "rid", rid);
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };

  if (newState.state)
    switch (newState.state) {
      case "open":
        break;
      case "close":
        break;
      case "expire":
        let rows = await RDao.loadAllRowsByOneAttribute("Riddle", "rid", rid);
        let row = rows[0];
        if (row.state === "close") {
          return res.status(200).json("already closed");
        } else if (row.expiration) {
          //1st reply
          let rem = Math.floor(dayjs().diff(dayjs(row.expiration)) / 1000);
          if (rem >= 0) {
            updateState({ state: "close", closeTime: dayjs() });
            return res.status(200).json("Closed");
          } else {
            return res.status(500).json("generic error");
          }
        }
        break;
    }
  res.status(500).json("generic error");
};
