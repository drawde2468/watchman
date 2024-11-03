const Device = require("./device");
const { getDeviceState } = require("../utils/shelly");
const parseComparison = require("../utils/comparison");
const { sendMessage } = require("../utils/telegram");

class Printer extends Device {
  constructor(deviceConfig, mode$) {
    super(deviceConfig, mode$);
  }

  async checkState() {
    console.log(`Check state of ${this.name.toLowerCase()} at ${this.ipAddress}`);
    const watts = (await getDeviceState(this.ipAddress)).apower;

    console.log(watts);

    const currentProfile = this.operatingProfiles.find(
      (profile) =>
        profile.state ===
        this.stateProfiles.find((stateProfile) => {
          const comparison = parseComparison(stateProfile.watts);
          return comparison(watts);
        }).state
    );

    if (currentProfile.mode != this.mode){
      sendMessage(`Setting mode to: ${currentProfile.name}`)
      this.mode$.next(currentProfile.mode);
    }

  }
}

module.exports = Printer;
