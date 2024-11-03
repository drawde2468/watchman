const Device = require("./device");
const { getDeviceState } = require("../utils/shelly");
const parseComparison = require("../utils/comparison");

class Fan extends Device {
  constructor(deviceConfig, mode$) {
    super(deviceConfig, mode$);
  }

  async checkState() {
    console.log(`Check state of ${this.name.toLowerCase()} at ${this.ipAddress}`);

    if (!this.mode) {
      return;
    }

    const expectedState = this.operatingProfiles.find((profile) => profile.mode === this.mode)?.state;
    console.log(`${this.name} at ${this.ipAddress} expected state: ${expectedState}`);

    if (this.state !== expectedState) {
      switch (expectedState) {
        case "on":
          this.turnOn();
          break;
        case "off":
          this.turnOff();
          break;
      }
    }

    const deviceState = await getDeviceState(this.ipAddress);
    const devicePower = deviceState.output ? "on" : "off";

    const actualState = this.stateProfiles.find((stateProfile) => stateProfile.state === devicePower).state;

    this.state = actualState;

    console.log(`${this.name} at ${this.ipAddress} Expected state: ${expectedState}, Actual state: ${actualState}`);
  }
}

module.exports = Fan;
