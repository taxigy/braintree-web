'use strict';

var clientToken;
var tokenizationKey = 'development_testing_merchant_id';
var constants = require('../../src/lib/constants');

function configuration() {
  return {
    gatewayConfiguration: {
      environment: 'development',
      configUrl: 'https://braintreegateway.com/config',
      clientApiUrl: 'https://braintreegateway.com',
      creditCards: {
        supportedGateways: [
          {
            name: 'clientApi'
          }
        ]
      },
      applePayWeb: {
        merchantIdentifier: 'com.example.test-merchant-identifier',
        supportedNetworks: ['visa', 'amex', 'mastercard']
      },
      braintreeApi: {
        accessToken: 'fakeToken',
        url: 'https://example.braintree-api.com'
      },
      paypal: {
        assetsUrl: 'https://example.com:9292',
        displayName: 'Name'
      },
      analytics: {
        url: 'https://braintreegateway.com/analytics'
      },
      visaCheckout: {
        apikey: 'gwApikey',
        externalClientId: 'gwExternalClientId',
        supportedCardTypes: ['Visa', 'MasterCard', 'Discover', 'American Express']
      }
    },
    analyticsMetadata: {
      sdkVersion: constants.VERSION,
      merchantAppId: 'http://fakeDomain.com',
      sessionId: 'fakeSessionId',
      platform: constants.PLATFORM,
      source: constants.SOURCE,
      integration: constants.INTEGRATION,
      integrationType: constants.INTEGRATION
    },
    authorization: tokenizationKey
  };
}

clientToken = configuration().gatewayConfiguration;
clientToken.authorizationFingerprint = 'encoded_auth_fingerprint';
clientToken = btoa(JSON.stringify(clientToken));

module.exports = {
  tokenizationKey: tokenizationKey,
  clientToken: clientToken,
  configuration: configuration
};
