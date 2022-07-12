import {
  Table,
  Row,
  Col,
  Button,
  Link,
  Accordion,
  OverlayTrigger,
  Form,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import { RiddleForm } from "./RiddleForm";
import { ClosedRiddlesTable } from "./ClosedRiddlesTable";
import { OpenRiddlesTable } from "./OpenRiddlesTable";

const LoginRiddlesTable = (props) => {
  const [showCloseRiddle, setShowCloseRiddle] = useState(false);
  const [showOpenRiddle, setShowOpenRiddle] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [closedRiddles, setClosedRiddles] = useState([]);
  const [openRiddles, setOpenRiddles] = useState([]);
  const [history, setHistory] = useState();
  const [update, setUpdate] = useState(false);
  let closedRiddlesHistory = [];
  let openRiddlesHistory = [];

  const clickHandleClosed = async () => {
    setShowCloseRiddle((r) => !r);
    let closedResult = await API.getRiddleByState("close");
    for (let r of closedResult) {
      let result = await API.GetHistoryByRid(r.rid);
      closedRiddlesHistory = closedRiddlesHistory.concat(result);
    }

    setClosedRiddles(closedResult);
    setHistory(closedRiddlesHistory);
  };
  const syncOpenRiddle = async function () {
    if (showOpenRiddle) {
      let openResult = await API.getRiddleByState("open");
      // console.log(openResult);
      for (let r of openResult) {
        let result = await API.GetHistoryByRid(r.rid);
        openRiddlesHistory = openRiddlesHistory.concat(result);
      }
      setOpenRiddles(openResult);
    }
  };

  const syncCloseRiddle = async function () {
    if (showCloseRiddle) {
      let closedResult = await API.getRiddleByState("close");
      for (let r of closedResult) {
        let result = await API.GetHistoryByRid(r.rid);
        closedRiddlesHistory = closedRiddlesHistory.concat(result);
      }

      setClosedRiddles(closedResult);
    }
  };

  useEffect(() => {
    if (update) {
      syncOpenRiddle();
      syncCloseRiddle();
      setUpdate(false);
    }
  }, [update]);

  const clickHandleOpen = async () => {
    setShowOpenRiddle((r) => !r);
    let openResult = await API.getRiddleByState("open");
    // console.log(openResult);
    for (let r of openResult) {
      let result = await API.GetHistoryByRid(r.rid);
      openRiddlesHistory = openRiddlesHistory.concat(result);
    }
    setOpenRiddles(openResult);
    setHistory(openRiddlesHistory);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Check
              onChange={clickHandleClosed}
              type="switch"
              id="custom-switch"
              label="Show All Closed riddles"
            />
            <Form.Check
              onChange={clickHandleOpen}
              type="switch"
              id="custom-switch"
              label="Show All Open riddles"
            />
          </Form>
        </Col>
        <Col>
          <Button
            variant="outline-info"
            onClick={() => {
              setShowForm((r) => !r);
            }}
          >
            Add a new riddle{" "}
          </Button>
        </Col>
      </Row>
      <Row>{showForm && <RiddleForm setShowForm={setShowForm} />}</Row>

      <Row>
        {showOpenRiddle && (
          <OpenRiddlesTable
            openRiddles={openRiddles}
            setOpenRiddles={setOpenRiddles}
            setUpdate={setUpdate}
            history={history}
          />
        )}
      </Row>
      <Row>
        {showCloseRiddle && (
          <ClosedRiddlesTable closedRiddles={closedRiddles} history={history} />
        )}
      </Row>
    </Container>
  );
};

export { LoginRiddlesTable };
