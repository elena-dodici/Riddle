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
    console.log(now);
    if (!row.expiration) {
      let exp = now.add(row.duration, "s");
      let newexp = { expiration: exp };
      await HDao.update("Riddle", newexp, "rid", History.rid);
    } else {
      if (now > row.expiration) {
        let obj = { state: "close" };
        await HDao.update("Riddle", obj, "rid", History.rid);
      } else {
        await HDao.store("History", History);
      }
    }

    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
exports.postHistory = postHistory;
