import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext } from "react";
import API from "./API";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  LoginRoute,
  HomePage,
  DefaultRoute,
  RiddleFormRoute,
  RiddleRoute,
} from "./component/View";
import AuthContext from "./component/AuthProvider";

function App() {
  const { setAuth } = useContext(AuthContext);
  const [loggedIn, setloggedIn] = useState(false);
  const [message, setmessage] = useState("");

  //check authentication once fresh page
  useEffect(() => {
    const checkAuth = async () => {
      let user = await API.GetUserInfo();
      setloggedIn(true);

      setAuth({
        id: user.id,
        email: user.username,
        name: user.name,
        surname: user.surname,
      });
    };

    checkAuth();
  }, []);

  //checklogin
  const handleLogin = async (credential) => {
    try {
      let user = await API.logIn(credential);
      setloggedIn(true);

      setAuth({
        id: user.id,
        email: user.username,
        name: user.name,
        surname: user.surname,
      });

      setmessage({ msg: `Welcome,${user.name}`, type: "success" });
    } catch (err) {
      setmessage({ msg: "incorrect password or email", type: "danger" });
    }
  };

  const handleLogout = async () => {
    const res = await API.logOut();
    if (res) {
      setAuth({});
      setloggedIn(false);
      setmessage("");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              loggedOut={handleLogout}
              loggedIn={loggedIn}
              link="/myInfo"
              info="My Riddle info"
            />
          }
        />

        <Route
          path="/myInfo"
          element={
            loggedIn ? (
              <RiddleRoute
                loggedOut={handleLogout}
                link="/"
                info="Return Main Page"
              />
            ) : (
              <LoginRoute logIn={handleLogin} message={message} />
            )
          }
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <LoginRoute logIn={handleLogin} message={message} />
            )
          }
        />

        <Route
          path="/add"
          element={
            loggedIn ? (
              <RiddleFormRoute loggedIn={loggedIn} />
            ) : (
              <LoginRoute logIn={handleLogin} message={message} />
            )
          }
        />

        <Route path="*" element={<DefaultRoute />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
