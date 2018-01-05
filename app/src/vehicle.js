const vehicleDateTemplate = require('./data/vehicle.json');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports.main = (event, context, callback) => {
  let vehicleDate = vehicleDateTemplate;
  let response = null;

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && 'identifier' in event.queryStringParameters) {
    const registration = event.queryStringParameters.identifier;
    console.info(`Request for vehicle ${registration} received.`);

    vehicleDate.vehicle.vehicleIdentifier = registration;

    switch (registration) {
      case 'NOHIST1':
        vehicleDate.vehicle.manufactureDate = moment(Date.now()).add(-1, 'y').add(1, 'M').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        break;
      case 'NOHIST2':
        vehicleDate.vehicle.manufactureDate = moment(Date.now()).add(-1, 'y').add(1, 'M').add(1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        break;
      case 'NOHIST3':
        vehicleDate.vehicle.manufactureDate = moment(Date.now()).add(-1, 'y').add(1, 'M').add(-1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        break;
      case 'NOHOLD1':
        vehicleDate.vehicle.manufactureDate = moment(Date.now()).add(-1, 'y').format('DD/MM/YYYY');
        break;
      case 'NOHOLD2':
        vehicleDate.vehicle.manufactureDate = moment(Date.now()).add(-1, 'y').add(1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXMONTH':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').format('DD/MM/YYYY');
        break;
      case 'EXMONM1':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').add(-1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXMONP1':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').add(1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXYESTE':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(-1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXTOMOR':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXTODAY':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        break;
      default:
        try {
          vehicleDate = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/data/vehicle/${registration}.json`)));
        } catch (err) {
          vehicleDate = {};
        }
        break;
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(vehicleDate),
    };
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Vehicle identifier is missing.',
      }),
    };
  }

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
