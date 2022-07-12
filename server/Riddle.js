"use strict";

class Riddle {
  static tableName = "Riddle";

  constructor(
    id,
    content,
    difficulty,
    hint1,
    hint2,
    duration,
    state,
    answer,
    createTime,
    closeTime,
    authorId
  ) {
    this.id = id;
    this.content = content;
    this.difficulty = difficulty;
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.duration = duration;
    this.state = state;
    this.answer = answer;
    this.createTime = createTime;
    this.closeTime = closeTime;
    this.authorId = authorId;
  }
}

module.exports = Riddle;
