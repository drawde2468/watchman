const { ReplaySubject, timer } = require("rxjs");
const { getDeviceState, setDevicePower } = require("../utils/shelly");

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
          // Sleep for 2 seconds to allow the fan to turn on
          break;
        case "off":
          this.turnOff();
          // Sleep for 2 seconds to allow the fan to turn off
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
    console.log(`Turn on ${this.name.toLowerCase()} at ${this.ipAddress}`);
    await setDevicePower(this.ipAddress, true);
  }

  async turnOff() {
    console.log(`Turn off ${this.name.toLowerCase()} at ${this.ipAddress}`);
    await setDevicePower(this.ipAddress, false);
  }
}

module.exports = Device;