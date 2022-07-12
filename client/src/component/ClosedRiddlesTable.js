import {
  Table,
  Row,
  Col,
  Button,
  Accordion,
  OverlayTrigger,
  Tooltip,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";

const ClosedRiddlesTable = (props) => {
  const getRHis = (r) => {
    //find istory list related to the input rid
    let historyList = [];
    for (let i of props.history) {
      if (i.rid === r) {
        historyList = historyList.concat(i);
      }
    }
    return historyList;
  };

  return (
    <>
      <h2> Closed Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th>Answer History</th>
            <th>Correct Answer</th>
            <th>winner User Name</th>
          </tr>
        </thead>
        <tbody>
          {props.closedRiddles.map((r) => (
            <CloseRRow key={r.rid} riddle={r} historyList={getRHis(r.rid)} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const CloseRRow = (props) => {
  const [winnerName, setWinnerName] = useState("");
  let rightRes;

  const getNameById = async (r) => {
    //let nm = {};
    let result = await API.GetUserNameById(r);
    return result.name;
  };
  //get repId and answer of the hist resulr="True"
  if (!!props.historyList) {
    for (let h of props.historyList) {
      if (h.result === "T") {
        rightRes = h.answer;
        getNameById(h.repId).then((res) => {
          setWinnerName(res);
        });
        break;
      }
    }
  }

  if (winnerName)
    return (
      <tr>
        <CloseRData
          key={props.riddle.rid}
          riddle={props.riddle}
          historyList={props.historyList}
          winnerName={winnerName}
          rightRes={rightRes}
        />
      </tr>
    );
};

const CloseRData = (props) => {
  //get all answer as list
  let renderList = [];

  for (let i of props.historyList) {
    if (i.answer.length > 0) {
      renderList = renderList.concat(i.answer);
    }
  }

  return (
    <>
      <td>{props.riddle.content}</td>
      <td>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Answer History</Accordion.Header>
            <Accordion.Body>
              {renderList.length > 0 ? (
                <>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.historyList.map((h) => (
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
      <td>{props.rightRes}</td>
      <td>{props.winnerName}</td>
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
