import {
  Alert,
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useState } from "react";

const LogInForm = (props) => {
  const [username, seteusername] = useState("");
  const [password, setpassword] = useState("");
  //require a comma after @
  const reg =
    "^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{1,3}$";

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    props.logIn(credentials);
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center">
        <Col>
          <Card style={{ width: "20rem" }}>
            <Form className="rounded p-4 p-sm-3" onSubmit={handleSubmit}>
              <h1 className="mb-3 ">Please sign in</h1>
              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={username}
                  placeholder="Enter Email"
                  onChange={(e) => seteusername(e.target.value)}
                  required
                  pattern={reg}
                  title='valid Email need at least one "." after@'
                />
                <Form.Text className="text-muted">
                  {" "}
                  We will never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  test
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required={true}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
            {props.message && (
              <Col>
                <Alert
                  variant={props.message.type}
                  onClose={() => props.setMessage("")}
                  dismissible
                >
                  {props.message.msg}
                </Alert>
              </Col>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

function LogoutNavBar(props) {
  return (
    <Row>
      <Col>
        <Button variant="outline-primary" onClick={props.logout}>
          Logout
        </Button>
      </Col>
    </Row>
  );
}

export { LogInForm, LogoutNavBar };
