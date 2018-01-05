const chai = require('chai');
const moment = require('moment');
const testHistory = require('../src/testHistory');

const should = chai.should();

describe('When vehicle test history for selected registration is requested', () => {
  it('but identifier was not provided then http code 400 is returned.', (done) => {
    testHistory.main({ queryStringParameters: { } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(400);

      done();
    });
  });
});

describe('When vehicle test history for vehicle with registration EXTODAY is requested', () => {
  it('then testHistory json with replaced data is returned.', (done) => {
    const today = new Date();
    const registration = 'EXTODAY';

    testHistory.main({ queryStringParameters: { identifier: registration } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);
      responseBody.should.have.property('testHistory');

      responseBody.testHistory[0].should.have.property('vehicleIdentifierAtTest').eql(registration);
      responseBody.testHistory[0].should.have.property('testCertificateExpiryDateAtTest').eql(today.toLocaleDateString('en-GB'));

      done();
    });
  });
});

describe('When vehicle test history for vehicle with registration EXTOMOR is requested', () => {
  it('then testHistory json with replaced data is returned.', (done) => {
    const tomorrow = moment(Date.now()).add(1, 'd').format('DD/MM/YYYY');
    const registration = 'EXTOMOR';

    testHistory.main({ queryStringParameters: { identifier: registration } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);
      responseBody.should.have.property('testHistory');

      responseBody.testHistory[0].should.have.property('vehicleIdentifierAtTest').eql(registration);
      responseBody.testHistory[0].should.have.property('testCertificateExpiryDateAtTest').eql(tomorrow);

      done();
    });
  });
});

describe('When vehicle test history for vehicle with registration EXYESTE is requested', () => {
  it('then testHistory json with replaced data is returned.', (done) => {
    const tomorrow = moment(Date.now()).add(-1, 'd').format('DD/MM/YYYY');
    const registration = 'EXYESTE';

    testHistory.main({ queryStringParameters: { identifier: registration } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);
      responseBody.should.have.property('testHistory');

      responseBody.testHistory[0].should.have.property('vehicleIdentifierAtTest').eql(registration);
      responseBody.testHistory[0].should.have.property('testCertificateExpiryDateAtTest').eql(tomorrow);

      done();
    });
  });
});

describe('When vehicle test history for registration P8X7L16 is requested', () => {
  it('then test history json from template is returned.', (done) => {
    const registration = 'P8X7L16';

    testHistory.main({ queryStringParameters: { identifier: registration } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);
      responseBody.should.have.property('testHistory');

      responseBody.testHistory[0].should.have.property('vehicleIdentifierAtTest').eql(registration);
      responseBody.testHistory[0].should.have.property('testType').eql('ANNUAL PSV SMALL');

      done();
    });
  });
});
