'use strict';

function isOperaMini(ua) {
  ua = ua || global.navigator.userAgent;
  return ua.indexOf('Opera Mini') > -1;
}

function isAndroidFirefox(ua) {
  ua = ua || global.navigator.userAgent;
  return ua.indexOf('Android') > -1 && ua.indexOf('Firefox') > -1;
}

function getIEVersion(ua) {
  ua = ua || global.navigator.userAgent;

  if (ua.indexOf('MSIE') !== -1) {
    return parseInt(ua.replace(/.*MSIE ([0-9]+)\..*/, '$1'), 10);
  } else if (/Trident.*rv:11/.test(ua)) {
    return 11;
  }

  return null;
}

function isHTTPS(protocol) {
  protocol = protocol || global.location.protocol;

  return protocol === 'https:';
}

module.exports = {
  isOperaMini: isOperaMini,
  isAndroidFirefox: isAndroidFirefox,
  getIEVersion: getIEVersion,
  isHTTPS: isHTTPS
};
