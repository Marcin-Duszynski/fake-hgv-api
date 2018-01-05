const chai = require('chai');
const moment = require('moment');
const vehicle = require('../src/vehicle');

const should = chai.should();

describe('When vehicle data for selected registration is requested', () => {
  it('but identifier was not provided then http code 400 is returned.', (done) => {
    vehicle.main({ queryStringParameters: { } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(400);

      done();
    });
  });

  it('then vehicle json with replaced registration is returned.', (done) => {
    vehicle.main({ queryStringParameters: { identifier: '123' } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);

      responseBody.vehicle.should.have.property('vehicleIdentifier').eql('123');

      done();
    });
  });
});

describe('When vehicle data for registration NOHOLD1 is requested', () => {
  it('then vehicle json with replaced dates is returned.', (done) => {
    const tomorrow = moment(Date.now()).add(-1, 'y').format('DD/MM/YYYY');
    const registration = 'NOHOLD1';

    vehicle.main({ queryStringParameters: { identifier: registration } }, null, (error, response) => {
      response.should.have.property('statusCode').eql(200);
      response.should.have.property('body');

      const responseBody = JSON.parse(response.body);

      responseBody.vehicle.should.have.property('vehicleIdentifier').eql(registration);
      responseBody.vehicle.should.have.property('manufactureDate').eql(tomorrow);

      done();
    });
  });
});
