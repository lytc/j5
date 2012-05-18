//= require ./Class

$.Paging = $.Class.extend({
    totalItem: 1
    ,currentPage: 1
    ,itemPerPage: 10

    ,setTotalItem: function(total) {
        total = parseInt(total);
        if (isNaN(total)) {
            total = 0;
        }

        if (total === this.totalItem) {
            return this;
        }

        this.totalItem = total;

        this.trigger('pagingchange:total', total, this);

        this.goToFirstPage();
        return this;
    }

    ,setCurrentPage: function(number) {
        number = parseInt(number);
        if (isNaN(number)) {
            number = 0;
        }
        this.currentPage = number;
        return this;
    }

    ,setItemPerPage: function(number) {
        number = parseInt(number);
        if (isNaN(number)) {
            number = 0;
        }
        this.itemPerPage = number;
        return this;
    }

    ,getTotalPage: function() {
        if (!this.totalItem) {
            return 0;
        }

        return Math.ceil(this.totalItem / this.itemPerPage);
    }

    ,isFirstPage: function() {
        if (!this.totalItem) {
            return;
        }
        return this.currentPage == 1;
    }

    ,isLastPage: function() {
        if (!this.totalItem) {
            return;
        }

        return this.currentPage == this.getTotalPage();
    }

    ,goToPage: function(page, callback, scope) {
        page = parseInt(page);
        if (isNaN(page) || page <= 0) {
            page = 1;
        } else {
            var totalPage = this.getTotalPage();
            if (page > totalPage) {
                page = totalPage;
            }
        }

        if (callback) {
            callback.call(scope || null, page, this);
        }

        this.currentPage = page;

        this.trigger('pagingchange', page, this);

        return this;
    }

    ,goToNextPage: function(callback, scope) {
        if (this.currentPage == this.getTotalPage()) {
            return this;
        }

        return this.goToPage(this.currentPage + 1, callback, scope);
    }

    ,goToPrevPage: function(callback, scope) {
        if (this.currentPage == 1) {
            return this;
        }

        return this.goToPage(this.currentPage - 1, callback, scope);
    }

    ,goToFirstPage: function(callback, scope) {
        if (this.currentPage == 1) {
            return this;
        }

        return this.goToPage(1, callback, scope);
    }

    ,goToLastPage: function(callback, scope) {
        var totalPage = this.getTotalPage();
        if (this.currentPage == totalPage) {
            return this;
        }

        return this.goToPage(totalPage, callback, scope);
    }

    ,refreshPage: function() {
        return this.goToPage(this.currentPage);
    }
});