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
import { useContext, useState, useEffect } from "react";
import AuthContext from "./AuthProvider";
import API from "../API";
import dayjs from "dayjs";
import "./table.css";

const OpenRiddlesTable = (props) => {
  //get info every second
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
      <h2> Open Riddles</h2>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Content</th>
            <th>difficulty</th>
            <th>Remaining Time</th>
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
              setUpdate={props.setUpdate}
              closeRiddle={props.closeRiddle}
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
        API.UpdateStateByRid(props.riddle.rid, "expire");

        props.setUpdate(true);
        return 0;
      } else return rem;
    } else {
      return 0;
    }
  };

  const remTime = calcRemTime();

  const setRiddle = (nr) => {
    props.setOpenRiddles((or) => {
      let newR = [...or];
      newR[props.index] = nr;
      return newR;
    });
  };
  return (
    <tr>
      <OpenRData key={props.riddle.rid} remTime={remTime} {...props} />

      <td>
        <OpenRAction
          setRiddle={setRiddle}
          remTime={remTime}
          {...props}
        ></OpenRAction>
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
    if (prposedRes === realanswer) return true;
    else return false;
  };

  const assistCheck = () => {
    for (let hist of props.riddle.history) {
      if (hist.repId === auth.id) return true;
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
      answerTime: dayjs(),
      answer: answer,
    };

    try {
      await API.AddNewHistory(NewHistory);
      if (result === true) {
        //update score

        newRiddle.state = "close";

        //add in history front
        newRiddle.history.push(NewHistory);

        //add points in user front
        if (newRiddle.difficulty === "easy") {
          let pointRow = await API.getUserById(auth.id);
          pointRow.points += 1;
        } else if (newRiddle.difficulty === "medium") {
          let pointRow = await API.getUserById(auth.id);
          pointRow.points += 2;
        } else if (newRiddle.difficulty === "hard") {
          let pointRow = await API.getUserById(auth.id);
          pointRow.points += 3;
        }
        alert("Congratulation! Your result is correct!");
      } else {
        alert("Sorry, Wrong answer,You lose your chance.");
      }
    } catch (err) {
      if (err === "Closed") alert("Sorry,this one already closed");
    }

    setShow(false);
    props.setUpdate(true);
  };

  const handleShowHint1 = () => {
    if (props.remTime > 0 && props.remTime < 0.5 * props.riddle.duration)
      return true;
  };
  const showHint1 = handleShowHint1();

  const handleShowHint2 = () => {
    if (props.remTime > 0 && props.remTime < 0.25 * props.riddle.duration)
      return true;
  };
  const showHint2 = handleShowHint2();

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
        show={show && props.remTime >= 0}
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
                  value={
                    props.remTime
                      ? Math.floor(props.remTime / 60)
                          .toString()
                          .padStart(2, "0") +
                        " : " +
                        (props.remTime % 60).toString().padStart(2, "0")
                      : "You are first replier"
                  }
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              duration:{props.riddle.duration}
            </Row>
            <Row>
              <Row md="auto">
                <h6>Hint1:</h6>
                {showHint1 ? (
                  <p>{props.riddle.hint1}</p>
                ) : (
                  <p>Will see when remain time less than 50%</p>
                )}
              </Row>
              <Row md="auto">
                <h6>Hint2:</h6>
                {showHint2 ? (
                  <p>{props.riddle.hint2}</p>
                ) : (
                  <p>Will see when remain time less than 25%</p>
                )}
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
                <Form.Text className="text-muted">
                  Only one chance allowed
                </Form.Text>
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
      <td className="column-left">{props.riddle.content}</td>
      <td>{props.riddle.difficulty}</td>
      <td>
        {props.remTime > 0
          ? Math.floor(props.remTime / 60)
              .toString()
              .padStart(2, "0") +
            " : " +
            (props.remTime % 60).toString().padStart(2, "0")
          : "No response"}
      </td>
    </>
  );
};

export { OpenRiddlesTable };
