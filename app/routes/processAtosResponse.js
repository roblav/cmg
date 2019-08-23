const { parseString } = require('xml2js');
const fs = require('fs');
const pem = require('pem-file')

const atosValidResponse = require('../lib/helpers/atosValidResponse');

function processAtosPaymentHandler(req, res) {

  var xml = fs.readFileSync('./app/tls/signed.xml').toString()
  // var doc = new dom().parseFromString(xml)
  // const atosResult = Buffer.from(req.body.base64Response, 'base64');
  // const isAtosResultValid = atosValidResponse(atosResult.toString());
  let clientPublicPEM;
  
    // console.log(util.inspect(result, false, null, true));
  // console.log(JSON.stringify(
  //   result.paymentManualConfirmation.Signature[0].KeyInfo[0].X509Data[0].X509Certificate[0]
  // ));
  parseString(xml, (err, result) => {
    cert = result.paymentManualConfirmation.Signature[0].KeyInfo[0].X509Data[0].X509Certificate[0];
    // console.log(cert);
    // Load certificate in PEM encoding (base64 encoded DER)
    // const source = Buffer.from(cert)
    // clientPublicPEM = pem.encode(source, 'CERTIFICATE');
    clientPublicPEM = 
`-----BEGIN CERTIFICATE-----
${cert}
-----END CERTIFICATE-----`
    fs.writeFile("./app/tls/test.pem", clientPublicPEM, function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
  }); 
    // console.log("clientPublicPEM: ", clientPublicPEM);
  });

  const isAtosResultValid = atosValidResponse(xml);

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
