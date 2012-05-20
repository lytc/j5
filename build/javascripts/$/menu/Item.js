//= require ../Component

$.list.Item.extend('$.menu.Item menu.item', {
	baseClasses: 'x-item x-menu-item'
    ,defaultChildType: 'menu'

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('click', function() {
            var menu = this.findAncestor('.x-menu');
            if (menu && menu.findAncestor('.x-menu')) {
                menu.hide();
                menu.defer('show', 100);
            }
        }, this);
    }

	,initElement: function() {
		this.callSuper();
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

        this.el.setKeyListener({
            right: this.focusMenu.bind(this)
        });
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
	
	,setPushstate: function(url) {
		this.setHref(url);

		if (!this._pushstateCallback) {
			this._pushstateCallback = function(e) {
                e.cancelBubble();
                e.stop();
				$.Navigator.navigate(this.anchorEl.getAttr('href'));
			}.bind(this);

            this.on('click', this._pushstateCallback);
		}
		return this;
	}
	
	,setChildren: function(children) {
        var childClass = $.alias(this.defaultChildType);

		if (!(children instanceof childClass)) {
            children = new childClass({children: children});
		}
		this.child = this.add(children);
        this.setData('hasChild', true);
		return this;
	}

    ,focusMenu: function() {
        var menu = this.query('> .x-menu');
        if (menu) {
            menu.next();
        }
    }
});