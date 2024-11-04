const { getDeviceState, setDevicePower } = require("../utils/shelly");
const logger = require("../logging/logger");

class Device {
  constructor(deviceConfig, mode$) {
    this.logger = logger;
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
    const watts = deviceState.apower;

    this.logger.debug(`${this.name} at ${this.ipAddress} drawing ${watts} watts`);

    const actualState = this.stateProfiles.find((stateProfile) => {
      const comparison = parseComparison(stateProfile.watts);
      return comparison(watts);
    }).state;

    this.state = actualState;

    this.logger.debug(
      `${this.name} at ${this.ipAddress} Expected state: ${expectedState}, Actual state: ${actualState}`
    );
  }

  modeSubscription() {
    return this.mode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  async turnOn() {
    this.logger.debug(`Set ${this.name.toLowerCase()} power on at ${this.ipAddress}`);
    await setDevicePower(this.ipAddress, true);
  }

  async turnOff() {
    this.logger.debug(`Set ${this.name.toLowerCase()} power off at ${this.ipAddress}`);
    await setDevicePower(this.ipAddress, false);
  }

  // Todo
  //   onError(err) {
  //     this.logger.error(`Error occurred in ${this.name} at ${this.ipAddress}: ${err}`);
  //     this.mode$.next("e");
  //   }
}

module.exports = Device;
