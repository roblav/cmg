
 /* eslint-disable */
 
 module.exports = (xml) => {
  //  console('atosResult', atosResult);
  const select = require('xml-crypto').xpath;
  const { DOMParser } = require('xmldom');
  const { SignedXml } = require('xml-crypto');
  const { FileKeyInfo } = require('xml-crypto');

  const doc = new DOMParser().parseFromString(xml)

  const signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
  const sig = new SignedXml()
  sig.keyInfoProvider = new FileKeyInfo('./app/tls/client_public.pem');
  sig.loadSignature(signature)
      
  const result = sig.checkSignature(xml)

  return result;

};
