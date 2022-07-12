import {
  Table,
  Row,
  Col,
  Button,
  Accordion,
  OverlayTrigger,
  Modal,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import AuthContext from "./AuthProvider";

const MyOpenRiddlesTable = (props) => {
  //const [historyList, setHistoryList] = useState([]);
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
      <h2>My published Open Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th>Answer History</th>
            <th>Remaining Time</th>
          </tr>
        </thead>
        <tbody>
          {props.myOpenRiddles.map((r) => (
            <OpenRRow key={r.rid} riddle={r} historyList={getRHis(r.rid)} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const OpenRRow = (props) => {
  return (
    <tr>
      <OpenRData
        key={props.riddle.rid}
        riddle={props.riddle}
        historyList={props.historyList}
      />
    </tr>
  );
};

const OpenRData = (props) => {
  //get all answer as list
  let renderList = [];

  for (let i of props.historyList) {
    renderList = renderList.concat(i.answer);
  }

  return (
    <>
      <td>{props.riddle.content}</td>
      <td>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Answer History</Accordion.Header>
            <Accordion.Body>
              {renderList.length ? (
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
      <td>remaining Time</td>
    </>
  );
};

const HistoryRow = (props) => {
  return (
    <>
      <td>{props.info.answerTime}</td>
      <td>{props.info.answer}</td>{" "}
    </>
  );
};

export { MyOpenRiddlesTable };
