import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Game.scss";
import questions from "./questions.json";

import Timer from "./Timer/Timer";
import TimerPing from "./timerPing.mp3";

const baseURL = process.env.PUBLIC_URL;

const emojis = [
  "happy",
  "angry",
  "cute",
  "sad",
  "laughing",
  "crying",
  "thinking",
  "frustrated",
  "cool",
  "heart",
];

const emojiNormal = {
  padding: "10%",
  maxWidth: "80%",
  maxHeight: "80%",
}, emojiSelected = {
  padding: "2.5%",
  maxWidth: "95%",
  maxHeight: "95%",
  outline: "medium double black",
};

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        ...this.props.settings,
      },
      render: this.questionPage,
      questions: JSON.parse(JSON.stringify(questions)),
      question: { question: "", image: "", },
      emojis: null,
      playerIndex: 0,
      reactionIndexArr: [],
      emptyReactionErr: false,
    }

    this.timerPing = new Audio(TimerPing);
  }

  componentDidMount = () => {
    this.preloadImages();
    this.initializePlayers();
    this.resetReactionIndexArr();
    this.randomQuestion();
  }

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  }

  resetErrors = () => {
    this.setState({ emptyReactionErr: false });
  }

  preloadImages = () => {
    let tempQuestions = this.state.questions;

    for (let i = 0; i < tempQuestions.length; i++) {
      const img = new Image();
      img.className = "Image";
      img.src = baseURL + "/Questions/" + tempQuestions[i].image + ".jpg";
      img.alt = tempQuestions[i].image;
      tempQuestions[i].image = img;
    }

    let tempEmojis = JSON.parse(JSON.stringify(emojis));

    for (let i = 0; i < tempEmojis.length; i++) {
      const img = new Image();
      img.src = baseURL + "/Emojis/" + tempEmojis[i] + ".gif";
      img.alt = tempEmojis[i];
      tempEmojis[i] = img;
    }

    this.setState({ questions: tempQuestions, emojis: tempEmojis });
  }

  initializePlayers = () => {
    let tempSettings = this.state.settings;

    for (let i = 0; i < tempSettings.players.length; i++) {
      tempSettings.players[i].results = [];
    }

    this.setState({ settings: tempSettings });
  }

  resetReactionIndexArr = () => {
    let tempReactionIndexArr = [];
    for (let i = 0; i < this.state.settings.players.length - 1; i++) {
      tempReactionIndexArr.push(-1);
    }

    this.setState({ reactionIndexArr: tempReactionIndexArr });
  }

  currentPlayer = () => {
    return this.state.settings.players[this.state.playerIndex];
  }

  waitingPlayers = () => {
    return this.state.settings.players.filter((p, i) => i !== this.state.playerIndex);
  }

  nextPage = () => {
    this.scrollTop();
    this.resetErrors();

    if (this.state.render === this.questionPage) {
      this.setState({ render: this.reactionPage });
      return;
    }

    if (!this.nextPlayer() || !this.randomQuestion()) return;

    this.setState({ render: this.questionPage });
  }

  scrollTop = () => {
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.body.scrollTop = 0; // For Safari (look who's got to be special...)
  }

  randomQuestion = () => {
    let tempQuestions = this.state.questions;

    if (tempQuestions.length <= 0) {
      alert("Geen vragen meer :(");
      this.setState({ render: this.resultPage });
      return false;
    }

    let index = Math.floor(Math.random() * tempQuestions.length);
    let question = tempQuestions.splice(index, 1)[0];
    this.setState({ questions: tempQuestions, question: question });

    return true;
  }

  timerHasEnded = () => {
    this.timerPing.play();
    this.timeout = setTimeout(() => this.nextPage(), 1000);
  }

  setReaction = (playerI, reactionI) => {
    let tempReactionIndexArr = this.state.reactionIndexArr;
    tempReactionIndexArr[playerI] = reactionI;
    this.setState({ reactionIndexArr: tempReactionIndexArr });

    this.resetErrors();
  }

  validateReactions = () => {
    let tempReactionIndexArr = this.state.reactionIndexArr;

    if (!tempReactionIndexArr.every((i) => (i >= 0 && i < emojis.length))) {
      this.setState({ emptyReactionErr: true });
      return;
    }

    let tempSettings = this.state.settings;

    const result = {
      question: this.state.question,
      reactions: tempReactionIndexArr,
    }

    tempSettings.players[this.state.playerIndex].results.push(result);

    this.setState({ settings: tempSettings });
    this.resetReactionIndexArr();
    this.nextPage();
  }

  nextPlayer = () => {
    let tempPlayerIndex = this.state.playerIndex;

    tempPlayerIndex++;
    if (tempPlayerIndex >= this.state.settings.players.length) {
      tempPlayerIndex = 0;

      let tempSettings = this.state.settings;
      tempSettings.rounds--;
      this.setState({ settings: tempSettings });

      if (tempSettings.rounds <= 0) {
        alert("Geen rondes meer :)");
        this.setState({ render: this.resultPage });
        return false;
      }
    }

    this.setState({ playerIndex: tempPlayerIndex });
    return true;
  }

  questionPage = () => {
    return (
      <div className="Question">
        <h1 className="Title">{this.currentPlayer().name}</h1>

        <div className="Block">
          <h3>{this.state.question.question}</h3>
          <img className={this.state.question.image.className} src={this.state.question.image.src} alt={this.state.question.image.alt} />
          <button onClick={(e) => { this.randomQuestion(); this.scrollTop(); }}><span>Andere Vraag</span></button>
          <button onClick={this.nextPage}><span>Klaar!</span></button>
        </div>

        <Timer key={new Date()} startTime={this.state.settings.time} hasEnded={this.timerHasEnded} />
      </div>
    );
  }

  reactionPage = () => {
    return (
      <div className="Reaction">
        {
          this.waitingPlayers().map((player, playerI) => {
            return (
              <div key={playerI} className="Block">
                <h3>{player.name}, kies een Reactie:</h3>
                <div className="Reactions">
                  {
                    this.state.emojis.map((emoji, emojiI) => {
                      const key = [playerI, emojiI].join("_");
                      const style = (emojiI === this.state.reactionIndexArr[playerI]) ? emojiSelected : emojiNormal;
                      return <img key={key} style={style} src={emoji.src} alt={emoji.alt} onClick={(e) => this.setReaction(playerI, emojiI)} />;
                    })
                  }
                </div>
              </div>
            );
          })
        }
        <h5 className="Error" style={{ display: ((this.state.emptyReactionErr) ? "inherit" : "none") }}>*Please geen lege reacties ^_^</h5>
        <button onClick={this.validateReactions}><span>Klaar!</span></button>
      </div>
    );
  }

  resultPage = () => {
    return (
      <div className="Results">
        {
          this.state.settings.players.map((player, playerI) => {
            return (
              <div key={playerI} className="Block">
                <h3>{player.name} results:</h3>
                {
                  player.results.map((result, resultI) => {
                    return (
                      <table key={playerI + "_" + resultI} className="Result">
                        <tbody>
                          <tr><th colSpan="2">{result.question.question}</th></tr>
                          {
                            result.reactions.map((emoji, emojiI) => {
                              const key = [playerI, resultI, emojiI].join("_");
                              const players = this.state.settings.players;
                              const reacter = (playerI <= emojiI) ? players[(emojiI + 1)] : players[emojiI];
                              const img = this.state.emojis[emoji];
                              return (
                                <tr key={key}>
                                  <td className="Name">{reacter.name}</td>
                                  <td className="Emoji"><img src={img.src} alt={img.alt} /></td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
  
  render() {
    return (
      <div className="Game">
        {this.state.render()}
        <Link to={baseURL}><span>Be&#235;indig Debat</span></Link>
      </div>
    );
  }
}

export default Game;