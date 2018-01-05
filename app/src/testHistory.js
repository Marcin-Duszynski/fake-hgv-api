let vehicleTestHistoryDate = require('./data/testHistory.json');
const moment = require('moment');

module.exports.main = (event, context, callback) => {
  let response = null;

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && 'identifier' in event.queryStringParameters) {
    const registration = event.queryStringParameters.identifier;
    console.info(`Request for vehicle ${registration} received.`);

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
