
const moment = require('moment');
const fs = require('fs');


function createPEMFile(req, res) {
  console.log('createPEMFile');
  res.render('payments/index')
};


module.exports = {
  createPEMFile
}
