import { Table, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

import API from "../API";

const ClosedRiddlesTable = (props) => {
  return (
    <>
      <h2> Closed Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th width="220">Answer History</th>
            <th>Correct Answer</th>
            <th>winner Name</th>
          </tr>
        </thead>
        <tbody>
          {props.closedRiddles.map((r) => (
            <CloseRRow key={r.rid} riddle={r} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const CloseRRow = (props) => {
  const [winnerName, setWinnerName] = useState("");
  let rightRes;

  const getUserById = async (r) => {
    //let nm = {};
    let result = await API.getUserById(r);
    return result.name;
  };
  //get repId and answer of the hist resulr="True"

  for (let h of props.riddle.history) {
    if (h.result === "T") {
      rightRes = h.answer;
      getUserById(h.repId).then((res) => {
        setWinnerName(res);
      });
      break;
    }
  }

  return (
    <tr>
      <CloseRData
        key={props.riddle.rid}
        riddle={props.riddle}
        winnerName={winnerName}
        rightRes={rightRes}
      />
    </tr>
  );
};

const CloseRData = (props) => {
  console.log(props.riddle.history);
  return (
    <>
      <td>{props.riddle.content}</td>
      <td>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Answer History</Accordion.Header>
            <Accordion.Body>
              {props.riddle.history.length > 0 ? (
                <>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.riddle.history.map((h) => (
                        <tr key={h.id}>
                          <HistoryRow info={h} />
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <h6>No history Data</h6>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </td>
      <td>{props.rightRes ? props.rightRes : "No correct Reply"}</td>
      <td>{props.winnerName ? props.winnerName : "No winner"}</td>
    </>
  );
};
const HistoryRow = (props) => {
  return (
    <>
      <td>{props.info.answerTime}</td>
      <td>{props.info.answer}</td>
    </>
  );
};
export { ClosedRiddlesTable };
