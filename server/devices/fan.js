const Device = require("./device");
const { getDeviceState } = require("../utils/shelly");

class Fan extends Device {
  constructor(deviceConfig, mode$) {
    super(deviceConfig, mode$);
  }

  async checkState() {
    this.logger.debug(`Check state of ${this.name.toLowerCase()} at ${this.ipAddress}`);

    if (!this.mode) {
      this.logger.debug(`Mode not set yet for ${this.name} at ${this.ipAddress}`);
      return;
    }

    const expectedState = this.operatingProfiles.find((profile) => profile.mode === this.mode)?.state;
    this.logger.debug(
      `${this.name} at ${this.ipAddress} expected state: ${expectedState}, last known state: ${this.state}`
    );

    if (this.state !== expectedState) {
      this.logger.info(`${this.name} at ${this.ipAddress} state does not match expected. Turning off/on`);
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
    this.logger.debug(`${this.name} at ${this.ipAddress} current power set to: ${devicePower}`);

    const actualState = this.stateProfiles.find((stateProfile) => stateProfile.state === devicePower).state;

    this.state = actualState;

    this.logger.debug(
      `${this.name} at ${this.ipAddress} Expected state: ${expectedState}, Actual state: ${actualState}`
    );
  }
}

module.exports = Fan;
