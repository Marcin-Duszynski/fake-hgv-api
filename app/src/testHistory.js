const vehicleTestHistoryDateTemplate = require('./data/testHistory.json');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports.main = (event, context, callback) => {
  let vehicleTestHistoryDate = vehicleTestHistoryDateTemplate;
  let response = null;

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && 'identifier' in event.queryStringParameters) {
    const { identifier } = event.queryStringParameters;
    console.info(`Request for vehicle ${identifier} received.`);

    const registration = getRegistrationForVin(identifier);

    vehicleTestHistoryDate.testHistory.forEach((test) => {
      test.vehicleIdentifierAtTest = registration;
    });

    switch (registration) {
      case 'NOHIST1':
      case 'NOHIST2':
      case 'NOHIST3':
      case 'NOHOLD1':
      case 'NOHOLD2':
        vehicleTestHistoryDate = {};
        break;
      case 'EXMONTH':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).add(1, 'M').format('DD/MM/YYYY');
        break;
      case 'EXMONM1':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).add(1, 'M').add(-1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXMONP1':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).add(1, 'M').add(1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXYESTE':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).add(-1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXTOMOR':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).add(1, 'd').format('DD/MM/YYYY');
        break;
      case 'EXTODAY':
        vehicleTestHistoryDate.testHistory[0].testCertificateExpiryDateAtTest = moment(Date.now()).format('DD/MM/YYYY');
        break;
      default:
        try {
          vehicleTestHistoryDate = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/data/testHistory/${registration}.json`)));
        } catch (err) {
          console.error(`Unknown vehicle. Provided registration ${registration}. Error ${err}`);
          vehicleTestHistoryDate = {};
        }
        break;
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(vehicleTestHistoryDate),
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

function getRegistrationForVin(identifier) {
  switch (identifier) {
    case 'NOHIST1':
    case 'NGFIUJAAAAA219120':
      identifier = 'NOHIST1';
      break;
    case 'NOHIST2':
    case 'NGFIUJAAAAA219119':
      identifier = 'NOHIST2';
      break;
    case 'NOHIST3':
    case 'NGFIUJAAAAA219118':
      identifier = 'NOHIST3';
      break;
    case 'NOHOLD1':
    case 'NGFIUJAAAAA219116':
      identifier = 'NOHOLD1';
      break;
    case 'NOHOLD2':
    case 'NGFIUJAAAAA219117':
      identifier = 'NOHOLD2';
      break;
    case 'EXMONTH':
    case 'NGFIUJAAAAA219115':
      identifier = 'EXMONTH';
      break;
    case 'EXMONM1':
    case 'NGFIUJAAAAA219114':
      identifier = 'EXMONM1';
      break;
    case 'EXMONP1':
    case 'NGFIUJAAAAA219113':
      identifier = 'EXMONP1';
      break;
    case 'EXYESTE':
    case 'NGFIUJAAAAA219112':
      identifier = 'EXYESTE';
      break;
    case 'EXTOMOR':
    case 'NGFIUJAAAAA219111':
      identifier = 'EXTOMOR';
      break;
    case 'EXTODAY':
    case 'NGFIUJAAAAA219110':
      identifier = 'EXTODAY';
      break;
    default:
      break;
  }

  return identifier;
}
