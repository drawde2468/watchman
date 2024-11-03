const { ReplaySubject } = require("rxjs");
const Fan = require("./devices/fan");
const Printer = require("./devices/printer");

class DevicesController {
  constructor(devicesConfig) {
    this.mode$ = new ReplaySubject();
    this.devices = [];
    this.#createDevices(devicesConfig);
  }

  #createDevices(config) {
    config.devices.forEach((deviceConfig) => {
      switch (deviceConfig.type) {
        case "printer":
          this.devices.push(new Printer(deviceConfig, this.mode$));
          break;
        case "fan":
          this.devices.push(new Fan(deviceConfig, this.mode$));
          break;
      }
    });
  }
}

const config = require("./devicesConfig.json");
const devicesController = new DevicesController(config);

exports.DevicesController = DevicesController;
