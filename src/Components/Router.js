import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { Translate, withLocalize } from "react-localize-redux";
import background from "./background.module.scss";
import lang from "./translations/lang.json";
import "./Router.scss";

import RouterUpdater from "./RouterUpdater";
import Welcome from "./Welcome/Welcome";
import Setup from "./Setup/Setup";
import Game from "./Game/Game";

const baseURL = process.env.PUBLIC_URL;

class Router extends Component {
  constructor(props) {
    super(props);

    this.props.initialize({
      languages: [
        { name: "English", code: "en" },
        { name: "Nederlands", code: "nl" },
      ],
      translation: lang,
      options: {
        renderToStaticMarkup,
        renderInnerHTML: true,
        defaultLanguage: "nl",
      }
    });

    this.state = this.initialSettings();
  }

  initialSettings = () => {
    return {
      players: [
        this.newPlayer(),
        this.newPlayer(),
      ],
      rounds: 3,
      time: 120000,
    }
  }

  newPlayer = () => {
    return {
      name: "",
    }
  }

  componentDidMount = () => {
    this.setBackground(Object.values(background)[0]);

    this.setVH();
    window.addEventListener("resize", this.setVH);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.setVH);
  }

  setBackground = (className) => {
    document.body.className = className;
  }

  setVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty(`--vh`, `${vh}px`);
  }

  updateSettings = (settings) => {
    this.setState(settings);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <RouterUpdater>
            <Switch>
              <Route path={baseURL + "/game"} render={(props) => <Game settings={this.state} {...props} />} />
              <Route path={baseURL + "/setup"} render={(props) => <Setup settings={this.state} updateSettings={this.updateSettings}
                initialSettings={this.initialSettings} newPlayer={this.newPlayer} {...props} />} />
              <Route path={baseURL} render={(props) => <Welcome changeBackground={this.setBackground} {...props} />} />
            </Switch>
          </RouterUpdater>
        </BrowserRouter>
        <footer>
          <Translate id="credit.icons.creator" /> <a href="https://www.freepik.com/" title="Freepik">Freepik</a> <Translate id="credit.icons.source" /> <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> <Translate id="credit.icons.license" /> <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a>
        </footer>
      </div>
    );
  }
}

export default withLocalize(Router);
