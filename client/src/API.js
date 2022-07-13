import Riddle from "./component/Riddle";
import History from "./component/History";
import User from "./component/User";
const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();

    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const createRiddleObj = (r) => {
  return new Riddle(
    r.rid,
    r.content,
    r.difficulty,
    r.hint1,
    r.hint2,
    r.duration,
    r.state,
    r.answer,
    r.createTime,
    r.closeTime,
    r.expiration,
    r.authorId
  );
};

const getAllRiddles = async () => {
  const response = await fetch(SERVER_URL + "/api/riddles");
  const result = await response.json();
  if (response.ok) {
    return result.map((r) => createRiddleObj(r));
  } else throw result;
};

const AddRiddle = async (riddle) => {
  const response = await fetch(SERVER_URL + `/api/riddle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      riddle: riddle,
    }),
  });
  if (!response.ok) {
    const errMsg = await response.json();
    throw errMsg;
  } else return null;
};

const getRiddleByAuthorId = async (uid) => {
  const response = await fetch(SERVER_URL + `/api/riddle/${uid}`, {
    credentials: "include",
  });
  const result = await response.json();

  if (response.ok) {
    return result.map((r) => createRiddleObj(r));
  } else throw result;
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/session/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return true;
  } else return false;
};

//get user info if within session
const GetUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/session/current", {
    credentials: "include",
  });
  const user = response.json();

  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const getRiddleByState = async (state) => {
  const response = await fetch(SERVER_URL + `/api/riddles/${state}`, {
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    return result.map((r) => createRiddleObj(r));
  } else throw result;
};

const GetHistoryByRid = async (rid) => {
  const response = await fetch(SERVER_URL + `/api/history/${rid}`, {
    credentials: "include",
  });
  const result = await response.json();

  if (response.ok) {
    return result.map(
      (h) =>
        new History(h.hid, h.rid, h.repId, h.answerTime, h.answer, h.result)
    );
  } else throw result;
};

const GetUserOrderedList = async () => {
  const response = await fetch(SERVER_URL + "/api/users");
  const result = await response.json();

  if (response.ok) {
    return result.map((u) => new User(u.id, u.name, u.points));
  } else throw result;
};

// const UpdateUserPoints = async (id, point) => {
//   const response = await fetch(SERVER_URL + `/api/user/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({
//       points: point,
//     }),
//   });

//   if (!response.ok) {
//     const errMsg = await response.json();
//     throw errMsg;
//   } else return null;
// };

const AddNewHistory = async (history) => {
  const response = await fetch(SERVER_URL + `/api/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ history: history }),
  });
  console.log(history);
  if (!response.ok) {
    const errMsg = await response.json();
    throw errMsg;
  } else return null;
};

const getUserById = async (id) => {
  const response = await fetch(SERVER_URL + `/api/user/${id}`, {
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else throw result;
};

// const UpdateCloseTime = async (rid, time) => {
//   const response = await fetch(SERVER_URL + `/api/riddle/${rid}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({
//       closeTime: time,
//     }),
//   });

//   if (!response.ok) {
//     const errMsg = await response.json();
//     throw errMsg;
//   } else return null;
// };

const UpdateStateByRid = async (rid, newState) => {
  const response = await fetch(SERVER_URL + `/api/riddle/state/${rid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      state: newState,
    }),
  });

  if (!response.ok) {
    const errMsg = await response.json();
    throw errMsg;
  } else return null;
};

const API = {
  getAllRiddles,
  logIn,
  GetUserInfo,
  logOut,
  getRiddleByState,
  AddRiddle,
  GetHistoryByRid,
  getRiddleByAuthorId,
  GetUserOrderedList,
  getUserById,
  AddNewHistory,
  UpdateStateByRid,
};
export default API;
