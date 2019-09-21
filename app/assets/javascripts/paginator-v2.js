/* eslint-env browser */
/* global document */

function Pager(tableName, itemsPerPage) {
    'use strict';

    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) {
        let rows = document.getElementById(tableName).rows;

        // i starts from 1 to skip table header row
        for (let i = 1; i < rows.length; i++) {
            if (i < from || i > to) {
                // rows[i].style.display = 'none';
                if (rows[i].parentNode.localName !== 'tfoot')
                    rows[i].classList.add("inactive")
            } else {
                // rows[i].style.display = '';
                rows[i].classList.remove("inactive")
            }
        }
    };

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            // Not initialized
            return;
        }

        let oldPageAnchor = document.getElementById('pg' + this.currentPage);
        oldPageAnchor.className = 'pg-normal';

        this.currentPage = pageNumber;
        let newPageAnchor = document.getElementById('pg' + this.currentPage);
        newPageAnchor.className = 'pg-selected';

        let from = (pageNumber - 1) * itemsPerPage + 1;
        let to = from + itemsPerPage - 1;
        this.showRecords(from, to);

        let pgFirst = document.querySelector('.pg-first');
        let pgNext = document.querySelector('.pg-next');
        let pgPrev = document.querySelector('.pg-prev');
        let pgLast = document.querySelector('.pg-last');

        if (this.currentPage === this.pages) {
            pgNext.style.display = 'none';
            pgLast.style.display = 'none';
        } else {
            pgNext.style.display = '';
            pgLast.style.display = '';
        }

        if (this.currentPage === 1) {
            pgFirst.style.display = 'none';
            pgPrev.style.display = 'none';
        } else {
            pgFirst.style.display = '';
            pgPrev.style.display = '';
        }
    };

    this.first = function () {
        if (this.currentPage > 1) {
            this.showPage(1);
        }
    };

    this.prev = function () {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    };

    this.next = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    };

    this.last = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.pages);
        }
    };

    this.init = function () {
        let rows = document.getElementById(tableName).rows;
        let records = (rows.length - 1);

        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    };

    this.showPageNav = function (pagerName) {
        if (!this.inited) {
            // Not initialized
            return;
        }

        // let element = document.getElementById(positionId);
        let element = document.createElement("div");
        element.className = "pager-nav";
        let pagerHtml = '<span onclick="' + pagerName + '.first();" class="pg-normal pg-first">first</span>';
        pagerHtml += '<span onclick="' + pagerName + '.prev();" class="pg-normal pg-prev">&#171;</span>';

        // Add all the page buttons
        for (let page = 1; page <= this.pages; page++) {
            pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span>';
        }

        pagerHtml += '<span onclick="' + pagerName + '.next();" class="pg-normal pg-next">&#187;</span>';
        pagerHtml += '<span onclick="' + pagerName + '.last();" class="pg-normal pg-last">last</span>';

        element.innerHTML = pagerHtml;
        // insert pager at the bottom of the table
        table.parentNode.insertBefore(element, table.nextSibling);
    };
}
