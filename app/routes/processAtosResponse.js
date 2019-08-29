const { parseString } = require('xml2js');
const fs = require('fs');
const pem = require('pem-file')
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});

const atosValidResponse = require('../lib/helpers/atosValidResponse');

function processAtosPaymentHandler(req, res) {

  var xml = fs.readFileSync('./app/tls/signed.xml').toString()
  // var doc = new dom().parseFromString(xml)
  // const atosResult = Buffer.from(req.body.base64Response, 'base64');
  // const isAtosResultValid = atosValidResponse(atosResult.toString());
  let clientPublicPEM;
  
  function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }

  parseString(xml, (err, result) => {
    cert = result.paymentManualConfirmation.Signature[0].KeyInfo[0].X509Data[0].X509Certificate[0];
    const certChunks = chunkString(cert, 64);
    certString = certChunks.join('\n');
    clientPublicPEM = `-----BEGIN CERTIFICATE-----\n${certString}\n-----END CERTIFICATE-----`;
    fs.writeFile("./app/tls/test2.pem", clientPublicPEM, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });
  });

  

  console.log("Dont CHECK FILE YET!");
  const isAtosResultValid = atosValidResponse(xml, clientPublicPEM);

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
