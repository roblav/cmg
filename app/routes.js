const express = require('express')
const router = express.Router()
const moment = require('moment');
const fs = require('fs');

const pdfDoc = require('../public/json/testData.json');

// Add your routes here - above the module.exports line

router.get('/ui-3-step', function (req, res) {
  res.render('ui-3-step/index')
})

router.post('/ui-3-step/change', function (req, res) {
  res.redirect ('/ui-3-step/confirm')
})

router.post('/ui-3-step/confirm', function (req, res) {
  res.redirect ('/ui-3-step/accepted')
})

router.post('/calc-history', function (req, res) {
  // fs.writeFile('test.pdf', base64Image, {encoding: 'base64'}, function(err) {
  //   console.log('File created');
  // });
  // res.redirect ('/calc-history/accepted')
  
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="testDoc.pdf"'
  });

  let fileContent = pdfDoc.file.data;

  const download = Buffer.from(fileContent.toString('utf-8'), 'base64');
  res.end(download);
  

})


module.exports = router
