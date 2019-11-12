import React, { Component } from "react";
import sizeMe from "react-sizeme";
import "./Timer.scss";

class Timer extends Component {
  constructor(props) {
    super(props);

    if (!this.props.startTime) {
      throw new Error("this.props.startTime in Timer is undefined");
    }

    this.state = {
      time: this.props.startTime,
      timerSize: {},
    }

    this.halfTime = this.props.startTime / 2;
    this.pieAnimation = `
      .Pie {
        animation: bg 0ms step-end ${this.props.startTime}ms;
        animation-fill-mode: forwards;
      }

      .Pie::before {
        animation: spin ${this.halfTime}ms linear 2,
              bg ${this.halfTime}ms step-start ${this.halfTime}ms;
      }
    `;
  }

  componentDidMount = () => {
    this.resizeTimer();
    window.addEventListener('resize', this.resizeTimer);
    this.startTimer();
  }

  componentWillUnmount = () => {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.resizeTimer);
  }

  resizeTimer = () => {
    let width = this.props.size.width;
    width *= 0.8;
    if (width > 240) width = 240;
    const vertMargin = width * 0.2;

    const timerSize = {
      width: `${width}px`,
      height: `${width}px`,
      margin: `${vertMargin}px auto`,
    };

    this.setState({ timerSize: timerSize });
  }

  startTimer = () => {
    const timeAtStart = new Date().getTime();

    this.timer = setInterval(() => {
      const currentTime = new Date().getTime();
      let tempTime = this.props.startTime - (currentTime - timeAtStart);

      if (tempTime <= 0) {
        this.setState({ time: 0 });
        clearInterval(this.timer);
        if (this.props.hasEnded) {
          this.props.hasEnded();
        }
        return;
      }

      this.setState({ time: tempTime });
    }, 50);
  }

  resetTimer = () => {
    clearInterval(this.timer);
    this.setState({ time: this.props.startTime });
    this.startTimer();
  }

  convertTime = (ms) => {
    return " " + new Date(ms + 999).toISOString().slice(15, 19);
  }

  render() {
    return (
      <div className="Wrapper">
        <div className="Timer" id="T" ref={this.timerRef} style={this.state.timerSize}>
          <style>{this.pieAnimation}</style>
          <span className="Pie"></span>
          <h1 className="Display">{this.convertTime(this.state.time)}</h1>
        </div>
      </div>
    );
  }
}

export default sizeMe()(Timer);