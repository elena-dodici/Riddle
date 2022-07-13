//DAO
"use strict";
const sqlite = require("sqlite3");
const crypto = require("crypto");

const db = new sqlite.Database("DB.sqlite3", (err) => {
  if (err) {
    throw err;
  }
});

//ORDER BY column1,  ... ASC|DESC;
exports.loadAllRowsByOrder = async function loadAllRowsByOrder(
  tableName,
  orderAttr
) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " + tableName + " ORDER BY " + orderAttr + " DESC ";
    db.get("PRAGMA foreign_keys =ON");
    db.all(sql, (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

exports.loadAllRows = async function loadAllRows(tableName) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM " + tableName;
    db.get("PRAGMA foreign_keys =ON");
    db.all(sql, (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

exports.getUser = async function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ? ";
    db.get("PRAGMA foreign_keys =ON");
    db.get(sql, [email], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        const user = {
          id: row.id,
          username: row.email,
          name: row.name,
          surname: row.surname,
          points: row.points,
        };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPwd) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPwd)
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

//SELECT * FROM History WHERE rid = 1;
exports.loadAllRowsByOneAttribute = async function loadAllRowsByOneAttribute(
  tableName,
  attrName,
  val
) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM " + tableName + " WHERE " + attrName + "= ?";
    db.get("PRAGMA foreign_keys =ON");
    db.all(sql, [val], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

//SELECT name,points FROM User WHERE id =1;
exports.loadOneByAttributeSelected = async function loadOneByAttributeSelected(
  tableName,
  parameter_name,
  value,
  selectedNames
) {
  return new Promise((resolve, reject) => {
    const selectedAttributes = selectedNames.join(",");
    const sql =
      "SELECT " +
      selectedAttributes +
      " FROM " +
      tableName +
      " WHERE " +
      parameter_name +
      "= ?";

    db.get("PRAGMA foreign_keys = ON");
    db.get(sql, value, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

//SELECT name FROM User WHERE id =1;
// exports.loadOneByOneAttribute = async function loadOneRowByOneAttribute(
//   tableName,
//   seleceName,
//   attrName,
//   val
// ) {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "SELECT " +
//       seleceName +
//       " FROM " +
//       tableName +
//       " WHERE " +
//       attrName +
//       "= ?";
//     db.get("PRAGMA foreign_keys =ON");
//     db.get(sql, [val], (err, rows) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(rows);
//     });
//   });
// };

//post history or riddle
//INSERT INTO history ("id","rid","repid","answerTime","answer","result")VALUES ("1","TEST1",...)
//INSERT INTO riddle(...)
exports.store = async function store(tableName, object) {
  return new Promise((resolve, reject) => {
    //names of the attributes of the objects
    let attributesName = [];
    //Values of the attributes
    let attributesValue = [];

    //Loop through all the object attributes and push them into the arrays
    for (var prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop)) {
        attributesName.push(prop);
        attributesValue.push(object[prop]);
      }
    }

    const placeHoldersArray = attributesName.map((val) => "?");
    const sql =
      "INSERT INTO " +
      tableName +
      "(" +
      attributesName.join(",") +
      ") VALUES (" +
      placeHoldersArray.join(",") +
      ")";
    //const sql = "INSERT INTO " + tableName + " VALUES (?,?)"

    db.get("PRAGMA foreign_keys = ON");

    db.run(sql, attributesValue, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//put study plan by userid
//UPDATE points SET option=6 WHERE id=6
//object{attrName:newVal}
exports.update = async function update(tableName, object, attr, val) {
  return new Promise((resolve, reject) => {
    let attrName = [];
    let attrVal = [];
    for (let prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop)) {
        attrName.push(prop + "=?");
        attrVal.push(object[prop]);
      }
    }
    const sql =
      "UPDATE " +
      tableName +
      " SET " +
      attrName.join(",") +
      " WHERE " +
      attr +
      "=?";
    db.get("PRAGMA foreign_keys =ON");
    db.run(sql, [...attrVal, val], (err) => {
      if (err) reject(err);
    });
    resolve(true);
  });
};
