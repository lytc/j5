//= require ./List

/**
 * @class $.Menu
 */
$.List.extend('$.Menu menu', {
	baseClasses: 'x-list x-menu'
	,defaultChildType: 'menu.item'

    ,initElement: function() {
        this.callSuper();

        this.el.setKeyListener({
            up: this.focusPrev.bind(this)
            ,down: this.focusNext.bind(this)
            ,stopEvent: true
        });
    }

    ,getFocused: function() {
        var focused = this.el.query('> li > a:focus');
        if (focused) {
            var el = focused.getParent('.x-menu-item');
            return el.dom.$comp;
        }
    }

    ,focusNext: function() {
        var focused = this.getFocused()
            ,next;

        if (focused) {
            next = focused.getNext();
        }

        if (!next) {
            next = this.child(0);
        }

        next.el.query('> a').focus();
        return this;
    }

    ,focusPrev: function() {
        var focused = this.getFocused()
            ,prev;

        if (focused) {
            prev = focused.getPrev();
        }

        if (!prev) {
            prev = this.lastChild();
        }

        prev.el.query('> a').focus();
        return this;
    }

    ,setHideGutter: function(bool) {
        this.switchClasses(bool, 'x-hide-gutter');
        return this;
    }
});