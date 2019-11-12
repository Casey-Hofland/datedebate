import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class RouterUpdater extends Component {
  componentWillMount = () => {
    this.unlisten = this.props.history.listen((location, action) => {
      this.scrollTop();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  scrollTop = () => {
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.body.scrollTop = 0; // For Safari (look who's got to be special...)
  }

  render() {
    return (
      <div className="Router">{this.props.children}</div>
    );
  }
}

export default withRouter(RouterUpdater);