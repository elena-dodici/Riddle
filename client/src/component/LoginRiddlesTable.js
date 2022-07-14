import { Row, Col, Button, Form, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import { RiddleForm } from "./RiddleForm";
import { ClosedRiddlesTable } from "./ClosedRiddlesTable";
import { OpenRiddlesTable } from "./OpenRiddlesTable";

const LoginRiddlesTable = () => {
  const { auth } = useContext(AuthContext);
  const [showCloseRiddle, setShowCloseRiddle] = useState(false);
  const [showOpenRiddle, setShowOpenRiddle] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [closedRiddles, setClosedRiddles] = useState([]);
  const [openRiddles, setOpenRiddles] = useState([]);
  const [update, setUpdate] = useState(true);
  const [points, setPoints] = useState(0);

  const clickHandleClosed = async () => {
    setShowCloseRiddle((r) => !r);
  };
  const clickHandleOpen = async () => {
    setShowOpenRiddle((r) => !r);
  };

  const syncOpenRiddle = async function () {
    let openResult = await API.getRiddleByState("open");
    for (let r of openResult) {
      await r.getHistory();
    }

    setOpenRiddles(openResult);
  };

  const syncUserPointById = async (r) => {
    let result = await API.getUserById(r);
    setPoints(result.points);
  };

  const syncCloseRiddle = async function () {
    let closedResult = await API.getRiddleByState("close");
    for (let r of closedResult) {
      await r.getHistory();
    }

    setClosedRiddles(closedResult);
  };

  const sync = () => {
    syncOpenRiddle();
    syncCloseRiddle();
    syncUserPointById(auth.id);
  };

  useEffect(() => {
    if (update) {
      sync();
      setUpdate(false);
    }
  }, [update]);

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Check
              onChange={clickHandleClosed}
              type="switch"
              id="switch1"
              label="Show All Closed riddles"
            />
            <Form.Check
              onChange={clickHandleOpen}
              type="switch"
              id="cswitch2"
              defaultChecked={true}
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
        <Col>My current Credit: {points}</Col>
      </Row>
      <Row>
        {showForm && (
          <RiddleForm
            setShowForm={setShowForm}
            setMyOpenRiddles={setOpenRiddles}
            setUpdate={setUpdate}
          />
        )}
      </Row>

      <Row>
        {showOpenRiddle && (
          <OpenRiddlesTable
            openRiddles={openRiddles}
            setOpenRiddles={setOpenRiddles}
            setUpdate={setUpdate}
            sync={sync}
          />
        )}
      </Row>
      <Row>
        {showCloseRiddle && (
          <ClosedRiddlesTable closedRiddles={closedRiddles} />
        )}
      </Row>
    </Container>
  );
};

export { LoginRiddlesTable };
