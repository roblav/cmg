const { parseString } = require('xml2js');
const fs = require('fs');

const atosValidResponse = require('../lib/helpers/atosValidResponse');

function processAtosPaymentHandler(req, res) {

  var xml = fs.readFileSync('./app/tls/signed.xml').toString()
  // var doc = new dom().parseFromString(xml)
  // const atosResult = Buffer.from(req.body.base64Response, 'base64');
  // const isAtosResultValid = atosValidResponse(atosResult.toString());
  const isAtosResultValid = atosValidResponse(xml);

  if (isAtosResultValid) {
    parseString(xml, (err, result) => {
      // console.log(util.inspect(result, false, null, true));
      console.log(result);
      const responseObj = result.paymentManualConfirmation.response[0].$;
      const { responseCode } = responseObj;
      const { transactionReference } = responseObj;
      const { amount } = responseObj;
      amount.toString();

      const pounds = amount.slice(0, -2);
      const pence = amount.substr(amount.length - 2);
      const amountInPounds = pounds + '.' + pence;
      
      if (responseCode === '00') {
        // res.redirect(`/my-payments/make-payment-success/${transactionReference}/${amountInPounds}`);
        res.send(transactionReference, amountInPounds);
      } else {
        res.redirect('/my-payments/make-payment-failure');
      }
    });
  } else {
    res.redirect('/my-payments/make-payment-failure');
  }
}

module.exports = {
  processAtosPaymentHandler,
};
