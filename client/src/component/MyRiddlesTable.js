import { Row, Col, Button, Form, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import { RiddleForm } from "./RiddleForm";
import { ClosedRiddlesTable } from "./ClosedRiddlesTable";
import { MyOpenRiddlesTable } from "./MyOpenRiddlesTable";

const MyRiddlesTable = () => {
  const { auth } = useContext(AuthContext);
  const [showCloseRiddle, setShowCloseRiddle] = useState(false);
  const [showOpenRiddle, setShowOpenRiddle] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [MyclosedRiddles, setMyClosedRiddles] = useState([]);
  const [MyopenRiddles, setMyOpenRiddles] = useState([]);
  const [update, setUpdate] = useState(true);
  const [points, setPoints] = useState(0);

  const clickHandleClosed = async () => {
    setShowCloseRiddle((r) => !r);
  };
  const clickHandleOpen = async () => {
    setShowOpenRiddle((r) => !r);
  };

  const syncUserPointById = async (r) => {
    let result = await API.getUserById(r);
    setPoints(result.points);
  };

  const syncOpenRiddle = async function () {
    let MyRiddles = await API.getRiddleByAuthorId(auth.id);
    let MyOpenRiddles = [];
    for (let r of MyRiddles) {
      if (r.state === "open") {
        MyOpenRiddles.push(r);
        r.getHistory();
      }
    }
    setMyOpenRiddles(MyOpenRiddles);
  };

  const syncCloseRiddle = async function () {
    let MyRiddles = await API.getRiddleByAuthorId(auth.id);
    let MyCloseRiddles = [];
    for (let r of MyRiddles) {
      if (r.state === "close") {
        MyCloseRiddles.push(r);
        r.getHistory();
      }
    }
    setMyClosedRiddles(MyCloseRiddles);
  };

  useEffect(() => {
    if (update) {
      syncOpenRiddle();
      syncCloseRiddle();
      syncUserPointById(auth.id);
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
              label="Show My Closed riddles"
            />
            <Form.Check
              onChange={clickHandleOpen}
              type="switch"
              id="switch2"
              defaultChecked={true}
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
        <Col>My current Credit: {points}</Col>
      </Row>
      <Row>
        {showForm && (
          <RiddleForm
            setShowForm={setShowForm}
            setUpdate={setUpdate}
            setMyOpenRiddles={setMyOpenRiddles}
          />
        )}
      </Row>
      <Row>
        {showCloseRiddle && (
          <ClosedRiddlesTable closedRiddles={MyclosedRiddles} />
        )}
      </Row>
      <Row>
        {showOpenRiddle && (
          <MyOpenRiddlesTable
            myOpenRiddles={MyopenRiddles}
            setOpenRiddles={setMyOpenRiddles}
            setUpdate={setUpdate}
          />
        )}
      </Row>
    </Container>
  );
};

export { MyRiddlesTable };
