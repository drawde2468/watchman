const setDevicePower = async (ipAddress, state) => {
  try {
    const response = await fetch(`http://${ipAddress}/rpc/Switch.Set?id=0&on=${state ? "true" : "false"}`);
    const jsonResp = await response.json();
    console.log(jsonResp);
    return jsonResp;
  } catch (err) {
    console.error(err);
  }
};

const getDeviceState = async (ipAddress) => {
  try {
    const response = await fetch(`http://${ipAddress}/rpc/Switch.GetStatus?id=0`);
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  setDevicePower,
  getDeviceState,
};
