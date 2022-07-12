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
import { useContext, useState } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import { RiddleForm } from "./RiddleForm";
import { ClosedRiddlesTable } from "./ClosedRiddlesTable";
import { MyOpenRiddlesTable } from "./MyOpenRiddlesTable";

const MyRiddlesTable = (props) => {
  const { auth } = useContext(AuthContext);
  const [showCloseRiddle, setShowCloseRiddle] = useState(false);
  const [showOpenRiddle, setShowOpenRiddle] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myClosedRiddles, setMyClosedRiddles] = useState([]);
  const [myOpenRiddles, setMyOpenRiddles] = useState([]);
  const [history, setHistory] = useState();
  let closedRiddlesHistory = [];
  let openRiddlesHistory = [];

  const clickHandleClosed = async () => {
    setShowCloseRiddle((r) => !r);
    let Result = await API.getRiddleByAuthorId(auth.id);

    let closedResult = [];
    for (let cr of Result) {
      if (cr.state === "close") closedResult.push(cr);
    }

    for (let r of closedResult) {
      let result = await API.GetHistoryByRid(r.rid);
      closedRiddlesHistory = closedRiddlesHistory.concat(result);
    }

    setMyClosedRiddles(closedResult);
    setHistory(closedRiddlesHistory);
  };

  const clickHandleOpen = async () => {
    setShowOpenRiddle((r) => !r);

    let Result = await API.getRiddleByAuthorId(auth.id);

    let openResult = [];
    for (let or of Result) {
      if (or.state === "open") openResult.push(or);
    }

    for (let r of openResult) {
      let result = await API.GetHistoryByRid(r.rid);
      openRiddlesHistory = openRiddlesHistory.concat(result);
    }

    setMyOpenRiddles(openResult);
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
              label="Show My Closed riddles"
            />
            <Form.Check
              onChange={clickHandleOpen}
              type="switch"
              id="custom-switch"
              label="Show  My Open riddles"
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
      <Row>
        {showCloseRiddle && (
          <ClosedRiddlesTable
            closedRiddles={myClosedRiddles}
            history={history}
          />
        )}
        {showOpenRiddle && (
          <MyOpenRiddlesTable myOpenRiddles={myOpenRiddles} history={history} />
        )}
        {showForm && <RiddleForm />}
      </Row>
    </Container>
  );
};

export { MyRiddlesTable };
