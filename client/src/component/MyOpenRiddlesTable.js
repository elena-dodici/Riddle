import { Table, Accordion } from "react-bootstrap";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import API from "../API";

const MyOpenRiddlesTable = (props) => {
  const [curTime, setCurTime] = useState(0);
  useEffect(() => {
    const handleTimeOut = () => {
      setCurTime(Date.now());
      props.sync();
    };
    let timer = setTimeout(() => handleTimeOut(), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [curTime]);

  return (
    <>
      <h2>My published Open Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th width="200">Answer History</th>
            <th>Remaining Time</th>
          </tr>
        </thead>
        <tbody>
          {props.myOpenRiddles.map((r) => (
            <OpenRRow
              key={r.rid}
              riddle={r}
              setOpenRiddles={props.setOpenRiddles}
              setUpdate={props.setUpdate}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const OpenRRow = (props) => {
  const calcRemTime = () => {
    if (props.riddle.expiration) {
      let now = dayjs();
      let exp = dayjs(props.riddle.expiration);
      let rem = Math.floor(exp.diff(now) / 1000);
      if (rem < 0) {
        API.UpdateStateByRid(props.riddle.rid, "expire").then(() => {
          props.setUpdate(true);
        });
        return 0;
      } else return rem;
    } else {
      return 0;
    }
  };
  const remTime = calcRemTime();

  return (
    <tr>
      <OpenRData key={props.riddle.rid} remTime={remTime} {...props} />
    </tr>
  );
};

const OpenRData = (props) => {
  return (
    <>
      <td className="column-left">{props.riddle.content}</td>
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
      <td>
        {props.remTime
          ? Math.floor(props.remTime / 60)
              .toString()
              .padStart(2, "0") +
            " : " +
            (props.remTime % 60).toString().padStart(2, "0")
          : ""}
      </td>
    </>
  );
};

const HistoryRow = (props) => {
  let renderTime = dayjs(props.info.answerTime).format("DD/MM/YYYY HH:mm:ss");
  return (
    <>
      <td>{renderTime}</td>
      <td>{props.info.answer}</td>
    </>
  );
};

export { MyOpenRiddlesTable };
