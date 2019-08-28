const express = require('express')
const router = express.Router()
const moment = require('moment');
const fs = require('fs');

const paymentsHandler = require('./routes//paymentsHandler');
const processAtosResponse = require('./routes/processAtosResponse');

const pdfDoc = require('../public/json/testData.json');
const tableData = require('../public/json/tableData.json');

const paginate = require('../lib/paginate');

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

function tableSort(key, res, order='asc') {
  return function(a, b) {
    console.log('Old: ', res.locals);
    if (key === res.locals.tableKey) { order='desc' };
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string') ?
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ?
      b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order == 'desc') ? (comparison * -1) : comparison
    );
  };
}


function tableSortHandler(req, res) {
  const page = req.params.page === undefined ? 1 : Number(req.params.page);
  // Show 5 records at a time
  const recordsPerPage = 10;
  const pageNav = paginate(
    totalItems = tableData.orders.length,
    currentPage = page,
    pageSize = recordsPerPage,
    maxPages = 10);
  // Limit the tableData records to the range 
  const upperRange = recordsPerPage * page;

  // Table Sort
  // First Name - ASC / DESC
  const sortBy = req.params.sortBy === undefined ? '' : req.params.sortBy;
  if (sortBy !== undefined ) {
    tableData.orders.sort(tableSort(sortBy, res));
    res.locals.tableKey = sortBy;
    console.log('New: ', res.locals.tableKey);
  }
  // console.log(tableData.orders.sort())

  const orders = tableData.orders.slice(upperRange - recordsPerPage, upperRange)

  res.render('table-sort-pagination/index', {tableData: orders, pageNav, currentPage: page, sortBy})
};

router.get('/table-sort-pagination/', tableSortHandler)
router.get('/table-sort-pagination/:page', tableSortHandler)
router.get('/table-sort-pagination/:page/:sortBy', tableSortHandler)

// router.get('/my-payments/', paymentsHandler.createPEMFile)

router.get('/my-payments/', processAtosResponse.processAtosPaymentHandler)

router.get('/socketio-example/', function (req, res) {
  res.render('socketio-example/index')
})

router.get('/ajax/', function (req, res) {
  res.render('ajax/index')
})

router.get('/ajax/get-promise', function (req, res) {
  // console.log('Get Promise Example');
  res.render('ajax/get-promise')
})

router.get('/ajax/get-promise-message', async function (req, res) {
  // console.log('Get Promise Example Message');
  const promise1 = await new Promise((resolve, reject) => {
    setTimeout(() => {
        message = {userId: 1, id: 3, title: "fugiat veniam minus", completed: false};
        resolve(message);
    }, 2000)
  })
  res.json(promise1);
})

module.exports = router
