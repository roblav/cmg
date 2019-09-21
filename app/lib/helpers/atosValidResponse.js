
 /* eslint-disable */
 const pem = require('pem-file')
 const { parseString } = require('xml2js');


 module.exports = (xml, X509) => {
  //  console('atosResult', atosResult);
  const select = require('xml-crypto').xpath;
  const { DOMParser } = require('xmldom');
  const { SignedXml } = require('xml-crypto');
  const { FileKeyInfo } = require('xml-crypto');

  const doc = new DOMParser().parseFromString(xml)
  const option = {implicitTransforms:["http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"]};
  const signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
  const sig = new SignedXml()

  sig.keyInfoProvider = new MyKeyInfo(X509);
  sig.loadSignature(signature.toString);
  
  function MyKeyInfo(X509){
      this.getKey = function(keyInfo){
        return Buffer.from(`-----BEGIN CERTIFICATE-----
        ${X509}
        -----END CERTIFICATE-----`)
      }
  }

  const result = sig.checkSignature(xml)

  console.log('ATOS Valid Response', result);

  return result;

};
