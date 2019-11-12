import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Setup.scss";

const baseURL = process.env.PUBLIC_URL;

const minPlayers = 2, maxPlayers = 8;

class Setup extends Component {
  constructor(props) {
    super(props);

    this.state = this.initialState();
  }

  initialState = () => {
    return {
      settings: {
        ...this.props.settings,
      },
      errors: {
        minPlayers: false,
        maxPlayers: false,
        nameEmpty: false,
        nameDouble: false,
      },
    }
  }

  resetErrors = () => {
    this.setState({ errors: this.initialState().errors });
  }

  updateName = (event, index) => {
    let tempSettings = this.state.settings;
    tempSettings.players[index].name = event.target.value;
    this.setState({ settings: tempSettings });
    this.resetErrors();
  }

  removePlayer = (event) => {
    let tempErrors = this.state.errors;
    tempErrors.minPlayers |= this.state.settings.players.length <= minPlayers;
    this.setState({ errors: tempErrors });
    if (tempErrors.minPlayers) return;

    let tempSettings = this.state.settings;
    tempSettings.players.pop();
    this.setState({ settings: tempSettings });

    this.resetErrors();
  }

  addPlayer = (event) => {
    let tempErrors = this.state.errors;
    tempErrors.maxPlayers |= this.state.settings.players.length >= maxPlayers;
    this.setState({ errors: tempErrors });
    if (tempErrors.maxPlayers) return;

    let tempSettings = this.state.settings;
    tempSettings.players.push(this.props.newPlayer());
    this.setState({ settings: tempSettings });

    this.resetErrors();
  }

  updateRounds = (event) => {
    let tempSettings = this.state.settings;
    tempSettings.rounds = parseInt(event.target.value);
    this.setState({ settings: tempSettings });

    this.resetErrors();
  }

  updateTime = (event) => {
    let tempSettings = this.state.settings;
    tempSettings.time = parseInt(event.target.value);
    this.setState({ settings: tempSettings });

    this.resetErrors();
  }

  resetSettings = () => {
    this.setState({ settings: this.props.initialSettings() });
    this.resetErrors();
  }

  validateSettings = (event) => {
    let tempErrors = this.state.errors;

    let tempNameEmpty = tempErrors.nameEmpty;
    let tempNameDouble = tempErrors.nameDouble;

    if (tempNameEmpty || tempNameDouble) return;

    const settings = this.state.settings;

    const names = settings.players.map(player => player.name);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      tempNameEmpty |= (name === null || name.match(/^ *$/) !== null);
      tempNameDouble |= names.indexOf(name) !== i;

      if (tempNameEmpty && tempNameDouble) break;
    }

    tempErrors.nameEmpty = tempNameEmpty;
    tempErrors.nameDouble = tempNameDouble;
    this.setState({ errors: tempErrors });

    if (tempNameEmpty || tempNameDouble) return;

    this.props.updateSettings(settings);
    this.props.history.push("/game");
  }

  render() {
    return (
      <div className="Setup">
        <h1 className="Title">Debate Setup:</h1>

        <div className="Settings Block">
          <h3>Settings:</h3>
          <div className="Names">
            {
              this.state.settings.players.map((player, i) => {
                return <input key={i} type="text" name={`name${(i)}`}
                  value={player.name} placeholder={`Speler ${i + 1}`}
                  onChange={(e) => this.updateName(e, i)} />
              })
            }

            <div className="ListButtons">
              <button id="RemovePlayer" onClick={this.removePlayer}><span>-</span></button>
              <button id="AddPlayer" onClick={this.addPlayer}><span>+</span></button>
            </div>

            <h5 className="Error" style={{ display: ((this.state.errors.minPlayers) ? "inherit" : "none") }}>*Please niet minder dan {minPlayers} spelers ^_^</h5>
            <h5 className="Error" style={{ display: ((this.state.errors.maxPlayers) ? "inherit" : "none") }}>*Please niet meer dan {maxPlayers} spelers ^_^</h5>

          </div>

          <select value={this.state.settings.rounds} onChange={this.updateRounds}>
            <option value="5">5 Vragen</option>
            <option value="4">4 Vragen</option>
            <option value="3">3 Vragen</option>
            <option value="2">2 Vragen</option>
            <option value="1">1 Vraag</option>
          </select>

          <select value={this.state.settings.time} onChange={this.updateTime} >
            <option value="15000">15 Seconden</option>
            <option value="30000">30 Seconden</option>
            <option value="60000">1 Minuut</option>
            <option value="120000">2 Minuten</option>
            <option value="180000">3 Minuten</option>
            <option value="240000">4 Minuten</option>
            <option value="300000">5 Minuten</option>
          </select>

          <button onClick={this.resetSettings}><span>Reset</span></button>
        </div>

        <h5 className="Error" style={{ display: ((this.state.errors.nameEmpty) ? "inherit" : "none") }}>*Please geen lege naamvelden ^_^</h5>
        <h5 className="Error" style={{ display: ((this.state.errors.nameDouble) ? "inherit" : "none") }}>*Please geen dubbele namen ^_^</h5>
        <button onClick={this.validateSettings}><span>Start Debat</span></button>
        <Link to={baseURL} onClick={(e) => this.props.updateSettings(this.state.settings)}><span>Terug</span></Link>
      </div>
    );
  }
}

export default Setup;