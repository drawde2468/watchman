const { ReplaySubject, timer } = require("rxjs");
const { getDeviceState, setDevicePower } = require("../utils/shelly");
const { sendMessage } = require("../utils/telegram");

class Device {
  constructor(deviceConfig, mode$) {
    this.name = deviceConfig.name;
    this.ipAddress = deviceConfig.ipAddress;
    this.operatingProfiles = deviceConfig.operatingProfiles;
    this.stateProfiles = deviceConfig.stateProfiles;
    this.statePollInterval = deviceConfig.statePollInterval || 20000;
    this.mode$ = mode$;
    this.modeSub = this.modeSubscription();
    this.mode = null;
    this.state = null;
    this.stateListener = this.listenForStateChange();
  }

  listenForStateChange() {
    return timer(0, this.statePollInterval).subscribe(() => {
      this.checkState();
    });
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
    const watts = deviceState.apower;

    console.log(`${this.name} at ${this.ipAddress} drawing ${watts} watts`);

    const actualState = this.stateProfiles.find((stateProfile) => {
      const comparison = parseComparison(stateProfile.watts);
      return comparison(watts);
    }).state;

    this.state = actualState;

    console.log(`${this.name} at ${this.ipAddress} Expected state: ${expectedState}, Actual state: ${actualState}`);
  }
  modeSubscription() {
    return this.mode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  async turnOn() {
    const msg = `Turn on ${this.name.toLowerCase()} at ${this.ipAddress}`
    console.log(msg);
    sendMessage(msg);
    await setDevicePower(this.ipAddress, true);
  }

  async turnOff() {
    const msg = `Turn off ${this.name.toLowerCase()} at ${this.ipAddress}`
    console.log(msg);
    sendMessage(msg);
    await setDevicePower(this.ipAddress, false);
  }
}

module.exports = Device;
