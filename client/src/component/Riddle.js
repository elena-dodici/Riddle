import API from "../API";
/**
 *
 * @param {string} id the id of the riddle
 * @param {string} content the content of the riddle
 * @param {string} difficulty difficulty of a riddle
 * @param {string} hint1  1st hint
 * @param {string} hint2 2nd hint
 * @param {number} duration allowed time period
 * @param {string} state open/closed riddle
 * @param {string} answer answer of the riddle
 * @param {string} createTime createtime of the riddle
 * @param {string} closeTime closeTime of the riddle
 * @param {number} authorId authorId of the riddle
 * @param {number} expiration expiration of the riddle
 */

class Riddle {
  constructor(
    rid,
    content,
    difficulty,
    hint1,
    hint2,
    duration,
    state,
    answer,
    createTime,
    closeTime,
    expiration,
    authorId
  ) {
    this.rid = rid;
    this.content = content;
    this.difficulty = difficulty;
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.duration = duration;
    this.answer = answer;
    this.state = state;
    this.createTime = createTime;
    this.closeTime = closeTime;
    this.expiration = expiration;
    this.authorId = authorId;
    this.history = [];
  }

  async getHistory() {
    this.history = await API.GetHistoryByRid(this.rid);
  }
}

export default Riddle;
