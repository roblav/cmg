
 /* eslint-disable */
 const pem = require('pem-file')
 const { parseString } = require('xml2js');


 module.exports = (xml, clientPublicPEM) => {
  //  console('atosResult', atosResult);
  const select = require('xml-crypto').xpath;
  const { DOMParser } = require('xmldom');
  const { SignedXml } = require('xml-crypto');
  const { FileKeyInfo } = require('xml-crypto');

  const doc = new DOMParser().parseFromString(xml)

  const signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
  const sig = new SignedXml()

  // console.log(clientPublicPEM);
  // var buf = Buffer.from(clientPublicPEM, 'utf8');
  // console.log(buf);

  // sig.keyInfoProvider = new FileKeyInfo(buf);
  sig.keyInfoProvider = new FileKeyInfo('./app/tls/client_public.pem');

  sig.loadSignature(signature)
      
  const result = sig.checkSignature(xml)

  console.log('ATOS Valid Response', result);

  return result;

};
