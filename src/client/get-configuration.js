'use strict';

var BraintreeError = require('../lib/error');
var request = require('./request');
var uuid = require('../lib/uuid');
var constants = require('../lib/constants');
var createAuthorizationData = require('../lib/create-authorization-data');
var errors = require('./errors');

function getConfiguration(options, callback) {
  var configuration, authData, attrs, configUrl;
  var sessionId = uuid();
  var analyticsMetadata = {
    merchantAppId: global.location.host,
    platform: constants.PLATFORM,
    sdkVersion: constants.VERSION,
    source: constants.SOURCE,
    integration: constants.INTEGRATION,
    integrationType: constants.INTEGRATION,
    sessionId: sessionId
  };

  try {
    authData = createAuthorizationData(options.authorization);
  } catch (err) {
    callback(new BraintreeError(errors.INVALID_AUTHORIZATION));
    return;
  }
  attrs = authData.attrs;
  configUrl = authData.configUrl;

  attrs._meta = analyticsMetadata;
  attrs.braintreeLibraryVersion = constants.BRAINTREE_LIBRARY_VERSION;

  request({
    url: configUrl,
    method: 'GET',
    data: attrs
  }, function (err, response) {
    if (err) {
      callback(new BraintreeError({
        type: errors.GATEWAY_NETWORK.type,
        code: errors.GATEWAY_NETWORK.code,
        message: errors.GATEWAY_NETWORK.message,
        details: err
      }));
      return;
    }

    configuration = {
      authorization: options.authorization,
      analyticsMetadata: analyticsMetadata,
      gatewayConfiguration: response
    };

    callback(null, configuration);
  });
}

module.exports = {
  getConfiguration: getConfiguration
};
