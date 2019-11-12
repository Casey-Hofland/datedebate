import React, { Component } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { Link } from "react-router-dom";
import background from "../background.module.scss";
import "./Welcome.scss";

const baseURL = process.env.PUBLIC_URL;

class Welcome extends Component {
  backgroundToggle = () => {
    return (
      <select value={document.body.className} onChange={(e) => this.changeBackground(e)}>
        {Object.keys(background).map(style => <option key={style} value={background[style]}>{style.toString().replace(/\b\w/g, l => l.toUpperCase())}</option>)}
      </select>
    );
  }

  changeBackground = (event) => {
    const background = event.target.value;
    this.forceUpdate();
    this.props.changeBackground(background);
  }

  languageToggle = () => {
    if (!this.props.activeLanguage) return;

    return (
      <select value={this.props.activeLanguage.code} onChange={(e) => this.props.setActiveLanguage(e.target.value)}>
        {this.props.languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
      </select>
    );
  }

  render() {
    return (
      <div className="Welcome">
        <h1 className="Title"><Translate id="welcome" /></h1>
        <Link to={baseURL + "/setup"}><span><Translate id="start" /></span></Link>
        {this.backgroundToggle()}
        {this.languageToggle()}
        <div className="Rules Block">
          <h3><Translate id="rules.title" /></h3>
          <ol className="List">
            <li><Translate id="rules.rule1" /></li>
            <li><Translate id="rules.rule2" /></li>
            <li><Translate id="rules.rule3" /></li>
            <li><Translate id="rules.rule4" /></li>
            <li><Translate id="rules.rule5" /></li>
          </ol>
        </div>
      </div>
    );
  }
}

export default withLocalize(Welcome);