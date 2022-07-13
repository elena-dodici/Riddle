"use strict";
const HDao = require("./PersistantManager");
const History = require("./History");
const dayjs = require("dayjs");
//after validation
//interact with dao directly

exports.getHistoryByRIdSchema = {
  id: {
    notEmpty: true,
    isNumeric: true,
    isInt: {
      points: { min: 0 },
    },
  },
};

exports.getHistoryByRId = async function (req, res) {
  try {
    let Rid = req.params.rid;

    let history = await HDao.loadAllRowsByOneAttribute("History", "rid", Rid);

    // if (history.length === 0)
    //   return Promise.reject("This riddle doesn't have history in DB");
    return res.status(200).json(history);
  } catch (err) {
    res.status(503).json("generic error");
  }
};

const handleCheck = async (History) => {
  let rows = await HDao.loadAllRowsByOneAttribute("Riddle", "rid", History.rid);
  let row = rows[0];
  let proposal = History.answer.trim().toLowerCase();
  let real = row.answer.trim().toLowerCase();
  let Points;
  if (proposal === real) {
    //update history
    History["result"] = "T";
    //update points
    let userRow = await HDao.loadAllRowsByOneAttribute(
      "User",
      "id",
      History.repId
    );

    Points = userRow[0].points;

    if (row.difficulty === "easy") {
      Points = Points + 1;
    } else if (row.difficulty === "medium") {
      Points = Points + 2;
    } else if (row.difficulty === "hard") {
      Points = Points + 3;
    }
  } else {
    History["result"] = "F";
  }
  console.log("Historu>>>", History);

  if (History["result"] === "T") {
    await HDao.update("User", { points: Points }, "id", History.repId);
    //update closetime and state in riddle
    let updateContent = {
      closeTime: dayjs(),
      state: "close",
    };
    await HDao.update("Riddle", updateContent, "rid", History.rid);
  }
  await HDao.store("History", History);
};

// store, add enrolNum
async function postHistory(req, res) {
  try {
    let History = req.body.history;
    History["hid"] = null;

    let rows = await HDao.loadAllRowsByOneAttribute(
      "Riddle",
      "rid",
      History.rid
    );
    let row = rows[0];
    if (row.state === "close") {
      res.status(500).json("Closed");
    }
    let now = dayjs();
    //1st reply

    if (!row.expiration) {
      let exp = now.add(row.duration, "s");
      let newexp = { expiration: exp };
      await HDao.update("Riddle", newexp, "rid", History.rid);
      await handleCheck(History);
    } else {
      //not 1st reply but over time
      if (now > row.expiration) {
        let obj = { state: "close" };
        await HDao.update("Riddle", obj, "rid", History.rid);
      } else {
        await handleCheck(History);
      }
    }

    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
exports.postHistory = postHistory;
