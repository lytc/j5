//= require ./Observable
//= require ./Elements
//= require ./Animation

/**
 * @class $.Element
 */
$.Observable.extend('$.Element element', {
    /**
     * @method constructor
     * @param Object [options]
     * @return $.Element
     */
    constructor: function(options) {
        options || (options = {});

        var dom;

        if ('string' == typeof options || $.Dom.is(options)) {
            dom = options;
            options = {};
        } else {
            dom = options.dom || '<div>';
        }

        if ('string' == typeof dom) {
            var match = dom.match(/<(\w+)>/);
            if (match) {
                dom = $.Dom.create(match[1]);
            } else {
                var query = dom;
                dom = $.Dom.query(query);
                if (!dom) {
                    throw new Error('Dom element with query "{0}" not found'.format(query));
                }
            }
        }

        this.dom = dom;
        dom.$el = this;

        this.callSuper([options]);
    }

    /**
     * @method on
     * @param String|Object events
     * @return $.Element
     */
    ,on: function(events) {
        this.callSuper(arguments);

        var eventNames = [];
        if ('string' == typeof events) {
            eventNames = events.split(/\s+/);
        } else {
            eventNames = Object.keys(events);
        }

        var callback, _eventName;
        this._hasFallbackListeners || (this._hasFallbackListeners = {});
        $.each(eventNames, function(eventName) {
            _eventName = $.Element.events[eventName];
            if (!_eventName || this._hasFallbackListeners[eventName]) {
                return;
            }

            callback = function(e) {
                this.trigger(eventName, new $.Event(e), this);
            }.bind(this);

            this.dom.addEventListener(_eventName, callback, false);
            this._hasFallbackListeners[eventName] = callback;
        }, this);

        return this;
    }

    /**
     * @method un
     * @param String|Object events
     * @return $.Element
     */
    ,un: function(events) {
        this.callSuper(arguments);

        if (!this._hasFallbackListeners) {
            return this;
        }

        var eventNames = [];
        if ('string' == typeof events) {
            eventNames = events.split(/\s+/);
        } else {
            eventNames = Object.keys(events);
        }

        var _eventName;

        $.each(eventNames, function(eventName) {
            _eventName = $.Element.events[eventName];
            if (!_eventName || !this._hasFallbackListeners[eventName]) {
                return;
            }

            if (!this.listeners[eventName].length) {
                this.dom.removeEventListener(_eventName, this._hasFallbackListeners[eventName], false);
                this._hasFallbackListeners[eventName] = null;
            }
        }, this);

        return this;
    }

    /**
     * @method setAttr
     * @param String name
     * @param Mixed value
     * @return $.Element
     */
    ,setAttr: function(name, value) {
        if ('string' != typeof name) {
            $.each(name, function(v, k) {
                this.setAttr(k, v);
            }, this);
        } else {
            this.dom.setAttribute(name, value);
        }
        return this;
    }

    /**
     * @method getAttr
     * @param String name
     * @return String
     */
    ,getAttr: function(name) {
        return this.dom.getAttribute(name);
    }

    /**
     * @method removeAttr
     * @param String name
     * @return $.Element
     */
    ,removeAttr: function(name) {
        this.dom.removeAttribute(name);
        return this;
    }

    /**
     * @method toggleAttr
     * @param String name
     * @return $.Element
     */
    ,toggleAttr: function(name) {
        if (this.dom.hasAttribute(name)) {
            return this.removeAttr(name);
        }
        return this.addAttr(name, value !== undefined? value : true);
    }

    /**
     * @method switchAttr
     * @param Boolean bool
     * @param String name
     * @param String value
     * @return $.Element
     */
    ,switchAttr: function(bool, name, value) {
        (undefined !== value) || (value = true);
        return this[bool? 'setAttr' : 'removeAttr'](name, value);
    }

    /**
     * @method setFocusable
     * @param Boolean bool
     */
    ,setFocusable: function(bool) {
        this.setAttr('tabindex', bool? 0 : -1);
    }

    /**
     * @method isFocused
     * @return Boolean
     */
    ,isFocused: function() {
        return document.activeElement == this.dom;
    }

    /**
     * @method focus
     * @return $.Element
     */
    ,focus: function() {
        if (!this.isFocused()) {
            this.dom.focus();
        }
        return this;
    }

    /**
     * @method blur
     * @return $.Element
     */
    ,blur: function() {
        if (this.isFocused()) {
            this.dom.blur();
        }
        return this;
    }

    /**
     * @method select
     * @return $.Element
     */
    ,select: function() {
        this.dom.select();
        return this;
    }

    /**
     * @method setId
     * @param String id
     * @return $.Element
     */
    ,setId: function(id) {
        this.dom.id = id;
        return this;
    }

    /**
     * @method setData
     * @param String name
     * @param Mixed value
     * @return $.Element
     */
    ,setData: function(name, value) {
        if ('object' == typeof name) {
            $.each(name, function(v, n) {
                this.setData(n, v);
            }, this);
        } else {
            this.dom.dataset[name] = value;
        }
        return this;
    }

    /**
     * @method getData
     * @param String name
     * @return String
     */
    ,getData: function(name) {
        return this.dom.dataset[name];
    }

    /**
     * @method setName
     * @param String name
     * @return $.Element
     */
    ,setName: function(name) {
        this.setAttr('name', name);
        this.setData('name', name);
        return this;
    }

    /**
     * @method getName
     * @return $.Element
     */
    ,getName: function() {
        var name = this.getAttr('name');
        if (!name) {
            name = this.getData(name);
        }
        return name;
    }

    /**
     * @method setValue
     * @param Mixed value
     * @return $.Element
     */
    ,setValue: function(value) {
        this.dom.value = value;
        this.setAttr('value', value);
        this.setData('value', value);
        return this;
    }

    /**
     * @method getValue
     * @return String
     */
    ,getValue: function() {
        return this.dom.value || this.getAttr('value') || this.getData('value');
    }

    /**
     * @method setClasses
     * @param String classes
     * @return $.Element
     */
    ,setClasses: function(classes) {
        this.setAttr('class', '');
        return this.addClasses(classes);
    }

    /**
     * @method getClasses
     * @return ClassList
     */
    ,getClasses: function() {
        return this.dom.classList;
    }

    /**
     * @method hasClasses
     * @param String classes
     * @return Boolean
     */
    ,hasClasses: function(classes) {
        classes = classes.trim().split(/\s+/);
        var has = true, classList = this.getClasses();
        $.each(classes, function(item) {
            if (!classList.contains(item)) {
                has = false;
                return false;
            }
        });
        return has;
    }

    /**
     * @method addClasses
     * @param String classes
     * @return $.Element
     */
    ,addClasses: function(classes) {
        classes = (this.getAttr('class') || '') + ' ' + classes;
        classes = classes.trim();
        classes = classes.split(/\s+/g);
        classes = classes.uniq().join(' ');
        return this.setAttr('class', classes);
    }

    /**
     * @method removeClasses
     * @param String classes
     * @return $.Element
     */
    ,removeClasses: function(classes) {
        var classList = this.getClasses();
        if (!classList.length) {
            return this;
        }

        if ('string' == typeof classes) {
            classes = classes.split(/\s+/);

            $.each(classes, function(item) {
                classList.remove(item)
            });
        } else if (classes instanceof RegExp) {
            $.each(classList, function(item) {
                if (classes.test(item)) {
                    classList.remove(item);
                }
            });
        }

        return this;
    }

    /**
     * @method toggleClasses
     * @param String classes
     * @return $.Element
     */
    ,toggleClasses: function(classes) {
        var classList = this.getClasses();
        if (!classList.length) {
            return this;
        }

        classes = classes.split(/\s+/);

        $.each(classes, function(item) {
            classList.toggle(item)
        });

        return this;
    }

    /**
     * @method switchClasses
     * @param Boolean bool
     * @param String classes
     * @return $.Element
     */
    ,switchClasses: function(bool, classes) {
        if (bool) {
            return this.addClasses(classes);
        }
        return this.removeClasses(classes);
    }

    /**
     * @method radioClasses
     * @param String classes
     * @return $.Element
     */
    ,radioClasses: function(classes) {
        this.getParent().children().removeClasses(classes);
        return this.addClasses(classes);
    }

    /**
     * @method deRadioClasses
     * @param String classes
     * @return $.Element
     */
    ,deRadioClasses: function(classes) {
        this.getParent().children().addClasses(classes);
        return this.removeClasses(classes);
    }

    /**
     * @method setClickRadioClasses
     * @param String classes
     * @return $.Element
     */
    ,setClickRadioClasses: function(classes) {
        this.on('click', function() {
            this.radioClasses(classes);
        });
        return this;
    }

    /**
     * @method setStyles
     * @param String|Object name
     * @param Mixed [value]
     * @return $.Element
     */
    ,setStyles: function(name, value) {
        if ('string' != typeof name) {
            $.each(name, function(v, k) {
                this.setStyles(k, v);
            }, this);
        } else {
            name = $.getCssProperty(name);
            this.dom.style[name] = value;
        }

        return this;
    }

    /**
     * @method getStyle
     * @param String name
     * @return String
     */
    ,getStyle: function(name) {
        name = $.getCssProperty(name);
        var result = this.dom.style[name];

        if (!result) {
            result = window.getComputedStyle(this.dom, null).getPropertyValue(name);
        }
        return result;
    }

    /**
     * @method removeStyles
     * @param String... name
     */
    ,removeStyles: function() {
        var name;

        for (var i = 0; i < arguments.length; i ++) {
            name = $.getCssProperty(arguments[i], false);
            this.dom.style.removeProperty(name);
        }

        return this;
    }

    /**
     * @mehtod setWidth
     * @param Number|String width
     * @return $.Element
     */
    ,setWidth: function(width) {
        if ('number' == typeof width) {
            width += 'px';
        }
        return this.setStyles('width', width);
    }

    /**
     * @method getWidth
     * @return Number
     */
    ,getWidth: function() {
        return this.dom.offsetWidth;
    }

    /**
     * @method setHeight
     * @param Number|String height
     * @return $.Element
     */
    ,setHeight: function(height) {
        if ('number' == typeof height) {
            height += 'px';
        }
        return this.setStyles('height', height);
    }

    /**
     * @method getHeight
     * @return Number
     */
    ,getHeight: function() {
        return this.dom.offsetHeight;
    }

    /**
     * @method setSize
     * @param Number|String width
     * @param Number|String [height]
     * @return $.Element
     */
    ,setSize: function(width, height) {
        ('undefined' == height) || (height = width);
        return this.setWidth(width).setHeight(height);
    }

    /**
     * @method getOffsetParent
     * @return Element
     */
    ,getOffsetParent: function() {
        return this.dom.offsetParent;
    }

    /**
     * @method setTop
     * @param Number top
     * @return $.Element
     */
    ,setTop: function(top) {
        if ('number' == typeof top) {
            top += 'px';
        }
        return this.setStyles('top', top);
    }

    /**
     * @method getTop
     * @return Number
     */
    ,getTop: function() {
        return this.dom.offsetTop;
    }

    /**
     * @method setRight
     * @param Number right
     * @return $.Element
     */
    ,setRight: function(right) {
        if ('number' == typeof right) {
            right += 'px';
        }
        return this.setStyles('right', right);
    }

    /**
     * @method getRigth
     * @return Number
     */
    ,getRight: function() {
        var right = this.getStyle('right');
        right = parseInt(right);
        return isNaN(right)? undefined : right;
    }

    /**
     * @method setLeft
     * @param Number left
     * @return $.Element
     */
    ,setLeft: function(left) {
        if ('number' == typeof left) {
            left += 'px';
        }
        return this.setStyles('left', left);
    }

    /**
     * @method getLeft
     * @return Number
     */
    ,getLeft: function() {
        return this.dom.offsetLeft;
    }

    /**
     * @method getOffset
     * @return Object
     */
    ,getOffset: function() {
        return {
            x: this.dom.offsetLeft
            ,y: this.dom.offsetTop
        }
    }

    /**
     * @method getPageXY
     * @return Object
     */
    ,getPageXY: function() {
        var xy = this.getOffset()
            ,offsetParent;

        if (offsetParent = this.dom.offsetParent) {
            do {
                xy.x += offsetParent.offsetLeft;
                xy.y += offsetParent.offsetTop;
            } while (offsetParent = offsetParent.offsetParent);
        }
        return xy;
    }

    /**
     * @method setParent
     * @param Object|Element parent
     * @return $.Element
     */
    ,setParent: function(parent) {
        parent = $.Element.get(parent);
        parent.append(this);
        return parent;
    }

    /**
     * @method getParent
     * @return $.Element
     */
    ,getParent: function() {
        return $.Element.get(this.dom.parentElement);
    }

    /**
     * @method count
     * @return Number
     */
    ,count: function() {
        return this.dom.childElementCount;
    }

    /**
     * @method setIndex
     * @param Number index
     * @return $.Element
     */
    ,setIndex: function(index) {
        var targetEl = this.getParent().at(index);
        if (!targetEl) {
            return this;
        }

        return this.insertBefore(targetEl);
    }

    /**
     * @method getIndex
     * @return Number
     */
    ,getIndex: function() {
        return [].indexOf.call(this.dom.parentElement.children, this.dom);
    }

    /**
     * @method up
     * @param Number [offset]
     * @return $.Element
     */
    ,up: function(offset) {
        offset || (offset = 1);
        return this.setIndex(this.getIndex() - offset);
    }

    /**
     * @method down
     * @param Number [offset]
     * @return $.Element
     */
    ,down: function(offset) {
        offset || (offset = 1);
        return this.up(-offset - 1);
    }

    /**
     * @method first
     * @param String [query]
     * @return $.Element
     */
    ,first: function(query) {
        return this.at(0, query);
    }

    /**
     * @method last
     * @param String [query]
     * @return $.Element
     */
    ,last: function(query) {
        return this.at(this.count() - 1, query);
    }

    /**
     * @method at
     * @param Number at
     * @param String ]query]
     * @return $.Element
     */
    ,at: function(at, query) {
        query = '>' + (query || '*') + ':nth-child(' + (at + 1) + ')';

        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom, this);
        }
    }

    /**
     * @method append
     * @param Element|Array els
     * @return $.Element
     */
    ,append: function(els) {
        if (els instanceof Array) {
            return $.each(els, function(el) {
                return this.append(el);
            }, this);
        } else {
            els = $.Element.get(els);
            this.dom.appendChild(els.dom);
            this.trigger('append', els);
            return els;
        }
    }

    /**
     * @method insert
     * @param Number at
     * @param Object|Element el
     * @return $.Element
     */
    ,insert: function(at, el) {
        var atDom = this.dom.children[at];
        if (atDom) {
            el = $.Element.get(el);
            this.dom.insertBefore(el.dom, atDom);
            return el;
        } else {
            return this.append(el);
        }
    }

    /**
     * @method insertBefore
     * @param Object|$.Element
     * @return $.Element
     */
    ,insertBefore: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom);
        return this;
    }

    /**
     * @method insertAfter
     * @param Object|$.Element
     * @return $.Element
     */
    ,insertAfter: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom.nextElementSibling);
        return this;
    }

    /**
     * @method getNext
     * @return $.Element
     */
    ,getNext: function() {
        var dom = this.dom.nextElementSibling;
        if (dom) {
            return $.Element.get(dom);
        }
    }

    /**
     * @method getPrev
     * @return $.Element
     */
    ,getPrev: function() {
        var dom = this.dom.previousElementSibling;
        if (dom) {
            return $.Element.get(dom, this);
        }
    }

    /**
     * @method children
     * @return $.Elements
     */
    ,children: function() {
        var els = new $.Elements(this.dom.children);
        return els;
    }

    /**
     * @method onRender
     * @param Function callback
     * @return $.Element
     */
    ,onRender: function(callback) {
        if (this.isRendered()) {
            callback();
        }

        this.on('render', function() {
            callback();
        })

        return this;
    }

    /**
     * @method appendTo
     * @param String|Element|$.Element el
     * @return $.Element
     */
    ,appendTo: function(el) {
        el = $.Element.get(el);
        el.append(this);

        this.trigger('render');
        return el;
    }

    /**
     * @method setAppendTo
     * @param String|Element|$.Element
     * @return $.Element
     */
    ,setAppendTo: function(el) {
        return this.appendTo(el);
    }

    /**
     * @method wrap
     * @param Object|Element|$.Element
     * @return $.Element
     */
    ,wrap: function(el) {
        el || (el = '<div>');
        el = $.Element.get(el);

        this.dom.$wrapEl = el;

        if (this.isRendered()) {
            el.insertBefore(this);
        }
        el.append(this);
        return el;
    }

    /**
     * @method unwrap
     * @return $.Element
     */
    ,unwrap: function() {
        if (this.dom.$wrapEl) {
            this.before(this.dom.$wrapEl);
            this.dom.$wrapEl.destroy();
            delete this.dom.$wrapEl;
        }
        return this;
    }

    /**
     * @method setHtml
     * @param String html
     * @return $.Element
     */
    ,setHtml: function(html) {
        this.dom.innerHTML = html;
        this.trigger('change change:html', this);
        return this;
    }

    /**
     * @method getHtml
     * @return String
     */
    ,getHtml: function() {
        return this.dom.innerHTML;
    }

    /**
     * @method query
     * @param String query
     * @return $.Element
     */
    ,query: function(query) {
        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom);
        }
    }

    /**
     * @method queryAll
     * @param String query
     * @return $.Elements
     */
    ,queryAll: function(query) {
        var doms = $.Dom.queryAll(query, this.dom);
        if (doms) {
            return new $.Elements(doms);
        }
    }

    /**
     * @method contains
     * @param Element|$.Element
     * @return Boolean
     */
    ,contains: function(el) {
        var dom = el instanceof $.Element? el.dom : el;
        return this.dom.contains(dom);
    }

    /**
     * @method findAncestor
     * @param String query
     * @return $.Element
     */
    ,findAncestor: function(query) {
        query = '> ' + query;

        var ancestor = this.dom.parentElement, result, matches, dom = this.dom;

        while(true) {
            ancestor = ancestor.parentElement;
            if (!ancestor) {
                return;
            }
            matches = $.Dom.queryAll(query, ancestor);

            $.each(matches, function(item) {
                if (item.contains(dom) && item.$el) {
                    result = item.$el;
                    return false;
                }
            });

            if (result) {
                return result;
            }
        }
    }

    /**
     * @method isVisible
     * @return Boolean
     */
    ,isVisible: function() {
        return !('none' == this.getStyle('display') || this.hasClasses('x-hidden'));
    }

    /**
     * @method hide
     * @param Number [defer]
     * @return $.Element
     */
    ,hide: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = this.hide.bind(this).defer(true === defer? 1 : defer);
            return this;
        }

        if (this.hasClasses('x-hidden')) {
            return this;
        }

        this.trigger('hide');
        this.addClasses('x-hidden');
        return this;
    }

    /**
     * @method show
     * @param Number [defer]
     * @return $.Element
     */
    ,show: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = this.show.bind(this).defer(true === defer? 1 : defer);
            return this;
        }

        if (!this.hasClasses('x-hidden')) {
            return this;
        }

        this.removeClasses('x-hidden');
        this.trigger('show');
        return this;
    }

    /**
     * @method setHidden
     * @param Boolean bool
     * @param Number [defer]
     * @return $.Element
     */
    ,setHidden: function(bool, defer) {
        return this[bool? 'show' : 'hide'](defer);
    }

    /**
     * @method toggleDisplay
     * @param Number [defer]
     * @return $.Element
     */
    ,toggleDisplay: function(defer) {
        return this.setHidden(!this.isVisible(), defer);
    }

    /**
     * @method collapse
     * @return $.Element
     */
    ,collapse: function() {
        return this.addClasses('x-collapsed');
    }

    /**
     * @method expand
     * @return $.Element
     */
    ,expand: function() {
        return this.removeClasses('x-collapsed');
    }

    /**
     * @method setCollapsed
     * @param Boolean bool
     * @return $.Element
     */
    ,setCollapsed: function(bool) {
        return this[bool? 'collapse' : 'expand']();
    }

    /**
     * @method toggleCollapse
     * @return $.Element
     */
    ,toggleCollapse: function() {
        this.toggleClasses('x-collapsed');
    }

    /**
     * @method mask
     * @param String html
     * @return $.Element
     */
    ,mask: function(html) {
        html || (html = '');
        if (!this._maskEl) {
            this._maskEl = this.insert(0, {
                classes: 'x-mask'
                ,width: this.getWidth()
                ,height: this.getHeight()
            });
            this._maskEl.insertBefore(this);
            this._maskEl._messageWrapEl = this._maskEl.insert(0, {
                dom: '<div>'
                ,classes: 'x-mask-message-wrap'
            });

            this._maskEl._messageEl = this._maskEl._messageWrapEl.append({
                dom: '<div>'
                ,classes: 'x-mask-message'
            });
        }

        html? this._maskEl._messageEl.show() : this._maskEl._messageEl.hide();

        if (html instanceof $.Element) {
            this._maskEl._messageEl.append(html);
        } else if (html instanceof $.Component) {
            this._maskEl._messageEl.append(html.el);
        } else {
            this._maskEl._messageEl.setHtml(html);
        }

        return this._maskEl;
    }

    /**
     * @method unmask
     * @return $.Element
     */
    ,unmask: function() {
        if (this._maskEl) {
            this._maskEl.destroy();
            delete this._maskEl;
        }
        return this;
    }

    /**
     * @method setDraggable
     * @param Object [options]
     * @return $.Element
     */
    ,setDraggable: function(options) {
        if (!this.drag) {
            this.drag = new $.Drag(this);
        }
        this.drag.applyOptions(options);
        return this;
    }

    /**
     * @method setKeyListener
     * @param Object options
     * @return $.Element
     */
    ,setKeyListener: function(options) {
        if (!this.keyListener) {
            this.keyListener = new $.KeyListener(this, options);
        }
        return this;
    }

    /**
     * @method setDefaults
     * @param Object options
     * @return $.Element
     */
    ,setDefaults: function(options) {
        this.on('append', function(el) {
            if (el instanceof $.field.Field) {
                el.applyOptions(options);
            }
        });
        return this;
    }

    /**
     * @method clone
     * @param Boolean deep
     * @return $.Element
     */
    ,clone: function(deep) {
        var dom = this.dom.cloneNode(!!deep);
        var el = new $.Element(dom);
        el.removeAttr('id');

        $.each(this, function(v, k) {
            if (k != 'dom') {
                el[k] = v;
            }
        });

        return el;
    }

    /**
     * @method isRendered
     * @return Boolean
     */
    ,isRendered: function() {
        return document.body.contains(this.dom);
    }

    /**
     * @method fx
     * @return $.Animation
     */
    ,fx: function(options) {
        if (!this._animation) {
            this._animation = new $.Animation(this);
        }
        this._animation.applyOptions(options);
        return this._animation;
    }

    /**
     * @method empty
     * @return $.Element
     */
    ,empty: function() {
        return this.setHtml('');
    }

    /**
     * @method destroy
     */
    ,destroy: function() {
        this.dom.parentNode.removeChild(this.dom);
    }
});

$.extend($.Element, {
    /**
     * @static
     * @method getDom
     * @param Mixed el
     * @return Element
     */
    getDom: function(el) {
        if (el instanceof $.Element) {
            return el.dom;
        }

        if ($.Dom.is(el)) {
            return el;
        }
    }

    /**
     * @static
     * @method get
     * @param Mixed object
     * @param String|Element|$.Element
     * @return $.Element
     */
    ,get: function(obj, root) {
        if (obj instanceof $.Element) {
            return obj;
        }

        if ('string' == typeof obj && !/<(\w+)>/.test(obj)) {
            var query = obj;
            obj = $.Dom.query(query, root && root.dom? root.dom : root);
            if (!obj) {
                throw new Error('Dom with query "' + query + '" not found');
            }
        }

        if ($.Dom.is(obj) && obj.$el) {
            return obj.$el;
        }

        return new $.Element(obj);
    }

    ,events: $.readOnlyObject({
        DOMActivate: 'DOMActivate',
        load: 'load',
        unload: 'unload',
        abort: 'abort',
        error: 'error',
        select: 'select',
        resize: 'resize',
        scroll: 'scroll',

        // Focus Event Types
        blur: 'blur',
        DOMFocusIn: 'DOMFocusIn',
        DOMFocusOut: 'DOMFocusOut',
        focus: 'focus',
        focusin: 'focusin',
        focusout: 'focusout',

        // Mouse Event Types
        click: 'click',
        dblclick: 'dblclick',
        mousedown: 'mousedown',
        mouseenter: 'mouseenter',
        mouseleave: 'mouseleave',
        mousemove: 'mousemove',
        mouseover: 'mouseover',
        mouseout: 'mouseout',
        mouseup: 'mouseup',

        // Wheel Event Types
        wheel: 'wheel',

        //Text Event Types
        textinput: 'textinput',

        // Keyboard Event Types
        keydown: 'keydown',
        keypress: 'keypress',
        keyup: 'keyup',

        // Composition Event Types
        compositionstart: 'compositionstart',
        compositionupdate: 'compositionupdate',
        compositionend: 'compositionend',

        // Mutation Events
        DOMAttrModified: 'DOMAttrModified',
        DOMCharacterDataModified: 'DOMCharacterDataModified',
        DOMNodeInserted: 'DOMNodeInserted',
        DOMNodeInsertedIntoDocument: 'DOMNodeInsertedIntoDocument',
        DOMNodeRemoved: 'DOMNodeRemoved',
        DOMNodeRemovedFromDocument: 'DOMNodeRemovedFromDocument',
        DOMSubtreeModified: 'DOMSubtreeModified',

        // Mutation Name Event Types
        DOMAttributeNameChanged: 'DOMAttributeNameChanged',
        DOMElementNameChanged: 'DOMElementNameChanged',

        // Drag & Drop
        dragstart: 'dragstart',
        drag: 'drag',
        dragenter: 'dragenter',
        dragleave: 'dragleave',
        dragover: 'dragover',
        drop: 'drop',
        dragend: 'dragend',

        // Animation
        animationstart: $.isWebkit? 'webkitAnimationStart': $.isOpera? 'oAnimationStart' : 'animationstart',
        animationend: $.isWebkit? 'webkitAnimationEnd': $.isOpera? 'oAnimationEnd' : 'animationend',
        animationiteration: $.isWebkit? 'webkitAnimationIteration': $.isOpera? 'oAnimationIteration' : 'animationiteration'
    })
});