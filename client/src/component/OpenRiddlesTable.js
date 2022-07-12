import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  OverlayTrigger,
  Form,
  Tooltip,
} from "react-bootstrap";
import { TiWarningOutline } from "react-icons/ti";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import dayjs from "dayjs";
import Timer from "./Timer.js";

const OpenRiddlesTable = (props) => {
  return (
    <>
      <h2> Open Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th>difficulty</th>
            <th>Reply</th>
          </tr>
        </thead>
        <tbody>
          {props.openRiddles.map((r, index) => (
            <OpenRRow
              key={r.rid}
              riddle={r}
              index={index}
              setOpenRiddles={props.setOpenRiddles}
              history={props.history}
              setUpdate={props.setUpdate}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const OpenRRow = (props) => {
  //console.log(props.riddle);
  const setRiddle = (nr) => {
    props.setOpenRiddles((or) => {
      let newR = [...or];
      newR[props.index] = nr;
      return newR;
    });
  };
  return (
    <tr>
      <OpenRData key={props.riddle.rid} {...props} />

      <td>
        <OpenRAction setRiddle={setRiddle} {...props}></OpenRAction>
      </td>
    </tr>
  );
};

const OpenRAction = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [answer, setAnswer] = useState("");
  const { auth } = useContext(AuthContext);
  const checkAnswer = (answer) => {
    let prposedRes = answer.trim().toLowerCase();
    let realanswer = props.riddle.answer.trim().toLowerCase();
    if (prposedRes === realanswer || prposedRes.includes(realanswer))
      return true;
    else return false;
  };

  const assistCheck = () => {
    for (let i of props.history) {
      if (i.rid === props.riddle.rid && i.repId === auth.id) return true;
      // else return false;
    }
    return false;
  };

  const handleDisabled = () => {
    // is author OR already appear in the history repid
    if (auth.id === props.riddle.authorId || assistCheck()) return true;
    else return false;
  };
  const disable = handleDisabled();
  const handleSumbit = async () => {
    let result = checkAnswer(answer);
    let newRiddle = { ...props.riddle };
    let NewHistory = {
      rid: newRiddle.rid,
      repId: auth.id,
      answerTime: dayjs().format("YYYY/MM/DD HH:mm:ss"),
      answer: answer,
    };

    if (result === true) {
      console.log("enter right result");
      //update score

      newRiddle.state = "close";
      props.setRiddle(newRiddle);
      let score = newRiddle.difficulty;

      if (score === "easy") {
        await API.UpdateUserPoints(auth.id, 1);
      } else if (score === "medium") await API.UpdateUserPoints(auth.id, 2);
      else if (score === "hard") await API.UpdateUserPoints(auth.id, 3);
      else await API.UpdateUserPoints(auth.id, 0);

      //update history
      NewHistory["result"] = "T";
      //update close time
      await API.UpdateCloseTime(
        newRiddle.rid,
        dayjs().format("YYYY/MM/DD HH:mm:ss")
      );

      alert("Congratulation! Your result is correct!");
    } else {
      console.log("enter wrong result");
      NewHistory["result"] = "F";
      alert("Sorry, Wrong answer,You lose your try.");
    }
    await API.AddNewHistory(NewHistory);
    setShow(false);
    props.setUpdate(true);
  };

  return (
    <>
      <Button disabled={disable} onClick={handleShow}>
        Have a try!
      </Button>
      {disable && (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip id="checkMessage">
              You are author or You already finished your chance
            </Tooltip>
          }
        >
          <span>
            <TiWarningOutline style={{ color: "red", fontSize: "small" }} />
          </span>
        </OverlayTrigger>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add your reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="justify-content-md-center">
              <Col md="auto">
                <h3>Remain Time</h3>
              </Col>

              <Col md="auto">
                <Form.Control
                  className="mb-3"
                  style={{ color: "red" }}
                  plaintext
                  readOnly
                  value={122222}
                />
              </Col>
            </Row>
            <Row>
              <Row md="auto">
                <h5>hint1:</h5>
              </Row>
              <Row md="auto">
                <h5>hint2:</h5>
              </Row>
              <Form.Group className="mb-3" controlId="answer">
                <Form.Label>Your Answer</Form.Label>
                <Form.Control
                  type="answer"
                  placeholder="Your answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSumbit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const OpenRData = (props) => {
  return (
    <>
      <td>{props.riddle.content}</td>
      <td>{props.riddle.difficulty}</td>
      <td>
        <Timer expiration={props.riddle.expiration} />
      </td>
    </>
  );
};

export { OpenRiddlesTable };
