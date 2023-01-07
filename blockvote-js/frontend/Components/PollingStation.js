import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react";

const PollingStation = (props) => {
  const [candidate1URL, changeCandidate1URL] = useState(
    "https://cdn3.iconfinder.com/data/icons/feather-5/24/loader-1024.png"
  );

  const [candidate2URL, changeCandidate2URL] = useState(
    "https://cdn3.iconfinder.com/data/icons/feather-5/24/loader-1024.png"
  );

  const [showResults, changeResultsDisplay] = useState(false);
  const [buttonStatus, changeButtonStatus] = useState(false);
  const [candidate1Votes, changeVote1] = useState(0);
  const [candidate2Votes, changeVote2] = useState(0);
  const [prompt, changePrompt] = useState("--");

  useEffect(() => {
    const getInfo = async () => {
      let promptName = localStorage.prompt;

      let voteCount = await props.viewMethod("getVotes", {
        prompt: promptName,
      });

      await props.viewMethod("getUrl", {
        prompt: localStorage.getItem("prompt"),
        name: localStorage.getItem("Candidate1"),
      });
      await props.viewMethod("getUrl", {
        prompt: localStorage.getItem("prompt"),
        name: localStorage.getItem("Candidate2"),
      });

      changePrompt(localStorage.getItem("prompt"));

      let didUserVote = await props.viewMethod("didParticipate", {
        prompt: localStorage.getItem("prompt"),
        user: props.wallet.accountId,
      });

      changeResultsDisplay(didUserVote);
      changeButtonStatus(didUserVote);
    };
  }, [!showResults]);

  const addVote = async (index) => {
    changeButtonStatus(true);
    await props.callMethod("addVote", {
      prompt: localStorage.getItem("prompt"),
      index: index,
    });

    await props.callMethod("recordUser", {
      prompt: localStorage.getItem("prompt"),
      user: props.wallet.accountId,
    });

    let voteCount = await props.viewmethod("getVotes", {
      prompt: localStorage.getItem("prompt"),
    });

    changeVote1(voteCount[0]);
    changeVote2(voteCount[1]);
    alert("Thanks for voting");

    changeResultsDisplay(true);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col
            className="justify-content-center d-flex"
            style={{ width: "20vw" }}
          >
            <Container>
              <Row style={{ marginTop: "5vh", backgroundColor: "#c4c4c4" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "3vw",
                  }}
                >
                  <img
                    style={{ height: "35vh", width: "20vw" }}
                    src={candidate1URL}
                  />
                </div>
              </Row>
              {showResults ? (
                <Row
                  className="justify-content-center d-flex"
                  style={{ marginTop: "5vh" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyCoontent: "center",
                      fontSize: "8vw",
                      padding: "10px",
                      backgroundColor: "#c4c4c4",
                    }}
                  >
                    {candidate1Votes}
                  </div>
                </Row>
              ) : null}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default PollingStation;
