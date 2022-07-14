import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import React, { useContext } from "react";

import "../App.css";
import AuthContext from "./AuthProvider";

const VisitNavBar = () => {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand className="me-auto">Riddle List</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link href="/ranking">Ranking</Nav.Link>
          <Nav.Link href="/"> Main Page</Nav.Link>
          <Nav.Link href="/login">Log In</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

const UserNavBar = (props) => {
  const { auth } = useContext(AuthContext);

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand className="me-auto">Your Riddle List</Navbar.Brand>
        <Nav className="me-auto">{`Welcome! ${auth.name}`}</Nav>
      </Container>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto">
          <NavDropdown title="User Info" id="collasible-nav-dropdown">
            <NavDropdown.Item href={props.link}>{props.info}</NavDropdown.Item>
            <NavDropdown.Item href="/ranking">Ranking</NavDropdown.Item>
            <NavDropdown.Item onClick={props.logout}>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export { VisitNavBar, UserNavBar };
