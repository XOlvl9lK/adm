import DeviceDetector = require('device-detector-js');

const deviceDetector = new DeviceDetector();

export const getBrowserVersionByUserAgent = (userAgent: string) => {
  const device = deviceDetector.parse(userAgent);
  const name = device.client.name;
  const version = device.client.version;
  return `${name}/${version.split('.').length === 2 ? `${version}.0.0` : version}`;
};
