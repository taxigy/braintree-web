'use strict';

var Client = require('../../../src/client/client');
var VERSION = process.env.npm_package_version;
var fake = require('../../helpers/fake');
var BraintreeError = require('../../../src/lib/braintree-error');

describe('Client', function () {
  describe('bad instantiation', function () {
    it('throws an error when instantiated with no arguments', function (done) {
      try {
        new Client(); // eslint-disable-line no-new
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        done();
      }
    });

    it('throws an error when instantiated with no gatewayConfiguration', function (done) {
      try {
        new Client(); // eslint-disable-line no-new
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal(BraintreeError.types.INTERNAL);
        expect(err.code).to.equal('CLIENT_MISSING_GATEWAY_CONFIGURATION');
        expect(err.message).to.equal('Missing gatewayConfiguration.');
        done();
      }
    });

    it('throws an error when instantiated with invalid assetsUrl', function (done) {
      try {
        new Client({ // eslint-disable-line no-new
          gatewayConfiguration: {
            assetsUrl: 'http://example.com'
          }
        });
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal(BraintreeError.types.MERCHANT);
        expect(err.code).to.equal('CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN');
        expect(err.message).to.equal('assetsUrl property is on an invalid domain.');
        done();
      }
    });

    it('throws an error when instantiated with invalid clientApiUrl', function (done) {
      try {
        new Client({ // eslint-disable-line no-new
          gatewayConfiguration: {
            clientApiUrl: 'http://example.com'
          }
        });
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal(BraintreeError.types.MERCHANT);
        expect(err.code).to.equal('CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN');
        expect(err.message).to.equal('clientApiUrl property is on an invalid domain.');
        done();
      }
    });

    it('throws an error when instantiated with invalid configUrl', function (done) {
      try {
        new Client({ // eslint-disable-line no-new
          gatewayConfiguration: {
            configUrl: 'http://example.com'
          }
        });
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal(BraintreeError.types.MERCHANT);
        expect(err.code).to.equal('CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN');
        expect(err.message).to.equal('configUrl property is on an invalid domain.');
        done();
      }
    });

    it('throws an error when instantiated with invalid braintreeApi URL', function (done) {
      try {
        new Client({ // eslint-disable-line no-new
          gatewayConfiguration: {
            braintreeApi: {
              url: 'http://example.com'
            }
          }
        });
      } catch (err) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal(BraintreeError.types.MERCHANT);
        expect(err.code).to.equal('CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN');
        expect(err.message).to.equal('braintreeApi URL is on an invalid domain.');
        done();
      }
    });
  });

  describe('getConfiguration', function () {
    it('has an immutable configuration', function () {
      var first, second;
      var client = new Client(fake.configuration());

      first = client.getConfiguration();
      first.gatewayConfiguration.yes = 'yes';

      second = client.getConfiguration();
      expect(second.gatewayConfiguration.yes).not.to.exist;
    });

    it('has analytics metadata', function () {
      var client = new Client(fake.configuration());

      var actual = client.getConfiguration();

      expect(actual.analyticsMetadata.sdkVersion).to.equal(VERSION);
      expect(actual.analyticsMetadata.merchantAppId).to.equal('http://fakeDomain.com');
      expect(actual.analyticsMetadata.sessionId).to.equal('fakeSessionId');
    });
  });

  describe('toJSON', function () {
    it('returns the same object as getConfiguration', function () {
      var client = new Client(fake.configuration());

      expect(client.toJSON()).to.deep.equal(client.getConfiguration());
    });

    it('returns the value of getConfiguration when getConfiguration is overwritten', function () {
      var client = new Client(fake.configuration());
      var newConfiguration = {foo: 'bar'};

      expect(client.toJSON()).to.deep.equal(client.getConfiguration());

      client.getConfiguration = function () {
        return newConfiguration;
      };

      expect(client.toJSON()).to.equal(newConfiguration);
      expect(client.toJSON()).to.equal(client.getConfiguration());
    });
  });

  describe('request', function () {
    it('calls callback with an error when passed no HTTP method', function (done) {
      var client = new Client(fake.configuration());

      client.request({
        endpoint: 'payment_methods'
      }, function (err, data) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_OPTION_REQUIRED');
        expect(err.message).to.equal('options.method is required when making a request.');
        expect(data).not.to.exist;

        done();
      });
    });

    it('calls callback with an error when passed no endpoint', function (done) {
      var client = new Client(fake.configuration());

      client.request({
        method: 'get'
      }, function (err, data) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_OPTION_REQUIRED');
        expect(err.message).to.equal('options.endpoint is required when making a request.');
        expect(data).not.to.exist;

        done();
      });
    });

    it('calls callback with an error when passed a bogus API', function (done) {
      var client = new Client(fake.configuration());

      client.request({
        method: 'get',
        endpoint: 'foo',
        api: 'garbage'
      }, function (err, data) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_OPTION_INVALID');
        expect(err.message).to.equal('options.api is invalid.');
        expect(data).not.to.exist;

        done();
      });
    });

    it('calls callback with an error when passed an empty string as an API', function (done) {
      var client = new Client(fake.configuration());

      client.request({
        method: 'get',
        endpoint: 'foo',
        api: ''
      }, function (err, data) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_OPTION_INVALID');
        expect(err.message).to.equal('options.api is invalid.');
        expect(data).not.to.exist;

        done();
      });
    });

    it('calls callback with an error when API is braintreeApi and braintreeApi is not available', function (done) {
      var client;
      var configuration = fake.configuration();

      delete configuration.gatewayConfiguration.braintreeApi;
      client = new Client(configuration);

      client.request({
        method: 'get',
        endpoint: 'foo',
        api: 'braintreeApi'
      }, function (err, data) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('BRAINTREE_API_ACCESS_RESTRICTED');
        expect(err.message).to.equal('Your access is restricted and cannot use this part of the Braintree API.');
        expect(data).not.to.exist;

        done();
      });
    });

    it('calls driver with client for source in _meta if source is not provided', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {_meta: {source: 'client'}}
      }));
    });

    it('calls driver with full URL with GET if specified and no API is specified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        method: 'get',
        url: 'https://braintreegateway.com/v1/payment_methods'
      }));
    });

    it('calls driver with full URL with GET if specified and API is clientApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'clientApi',
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        method: 'get',
        url: 'https://braintreegateway.com/v1/payment_methods'
      }));
    });

    it('calls driver with full URL with GET if specified and API is braintreeApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'braintreeApi',
        endpoint: 'status',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        method: 'get',
        url: 'https://example.braintree-api.com/status'
      }));
    });

    it('calls driver with full URL with POST if specified and API is unspecified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'payment_methods',
        method: 'post'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        url: 'https://braintreegateway.com/v1/payment_methods',
        method: 'post'
      }));
    });

    it('calls driver with full URL with POST if specified and API is clientApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'clientApi',
        endpoint: 'payment_methods',
        method: 'post'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        url: 'https://braintreegateway.com/v1/payment_methods',
        method: 'post'
      }));
    });

    it('calls driver with full URL with POST if specified and API is unspecified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'braintreeApi',
        endpoint: 'fooboo',
        method: 'post'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        url: 'https://example.braintree-api.com/fooboo',
        method: 'post'
      }));
    });

    it('calls driver with library version when API is unspecified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {braintreeLibraryVersion: 'braintree/web/' + VERSION}
      }));
    });

    it('calls driver with library version when API is clientApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'clientApi',
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {braintreeLibraryVersion: 'braintree/web/' + VERSION}
      }));
    });

    it('calls driver with no library version when API is braintreeApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'braintreeApi',
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).not.to.have.been.calledWith(this.sandbox.match({
        data: {braintreeLibraryVersion: 'braintree/web/' + VERSION}
      }));
    });

    it('calls driver with sessionId in _meta when API is unspecified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {_meta: {sessionId: client.getConfiguration().analyticsMetadata.sessionId}}
      }));
    });

    it('calls driver with sessionId in _meta when API is clientApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'clientApi',
        endpoint: 'payment_methods',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {_meta: {sessionId: client.getConfiguration().analyticsMetadata.sessionId}}
      }));
    });

    it('calls driver with client for source in _meta if source is not provided', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        method: 'post',
        endpoint: 'payment_methods'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {_meta: {source: 'client'}}
      }));
    });

    it('calls driver with specified source in _meta', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        method: 'post',
        endpoint: 'payment_methods',
        data: {
          _meta: {source: 'custom source'}
        }
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {_meta: {source: 'custom source'}}
      }));
    });

    it("doesn't set headers when API is unspecified", function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        endpoint: 'cool',
        method: 'get'
      }, function () {});

      expect(client._request).not.to.have.been.calledWith(this.sandbox.match({
        headers: this.sandbox.match.defined
      }));
    });

    it("doesn't set headers when API is clientApi", function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'clientApi',
        endpoint: 'cool',
        method: 'get'
      }, function () {});

      expect(client._request).not.to.have.been.calledWith(this.sandbox.match({
        headers: this.sandbox.match.defined
      }));
    });

    it('sets headers when API is braintreeApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request');

      client.request({
        api: 'braintreeApi',
        endpoint: 'cool',
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        headers: {
          'Braintree-Version': '2016-10-07',
          Authorization: 'Bearer fakeToken'
        }
      }));
    });

    it('passes through timeout to driver', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        endpoint: 'payment_methods',
        timeout: 4000,
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        timeout: 4000
      }));
    });

    it('passes through data to driver when API is unspecified', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        endpoint: 'payment_methods',
        data: {some: 'stuffs'},
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {some: 'stuffs'}
      }));
    });

    it('passes through data to driver when API is clientApi', function () {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        api: 'clientApi',
        endpoint: 'payment_methods',
        data: {some: 'stuffs'},
        method: 'get'
      }, function () {});

      expect(client._request).to.have.been.calledWith(this.sandbox.match({
        data: {some: 'stuffs'}
      }));
    });

    it('passes through unmodified data to driver when API is braintreeApi', function () {
      var actualData;
      var expectedData = {foo: 'boo'};
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request', function () {});

      client.request({
        api: 'braintreeApi',
        endpoint: 'tokens',
        data: expectedData,
        method: 'get'
      }, function () {});

      actualData = client._request.getCall(0).args[0].data;

      expect(actualData).to.equal(expectedData);
      expect(expectedData).to.deep.equal({foo: 'boo'});
    });

    it('returns BraintreeError for authorization if driver has a 403', function (done) {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request').yields('error', null, 403);

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function (err, data, status) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_AUTHORIZATION_INSUFFICIENT');
        expect(err.message).to.equal('The authorization used has insufficient privileges.');
        expect(data).to.be.null;
        expect(status).to.equal(403);
        done();
      });
    });

    it('returns BraintreeError for rate limiting if driver has a 429', function (done) {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request').yields('error', null, 429);

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function (err, data, status) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('CLIENT_RATE_LIMITED');
        expect(err.message).to.equal('You are being rate-limited; please try again in a few minutes.');
        expect(data).to.be.null;
        expect(status).to.equal(429);
        done();
      });
    });

    it('returns BraintreeError if driver times out', function (done) {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request').yields('timeout', null, -1);

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function (err, data, status) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('NETWORK');
        expect(err.code).to.equal('CLIENT_REQUEST_TIMEOUT');
        expect(err.message).to.equal('Request timed out waiting for a reply.');
        expect(data).to.be.null;
        expect(status).to.equal(-1);
        done();
      });
    });

    it('returns BraintreeError if driver has a 4xx', function (done) {
      var errorDetails = {error: 'message'};
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request').yields(errorDetails, null, 422);

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function (err, data, status) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('NETWORK');
        expect(err.code).to.equal('CLIENT_REQUEST_ERROR');
        expect(err.message).to.equal('There was a problem with your request.');
        expect(err.details.originalError).to.equal(errorDetails);
        expect(data).to.be.null;
        expect(status).to.equal(422);
        done();
      });
    });

    it('returns BraintreeError if driver has a 5xx', function (done) {
      var client = new Client(fake.configuration());

      this.sandbox.stub(client, '_request').yields('This is a network error message', null, 500);

      client.request({
        endpoint: 'payment_methods',
        method: 'get'
      }, function (err, data, status) {
        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('NETWORK');
        expect(err.code).to.equal('CLIENT_GATEWAY_NETWORK');
        expect(err.message).to.equal('Cannot contact the gateway at this time.');
        expect(data).to.be.null;
        expect(status).to.equal(500);
        done();
      });
    });
  });
});
