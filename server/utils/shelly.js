const logger = require("../logging/logger");

const setDevicePower = async (ipAddress, state) => {
  try {
    const url = `http://${ipAddress}/rpc/Switch.Set?id=0&on=${state ? "true" : "false"}`;
    const response = await fetch(url);
    const jsonResp = await response.json();
    logger.debug(`Response from '${url}':`, jsonResp);
    return jsonResp;
  } catch (err) {
    logger.error(`Error occured while setting device power for ${ipAddress}`, err);
  }
};

const getDeviceState = async (ipAddress) => {
  try {
    const url = `http://${ipAddress}/rpc/Switch.GetStatus?id=0`;
    const response = await fetch(url);
    const jsonResp = await response.json();
    return jsonResp;
  } catch (err) {
    logger.error(`Error occured while getting device status for ${ipAddress}`, err);
  }
};

module.exports = {
  setDevicePower,
  getDeviceState,
};
