import "regenerator-runtime/runtime";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { EducationalText, SignInPrompt, SignOutButton } from "./ui-components";

//React bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Card, Button, Row } from "react-bootstrap";

//react router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { Nav } from "react-bootstrap";

//custom componnts
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import PollingStation from "./Components/PollingStation";

export default function App({ isSignedIn, contractId, wallet }) {
  const signInFun = () => {
    wallet.signIn();
  };

  const signOutFun = () => {
    wallet.signOut();
  };

  const callMethod = async (methodName, args = {}) => {
    await wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const viewMethod = async (methodName, args = {}) => {
    return await wallet.viewMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const getPrompts = async () => {
    let output = await viewMethod("getAllPrompts");
    console.log(output);
    return output;
  };

  const changeCandidatesFunction = async (prompt) => {
    let namePair = await viewMethod("getCandidatePair", { prompt: prompt });
    await localStorage.setItem("Candidate1", namePair[0]);
    await localStorage.setItem("Candidate2", namePair[1]);
    await localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "pollingStation");
  };

  const displayHome = () => {
    if (isSignedIn) {
      return (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                callMethod={callMethod}
                viewMethod={viewMethod}
                getPrompts={getPrompts}
                changeCandidates={changeCandidatesFunction}
              />
            }
          ></Route>
          <Route
            path="/newPoll"
            element={
              <NewPoll
                callMethod={callMethod}
                viewMethod={viewMethod}
                getPrompts={getPrompts}
              />
            }
          ></Route>
          <Route
            path="/pollingStation"
            element={
              <PollingStation callMethod={callMethod} viewMethod={viewMethod} />
            }
          ></Route>
        </Routes>
      );
    } else {
      return (
        <Container>
          <Row className="justify-content-center d-flex">
            <Card style={{ marginTop: "5vh", width: "30vh" }}>
              <Container>
                <Row>Hey! Please Sign In :D</Row>
                <Row className="justify-content-center d-flex">
                  <Button onClick={signInFun}>Login</Button>
                </Row>
              </Container>
            </Card>
          </Row>
        </Container>
      );
    }
  };

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={
                "https://i.pinimg.com/564x/2c/ea/07/2cea075f1ffcebcbb0878d52f9885ec9.jpg"
              }
              height="100"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link disabled={!isSignedIn} href="/newpoll">
                New Poll
              </Nav.Link>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {displayHome()}
    </Router>
  );
}
