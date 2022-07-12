import {
  Button,
  Form,
  Row,
  Col,
  FloatingLabel,
  Container,
} from "react-bootstrap";
import { useState, useContext } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

import AuthContext from "./AuthProvider";
import API from "../API";

function RiddleForm(props) {
  const { auth } = useContext(AuthContext);

  const [riddle, setRiddle] = useState({
    content: "",
    hint1: "",
    hint2: "",
    duration: "",
    answer: "",
    difficulty: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    riddle["state"] = "open";
    riddle["createTime"] = dayjs().format("YYYY/MM/DD HH:mm:ss");
    riddle["closeTime"] = null;
    riddle["authorId"] = auth.id;
    await API.AddRiddle(riddle);
  };

  const handleChange = (e) => {
    setRiddle({
      ...riddle,
      difficulty: e.target.value,
    });
  };
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2>Add your Riddle</h2>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3 align-items-center">
            <Form.Group className="mb-3">
              <FloatingLabel label="Riddle Content">
                <Form.Control
                  type="text"
                  required={true}
                  value={riddle.content}
                  placeholder="Content"
                  onChange={(e) => {
                    setRiddle({
                      ...riddle,
                      content: e.target.value,
                    });
                  }}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Riddle hint1">
                <Form.Control
                  type="text"
                  required={true}
                  value={riddle.hint1}
                  onChange={(e) => {
                    setRiddle({
                      ...riddle,
                      hint1: e.target.value,
                    });
                  }}
                  placeholder="Riddle hint1"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Riddle hint2">
                <Form.Control
                  type="text"
                  required={true}
                  value={riddle.hint2}
                  onChange={(e) => {
                    setRiddle({
                      ...riddle,
                      hint2: e.target.value,
                    });
                  }}
                  placeholder="Riddle hint2"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Riddle answer">
                <Form.Control
                  type="text"
                  required={true}
                  value={riddle.answer}
                  onChange={(e) => {
                    setRiddle({
                      ...riddle,
                      answer: e.target.value,
                    });
                  }}
                  placeholder=" answer"
                />
              </FloatingLabel>
            </Form.Group>

            <Col>
              <Form.Group className="mb-3">
                <FloatingLabel label="duration">
                  <Form.Control
                    type="text"
                    required={true}
                    value={riddle.duration}
                    placeholder="Riddle duration"
                    onChange={(e) => {
                      setRiddle({
                        ...riddle,
                        duration: e.target.value,
                      });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Select
                  aria-label="difficulty"
                  value={riddle.difficulty}
                  onChange={handleChange}
                >
                  <option>Choose the difficulty</option>
                  <option value="easy"> Easy </option>
                  <option value="medium"> Medium</option>
                  <option value="hard"> Hard</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Button variant="primary" type="submit">
              Save
            </Button>{" "}
            &nbsp;
            <Button
              variant="danger"
              onClick={() => {
                props.setShowForm((r) => !r);
              }}
            >
              cancel
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}

export { RiddleForm };
