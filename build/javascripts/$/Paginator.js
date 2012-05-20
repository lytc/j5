//= require ./Paging
//= require ./Component

$.Component.extend('$.Paginator paginator', {
    baseClasses: 'x-paginator'
    ,defaultChildType: 'button'
    ,includes: [$.Paging]
    ,infoHtml: 'Displaying page {currentPage} of {totalPage} pages, {startIndex} - {endIndex} of {totalItem} items'

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('pagingchange', function(page) {
            this.input.setValue(page);

            if (this.isFirstPage()) {
                this.firstBt.disable();
                this.prevBt.disable();
                this.nextBt.enable();
                this.lastBt.enable();
            } else if (this.isLastPage()) {
                this.firstBt.enable();
                this.prevBt.enable();
                this.nextBt.disable();
                this.lastBt.disable();
            } else {
                this.firstBt.enable();
                this.prevBt.enable();
                this.nextBt.enable();
                this.lastBt.enable();
            }
        }.bind(this));

        this.on('pagingchange pagingchange:total', function() {
            this.updatePagingInfo();
        }.bind(this));

        this.on('pagingchange:total', function(total) {
            this.input.setDisabled(!total);
        }.bind(this));
    }

    ,initElement: function() {
        this.callSuper();

        var me = this;
        this.firstBt = this.add({
            classes: 'x-first'
            ,icon: 'step-backward'
            ,disabled: true
            ,click: function() {
                me.goToFirstPage();
            }
        });

        this.prevBt = this.add({
            classes: 'x-prev'
            ,icon: 'chevron-left'
            ,disabled: true
            ,click: function() {
                me.goToPrevPage();
            }
        });

        this.input = this.add({
            xtype: 'field.text'
            ,classes: 'x-input'
            ,disabled: true
            ,listeners: {
                change: function() {
                    me.goToPage(this.getValue());
                }
            }
        });

        this.nextBt = this.add({
            classes: 'x-next'
            ,icon: 'chevron-right'
            ,scale: 'small'
            ,disabled: true
            ,click: function() {
                me.goToNextPage();
            }
        });

        this.lastBt = this.add({
            classes: 'x-last'
            ,icon: 'step-forward'
            ,scale: 'small'
            ,disabled: true
            ,click: function() {
                me.goToLastPage();
            }
        });

        this.info = this.add({
            xtype: 'component'
            ,classes: 'x-info'
        });
    }

    ,updatePagingInfo: function() {
        var cur = this.currentPage
            ,per = this.itemPerPage
            ,startIndex = (cur - 1) * per + 1;

        var info = {
                currentPage: cur
                ,totalPage: this.getTotalPage()
                ,startIndex: startIndex
                ,endIndex: startIndex + per - 1
                ,totalItem: this.totalItem
            };

        this.info.setHtml($.String.format(this.infoHtml, info));
        return this;
    }
});