const { parseString } = require('xml2js');
const fs = require('fs');
const pem = require('pem-file')
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
const { Certificate } = require('crypto');

const atosValidResponse = require('../lib/helpers/atosValidResponse');

function processAtosPaymentHandler(req, res) {

  var xml = fs.readFileSync('./app/tls/signed.xml').toString();
  // var option = {implicitTransforms:["http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"]};
  let X509;
  parseString(xml, (err, result) => {
    // console.log(util.inspect(result, false, null, true));
    // console.log();
    X509 = JSON.stringify(
      result.paymentManualConfirmation.Signature[0].KeyInfo[0].X509Data[0].X509Certificate[0]
    )
  });
  console.log('xml', xml);
  const isAtosResultValid = atosValidResponse(xml, X509);
  
  
  if (isAtosResultValid) {
    parseString(xml, (err, result) => {
      // console.log(util.inspect(result, false, null, true));
      // console.log(JSON.stringify(
      //   result.paymentManualConfirmation.Signature[0].KeyInfo[0].X509Data[0].X509Certificate[0]
      // ));
      const responseObj = result.paymentManualConfirmation.response[0].$;
      const { responseCode } = responseObj;
      const { transactionReference } = responseObj;
      const { amount } = responseObj;
      amount.toString();

      const pounds = amount.slice(0, -2);
      const pence = amount.substr(amount.length - 2);
      const amountInPounds = pounds + '.' + pence;

      console.log(transactionReference);
      
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
