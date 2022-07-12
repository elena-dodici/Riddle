/**
 *
 * @param {number} id the code of the history
 * @param {number} riddleId the id of the riddle
 * @param {number} replierId Id of a replier
 * @param {string} answerTime  answer Time
 * @param {string} answer answer
 * @param {string} result the result of its answer(T/F)

 */

function History(id, rid, repId, answerTime, answer, result) {
  this.id = id;
  this.rid = rid;
  this.repId = repId;
  this.answerTime = answerTime;
  this.answer = answer;
  this.result = result;
}

export default History;
