import { ListGroup, Badge, Col, Container, Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Ranking = (props) => {
  const renderFunction = () => {
    let renderjsx = [];
    for (let i = 0; i < props.userList.length; i++) {
      renderjsx.push(
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          key={i}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Name : {props.userList[i].name}</div>
          </div>
          <Badge bg="primary" pill>
            Score : {props.userList[i].point}
          </Badge>
        </ListGroup.Item>
      );
    }

    return renderjsx;
  };

  return (
    <Container className="d-flex vh-80">
      <Row className="m-auto align-self-center">
        <Col>
          <Card style={{ width: "40rem" }}>
            <h2 className="mb-3 ">Our Top Three</h2>
            <ListGroup as="ol" numbered>
              {renderFunction()}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { Ranking };
