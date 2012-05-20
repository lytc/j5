//= require ./Observable
//= require ./Elements
//= require ./Animation

$.Observable.extend('$.Element element', {
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
                    throw new Error($.String.format('Dom element with query "{0}" not found', query));
                }
            }
        }

        this.dom = dom;
        dom.$el = this;

        this.callSuper([options]);
    }

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

    ,getAttr: function(name) {
        return this.dom.getAttribute(name);
    }

    ,removeAttr: function(name) {
        this.dom.removeAttribute(name);
        return this;
    }

    ,toggleAttr: function(name) {
        if (this.dom.hasAttribute(name)) {
            return this.removeAttr(name);
        }
        return this.addAttr(name, value !== undefined? value : true);
    }

    ,switchAttr: function(bool, name, value) {
        (undefined !== value) || (value = true);
        return this[bool? 'setAttr' : 'removeAttr'](name, value);
    }

    ,setFocusable: function(bool) {
        this.setAttr('tabindex', bool? 0 : -1);
    }

    ,isFocused: function() {
        return document.activeElement == this.dom;
    }

    ,focus: function() {
        if (!this.isFocused()) {
            this.dom.focus();
        }
        return this;
    }

    ,blur: function() {
        if (this.isFocused()) {
            this.dom.blur();
        }
        return this;
    }

    ,select: function() {
        this.dom.select();
        return this;
    }

    ,setId: function(id) {
        this.dom.id = id;
        return this;
    }

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

    ,getData: function(name) {
        return this.dom.dataset[name];
    }

    ,setName: function(name) {
        this.setAttr('name', name);
        this.setData('name', name);
        return this;
    }

    ,getName: function() {
        var name = this.getAttr('name');
        if (!name) {
            name = this.getData(name);
        }
        return name;
    }

    ,setValue: function(value) {
        this.dom.value = value;
        this.setAttr('value', value);
        this.setData('value', value);
        return this;
    }

    ,getValue: function() {
        return this.dom.value || this.getAttr('value') || this.getData('value');
    }

    ,setClasses: function(classes) {
        this.setAttr('class', '');
        return this.addClasses(classes);
    }

    ,getClasses: function() {
        return this.dom.classList;
    }

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

    ,addClasses: function(classes) {
        classes = (this.getAttr('class') || '') + ' ' + classes;
        classes = classes.trim();
        classes = classes.split(/\s+/g);
        classes = $.Array(classes).uniq().join(' ');
        return this.setAttr('class', classes);
    }

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

    ,switchClasses: function(bool, classes) {
        if (bool) {
            return this.addClasses(classes);
        }
        return this.removeClasses(classes);
    }

    ,radioClasses: function(classes) {
        this.getParent().children().removeClasses(classes);
        return this.addClasses(classes);
    }

    ,deRadioClasses: function(classes) {
        this.getParent().children().addClasses(classes);
        return this.removeClasses(classes);
    }

    ,setClickRadioClasses: function(classes) {
        this.on('click', function() {
            this.radioClasses(classes);
        });
        return this;
    }

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

    ,getStyle: function(name) {
        name = $.getCssProperty(name);
        var result = this.dom.style[name];

        if (!result) {
            result = window.getComputedStyle(this.dom, null).getPropertyValue(name);
        }
        return result;
    }

    ,removeStyles: function() {
        var name;

        for (var i = 0; i < arguments.length; i ++) {
            name = $.getCssProperty(arguments[i], false);
            this.dom.style.removeProperty(name);
        }

        return this;
    }

    ,setWidth: function(width) {
        if ('number' == typeof width) {
            width += 'px';
        }
        return this.setStyles('width', width);
    }

    ,getWidth: function() {
        return this.dom.offsetWidth;
    }

    ,setHeight: function(height) {
        if ('number' == typeof height) {
            height += 'px';
        }
        return this.setStyles('height', height);
    }

    ,getHeight: function() {
        return this.dom.offsetHeight;
    }

    ,setSize: function(width, height) {
        ('undefined' == height) || (height = width);
        return this.setWidth(width).setHeight(height);
    }

    ,getOffsetParent: function() {
        return this.dom.offsetParent;
    }

    ,setTop: function(top) {
        if ('number' == typeof top) {
            top += 'px';
        }
        return this.setStyles('top', top);
    }

    ,getTop: function() {
        return this.dom.offsetTop;
    }

    ,setRight: function(right) {
        if ('number' == typeof right) {
            right += 'px';
        }
        return this.setStyles('right', right);
    }

    ,getRight: function() {
        var right = this.getStyle('right');
        right = parseInt(right);
        return isNaN(right)? undefined : right;
    }

    ,setLeft: function(left) {
        if ('number' == typeof left) {
            left += 'px';
        }
        return this.setStyles('left', left);
    }

    ,getLeft: function(left) {
        return this.dom.offsetLeft;
    }

    /*,getOffset: function() {
        var offset, x = this.dom.offsetLeft, y = this.dom.offsetTop;
        if (offset = this.dom.offsetParent) {
            do {
                x += offset.offsetLeft;
                y += offset.offsetTop;
            } while (offset = offset.offsetParent);
        }
        return {
            x: x
            ,y: y
        };
    }
    */
    ,getOffset: function() {
        return {
            x: this.dom.offsetLeft
            ,y: this.dom.offsetTop
        }
    }

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

    ,setParent: function(parent) {
        parent = $.Element.get(parent);
        parent.append(this);
        return parent;
    }

    ,getParent: function() {
        return $.Element.get(this.dom.parentElement);
    }

    ,count: function() {
        return this.dom.childElementCount;
    }

    ,index: function() {
        return [].indexOf.call(this.dom.parentElement.children, this.dom);
    }

    ,first: function(query, uniq) {
        return this.at(0, query, uniq);
    }

    ,last: function(query, uniq) {
        return this.at(this.count() - 1, query, uniq);
    }

    ,at: function(at, query, uniq) {
        query = '>' + (query || '*') + ':nth-child(' + (at + 1) + ')';

        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom, this, uniq);
        }
    }

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

    ,insertBefore: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom);
        return this;
    }

    ,insertAfter: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom.nextElementSibling);
        return this;
    }

    ,getNext: function() {
        var dom = this.dom.nextElementSibling;
        if (dom) {
            return $.Element.get(dom);
        }
    }

    ,getPrev: function(uniq) {
        var dom = this.dom.previousElementSibling;
        if (dom) {
            return $.Element.get(dom, this, uniq);
        }
    }

    ,children: function() {
        var els = new $.Elements(this.dom.children);
        return els;
    }

    ,onRender: function(callback) {
        if (this.isRendered()) {
            callback();
        }

        this.on('render', function() {
            callback();
        })
    }

    ,appendTo: function(el) {
        el = $.Element.get(el);
        el.append(this);

        this.trigger('render');
        return el;
    }

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

    ,unwrap: function() {
        if (this.dom.$wrapEl) {
            this.before(this.dom.$wrapEl);
            this.dom.$wrapEl.destroy();
            delete this.dom.$wrapEl;
        }
        return this;
    }

    ,setHtml: function(html) {
        this.dom.innerHTML = html;
        this.trigger('change change:html', this);
        return this;
    }

    ,getHtml: function() {
        return this.dom.innerHTML;
    }

    ,query: function(query) {
        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom);
        }
    }

    ,queryAll: function(query) {
        var doms = $.Dom.queryAll(query, this.dom);
        if (doms) {
            return new $.Elements(doms);
        }
    }

    ,contains: function(el) {
        return this.dom.contains(el.dom);
    }

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

    ,isVisible: function() {
        return !('none' == this.getStyle('display') || this.hasClasses('x-hidden'));
    }

    ,hide: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = $.Function.defer(this.hide.bind(this), true === defer? 1 : defer);
            return this;
        }

        if (this.hasClasses('x-hidden')) {
            return this;
        }

        this.trigger('hide');
        this.addClasses('x-hidden');
        return this;
    }

    ,show: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = $.Function.defer(this.show.bind(this), true === defer? 1 : defer);
            return this;
        }

        if (!this.hasClasses('x-hidden')) {
            return this;
        }

        this.removeClasses('x-hidden');
        this.trigger('show');
        return this;
    }

    ,setHidden: function(bool, defer) {
        return this[bool? 'show' : 'hide'](defer);
    }

    ,toggleDisplay: function(defer) {
        return this.setHidden(!this.isVisible(), defer);
    }

    ,collapse: function(size, side) {
        return this.addClasses('x-collapsed');
    }

    ,expand: function() {
        return this.removeClasses('x-collapsed');
    }

    ,setCollapsed: function(bool) {
        return this[bool? 'collapse' : 'expand']();
    }

    ,toggleCollapse: function() {
        this.toggleClasses('x-collapsed');
    }

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

    ,unmask: function() {
        if (this._maskEl) {
            this._maskEl.destroy();
            delete this._maskEl;
        }
        return this;
    }

    ,setDraggable: function(options) {
        if (!this.drag) {
            this.drag = new $.Drag(this);
        }
        this.drag.applyOptions(options);
    }

    ,setKeyListener: function(options) {
        if (!this.keyListener) {
            this.keyListener = new $.KeyListener(this, options);
        }
        return this;
    }

    ,setDefaults: function(options) {
        this.on('append', function(el) {
            if (el instanceof $.field.Field) {
                el.applyOptions(options);
            }
        });
        return this;
    }

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

    ,isRendered: function() {
        return document.body.contains(this.dom);
    }

    ,fx: function(options) {
        if (!this._animation) {
            this._animation = new $.Animation(this);
        }
        this._animation.applyOptions(options);
        return this._animation;
    }

    ,empty: function() {
        this.setHtml('');
    }

    ,destroy: function() {
        this.dom.parentNode.removeChild(this.dom);
    }
});

$.extend($.Element, {
    getDom: function(el) {
        if (el instanceof $.Element) {
            return el.dom;
        }

        if ($.Dom.is(el)) {
            return el;
        }
    }

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