import React, { Component } from "react";
import Particle from "particle-api-js";
import sizeMe from "react-sizeme";

import Wheel from "./components/Wheel";

const particle = new Particle();

const DEVICE_ID = process.env.REACT_APP_DEVICE_ID;
const TOKEN = process.env.REACT_APP_PARTICLE_TOKEN;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const GOOGLE_SHEET_TOKEN = process.env.REACT_APP_GOOGLE_SHEET_TOKEN;

class App extends Component {
  state = { isSpinning: false, label: null, value: null };

  componentDidMount() {
    particle
      .getEventStream({ deviceId: DEVICE_ID, auth: TOKEN })
      .then(stream => {
        stream.on("event", async event => {
          if (event.name === "SPINNING") {
            this.setState({ isSpinning: true });
          } else if (event.name === "WHEEL_VALUE") {
            const values = await this.loadLabels();
            const index = parseInt(event.data) - 1;

            this.setState({
              value: event.data,
              label: values[index] || event.data,
              isSpinning: false
            });
          }
        });
      });
  }

  loadLabels = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/friends!a1:a26?key=${GOOGLE_SHEET_TOKEN}`
    ).then(res => res.json());

    return data.values;
  };

  render() {
    return (
      <Wheel
        size={this.props.size}
        isSpinning={this.state.isSpinning}
        label={this.state.label}
        value={this.state.value}
      />
    );
  }
}

export default sizeMe({
  monitorHeight: true,
  monitorWidth: true
})(App);
