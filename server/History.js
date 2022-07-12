"use strict";

class History {
  static tableName = "History";

  constructor(id, rid, repId, answerTime, answer, result) {
    this.id = id;
    this.rid = rid;
    this.repId = repId;
    this.answerTime = answerTime;
    this.answer = answer;
    this.result = result;
  }
}

module.exports = History;
