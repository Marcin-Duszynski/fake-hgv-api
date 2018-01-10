const vehicleDateTemplate = require('./data/vehicle.json');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports.main = (event, context, callback) => {
  let vehicleDate = vehicleDateTemplate;
  let response = null;
  let processingError = false;

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && 'identifier' in event.queryStringParameters) {
    const { identifier } = event.queryStringParameters;
    console.info(`Request for vehicle ${identifier} received.`);

    switch (identifier) {
      case 'IYKIBAAAAAA604976':
      case 'IEADBAAAAAA509816':
        processingError = true;
        break;
      case 'NOHIST1':
      case 'NGFIUJAAAAA219118':
        vehicleDate.vehicle.registrationDate = moment(Date.now()).add(-1, 'y').add(1, 'M').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'NOHIST1';
        break;
      case 'NOHIST2':
      case 'NGFIUJAAAAA219119':
        vehicleDate.vehicle.registrationDate = moment(Date.now()).add(-1, 'y').add(1, 'M').add(1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'NOHIST2';
        break;
      case 'NOHIST3':
      case 'NGFIUJAAAAA219120':
        vehicleDate.vehicle.registrationDate = moment(Date.now()).add(-1, 'y').add(1, 'M').add(-1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'NOHIST3';
        break;
      case 'NOHOLD1':
      case 'NGFIUJAAAAA219116':
        vehicleDate.vehicle.registrationDate = moment(Date.now()).add(-1, 'y').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'NOHOLD1';
        break;
      case 'NOHOLD2':
      case 'NGFIUJAAAAA219117':
        vehicleDate.vehicle.registrationDate = moment(Date.now()).add(-1, 'y').add(1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'NOHOLD2';
        break;
      case 'EXMONTH':
      case 'NGFIUJAAAAA219115':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXMONTH';
        break;
      case 'EXMONM1':
      case 'NGFIUJAAAAA219114':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').add(-1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXMONM1';
        break;
      case 'EXMONP1':
      case 'NGFIUJAAAAA219113':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'M').add(1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXMONP1';
        break;
      case 'EXYESTE':
      case 'NGFIUJAAAAA219112':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(-1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXYESTE';
        break;
      case 'EXTOMOR':
      case 'NGFIUJAAAAA219111':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).add(1, 'd').format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXTOMOR';
        break;
      case 'EXTODAY':
      case 'NGFIUJAAAAA219110':
        vehicleDate.vehicle.testCertificateExpiryDate = moment(Date.now()).format('DD/MM/YYYY');
        vehicleDate.vehicle.vehicleIdentifier = 'EXTODAY';
        break;
      default:
        try {
          vehicleDate = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/data/vehicle/${identifier}.json`)));
        } catch (err) {
          vehicleDate = {};
        }
        break;
    }

    if (processingError) {
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Request processing error.',
        }),
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify(vehicleDate),
      };
    }
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
