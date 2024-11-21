const Device = require("./device");
const { getDeviceState } = require("../utils/shelly");
const parseComparison = require("../utils/comparison");

class Printer extends Device {
  constructor(deviceConfig, mode$) {
    super(deviceConfig, mode$);
  }

  async checkState() {
    this.logger.debug(`Check state of ${this.name.toLowerCase()} at ${this.ipAddress}`);
    const watts = (await getDeviceState(this.ipAddress)).apower;

    const currentProfile = this.operatingProfiles.find(
      (profile) =>
        profile.state ===
        this.stateProfiles.find((stateProfile) => {
          const comparison = parseComparison(stateProfile.watts);
          return comparison(watts);
        }).state
    );

    if (currentProfile.mode != this.mode) {
      this.logger.info(`${this.name} utilizing ${watts} watts. Setting mode to: ${currentProfile.name}`);
      this.mode$.next(currentProfile.mode);
    }
  }
}

module.exports = Printer;
