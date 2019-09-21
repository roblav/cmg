
var perPage = 2;

function genTables() {
    var tables = document.querySelectorAll(".pagination");
    var footer = document.querySelectorAll(".pager");
    for (var i = 0; i < tables.length; i++) {
        perPage = parseInt(tables[i].dataset.pagecount);
        createTableMeta(tables[i]);
        // Check if footer exists
        if (footer.length === 0)
          createFooters(tables[i]);
        loadTable(tables[i]);
    }
}

// based on current page, only show the elements in that range
function loadTable(table) {
    var startIndex = 0;

    if (table.querySelector('th'))
        startIndex = 1;

    var start = (parseInt(table.dataset.currentpage) * table.dataset.pagecount) + startIndex;
    var end = start + parseInt(table.dataset.pagecount);
    var rows = table.rows;

    for (var x = startIndex; x < rows.length; x++) {
        if (x < start || x >= end)
            rows[x].classList.add("inactive");
        else
            rows[x].classList.remove("inactive");
    }
}

function createTableMeta(table) {
    table.dataset.currentpage = "0";
}

function createFooters(table) {

    var hasHeader = false;
    if (table.querySelector('th'))
        hasHeader = true;

    var rows = table.rows.length;

    if (hasHeader)
        rows = rows - 1;

    var numPages = rows / perPage;
    var pager = document.createElement("div");

    function pagerButtonClickHandler() {
      var parent = this.parentNode;
      var items = parent.querySelectorAll(".pager-item");
      for (var x = 0; x < items.length; x++) {
          items[x].classList.remove("selected");
      }
      this.classList.add('selected');
      table.dataset.currentpage = this.dataset.index;
      loadTable(table);
    }

    function firstButtonClickHandler(index) {
      var parent = this.parentNode;
      console.log('this', this);
      var items = parent.querySelectorAll(".pager-item");
      for (var x = 0; x < items.length; x++) {
          items[x].classList.remove("selected");
      }
      // Add .selected to page 1 button
      document.getElementsByClassName(index)[0].classList.add('selected');
      // Hide this button
      table.dataset.currentpage = this.dataset.index;
      loadTable(table);
    }

    function createPagerElement(name, pageToSelect, fn) {
      var ele = document.createElement("div");
      ele.innerHTML = name;
      ele.className = "pager-item govuk-body-s";
      ele.dataset.index = pageToSelect;
      ele.addEventListener('click', fn);
      pager.appendChild(ele);
    }

    // Create a first element
    //function(event) {
    //   this.myfunction(event));
    // }.bind(this)
    createPagerElement("first", 0, function(){ return firstButtonClickHandler('index-0') })
    createPagerElement("<<", 0, pagerButtonClickHandler)

    // add an extra page, if we're 
    if (numPages % 1 > 0)
        numPages = Math.floor(numPages) + 1;

    pager.className = "pager";
    for (var i = 0; i < numPages ; i++) {
        var page = document.createElement("div");
        page.innerHTML = i + 1;
        page.className = "pager-item govuk-body-s index-" + i;
        page.dataset.index = i;

        if (i == 0)
            page.classList.add("selected");

        page.addEventListener('click', pagerButtonClickHandler);
        pager.appendChild(page);
    }
        // Create a last element
        createPagerElement(">>", 0, pagerButtonClickHandler)
        createPagerElement("last", numPages - 1, pagerButtonClickHandler)

    // insert pager at the bottom of the table
    table.parentNode.insertBefore(pager, table.nextSibling);
}

window.addEventListener('load', function() {
    genTables();
});
