//= require ../menu/Item

/**
 * @class $.tree.Item
 */
$.list.Item.extend('$.tree.Item tree.item', {
    baseClasses: 'x-item x-tree-item'
    ,defaultChildType: 'tree'

    ,initElement: function() {
        this.callSuper();

        this.bowEl = this.el.append({
            dom: '<span>'
            ,classes: 'x-bow'
            ,listeners: {
                click: function(e) {
                    e.cancelBubble();
                    this.toggleCollapse();

                }.bind(this)
            }
        });

        this.anchorEl = this.el.append({
            dom: '<a>'
            ,attr: {
                //href: '#'
                tabIndex: 0
            }
        });

        this.iconEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-icon'
            ,html: '&nbsp;'
        });

        this.textEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-text'
        });
    }

    ,getElementHandlerSelect: function() {
        return this.anchorEl;
    }

    ,setIcon: function(icon) {
        this.iconEl.removeClasses(/^icon(.*)$/)
            .addClasses('icon-' + icon);
        return this;
    }

    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    ,setHref: function(href) {
        this.anchorEl.setAttr('href', href);
        return this;
    }

    ,setPushState: function(url) {
        this.setHref(url);

        if (!this._pushStateCallback) {
            this._pushStateCallback = function(e) {
                e.stop();
                $.Navigator.navigate(this.anchorEl.getAttr('href'));
            }.bind(this);

            this.on('click', this._pushStateCallback);
        }
        return this;
    }

    ,setChildren: function(children) {
        if (children instanceof $.Collection) {
            var me = this;
            children.load(function() {
                me.setChildren(this.toJson());
            });
        } else {
            var childClass = $.alias(this.defaultChildType);

            if (!(children instanceof childClass)) {
                children = new childClass({children: children});
            }
            this.tree = this.add(children);
            this.setData('hasChild', true);
            return this;
        }
    }

    ,isExpanded: function() {
        return this.hasClasses('x-expanded');
    }

    ,toggleCollapse: function() {
        if (this.isExpanded()) {
            return this.collapse();
        }
        return this.expand();
    }

    ,expand: function() {
        this.addClasses('x-expanded');
        this.trigger('toggleexpand', true);
        this.trigger('expand');
    }

    ,collapse: function() {
        this.removeClasses('x-expanded');
        this.trigger('collapse');
        this.trigger('toggleexpand', false);
    }

    ,setExpanded: function(bool) {
        return this[bool? 'expand' : 'collapse']();
    }
});