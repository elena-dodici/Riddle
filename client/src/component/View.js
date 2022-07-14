import { LogInForm } from "./Authentication";
import { Container, Row, Col } from "react-bootstrap";
import { UserNavBar, VisitNavBar } from "./NavBar";
import { useState, useEffect } from "react";
import API from "../API";
import { LoginRiddlesTable } from "./LoginRiddlesTable";
import RiddlesTable from "./RiddlesTable";
import { RiddleForm } from "./RiddleForm";
import { MyRiddlesTable } from "./MyRiddlesTable";
import { Ranking } from "./Ranking";

const LoginRoute = (props) => {
  return <LogInForm message={props.message} logIn={props.logIn} />;
};

const RiddleFormRoute = (props) => {
  return (
    <Container className="App">
      <Row>
        <Col>
          <h1>Enter Riddle</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <RiddleForm />
        </Col>
      </Row>
    </Container>
  );
};

const HomePage = (props) => {
  const [Riddles, setRiddles] = useState([]);
  const [usersOrderList, setUsersOrderList] = useState([]);

  const getUsersList = async () => {
    const OrderUsesList = await API.GetUserOrderedList();
    setUsersOrderList(OrderUsesList);
  };

  const getAllRiddles = async () => {
    const Riddles = await API.getAllRiddles();
    setRiddles(Riddles);
  };

  //run once when mount
  useEffect(() => {
    getAllRiddles();
    getUsersList();
  }, []);

  return (
    <Container className="App">
      <Row>
        {props.loggedIn ? (
          <UserNavBar
            logout={props.loggedOut}
            link={props.link}
            info={props.info}
            userList={usersOrderList}
          ></UserNavBar>
        ) : (
          <VisitNavBar></VisitNavBar>
        )}
      </Row>

      <Row>
        {props.loggedIn ? (
          <LoginRiddlesTable Riddles={Riddles}></LoginRiddlesTable>
        ) : (
          <RiddlesTable Riddles={Riddles}></RiddlesTable>
        )}
      </Row>
    </Container>
  );
};

const DefaultRoute = () => {
  return (
    <Row>
      <h1>No Page found</h1>
    </Row>
  );
};

const RankingRoute = (props) => {
  const [usersOrderList, setUsersOrderList] = useState([]);

  const getUsersList = async () => {
    const OrderUsesList = await API.GetUserOrderedList();
    setUsersOrderList(OrderUsesList);
  };

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <Container>
      <Row>
        {props.loggedIn ? (
          <UserNavBar
            logout={props.loggedOut}
            link={props.link}
            info={props.info}
            userList={usersOrderList}
          ></UserNavBar>
        ) : (
          <VisitNavBar></VisitNavBar>
        )}
      </Row>
      <Row>
        <Ranking userList={usersOrderList}></Ranking>;
      </Row>
    </Container>
  );
};

const RiddleRoute = (props) => {
  return (
    <Container>
      <Row>
        <UserNavBar
          logout={props.loggedOut}
          link={props.link}
          info={props.info}
        ></UserNavBar>
      </Row>
      <Row>
        <MyRiddlesTable></MyRiddlesTable>
      </Row>
    </Container>
  );
};

export {
  LoginRoute,
  HomePage,
  DefaultRoute,
  RiddleFormRoute,
  RiddleRoute,
  RankingRoute,
};
