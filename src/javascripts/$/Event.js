$.Class.extend('$.Event', {
    constructor: function(event) {
        this.event = event;

        for (var i in event) {
            if (undefined !== this[i] || i == 'layerX' || i == 'layerY') {
                continue;
            }

            if ('function' == typeof event[i]) {
                this[i] = event[i].bind(event);
            } else {
                this[i] = event[i];
            }
        }
    }

    ,getXY: function() {
        if (!this.xy) {
            this.xy = {x: this.pageX, y: this.pageY};
        }
        return this.xy;
    }

    ,getOffset: function(el) {
        var e = this.event;
        el || (el = e.target);
        el = $.Element.get(el);

        var pageXY = el.getPageXY();
        pageXY.x = e.pageX - pageXY.x;
        pageXY.y = e.pageY - pageXY.y;

        return pageXY;
    }

    ,stop: function() {
        this.event.preventDefault();
        return this;
    }

    ,cancelBubble: function() {
        this.event.cancelBubble = true;
        return this;
    }

    ,getKey: function() {
        var e = this.event;
        return e.key || e.charCode || e.keyCode || e.which;
    }

    ,canModifyText: function() {
        var e = $.Event;
        var cannotModifyKeys = [
            e.KEY_ESCAPE,
            e.KEY_CONTROL,
            e.KEY_SHIFT,
            e.KEY_ALT,
            e.KEY_ENTER,
            e.KEY_LEFT,
            e.KEY_RIGHT,
            e.KEY_UP,
            e.KEY_DOWN
        ];

        return !$.Array(cannotModifyKeys).has(this.getKey());
    }
});

$.extend($.Event, {
    KEY_0: 48
    ,KEY_1: 49
    ,KEY_2: 50
    ,KEY_3: 51
    ,KEY_4: 52
    ,KEY_5: 53
    ,KEY_6: 54
    ,KEY_7: 55
    ,KEY_8: 56
    ,KEY_9: 57
    ,KEY_A: 65
    ,KEY_ACCEPT: 30
    ,KEY_ADD: 107
    ,KEY_ALT: 18
    ,KEY_B: 66
    ,KEY_BACK_QUOTE: 192
    ,KEY_BACK_SLASH: 220
    ,KEY_BACK_SPACE: 8
    ,KEY_C: 67
    ,KEY_CANCEL: 3
    ,KEY_CAPS_LOCK: 20
    ,KEY_CLEAR: 12
    ,KEY_CLOSE_BRACKET: 221
    ,KEY_COMMA: 188
    ,KEY_CONTEXT_MENU: 93
    ,KEY_CONTROL: 17
    ,KEY_CONVERT: 28
    ,KEY_D: 68
    ,KEY_DECIMAL: 110
    ,KEY_DELETE: 46
    ,KEY_DIVIDE: 111
    ,KEY_DOWN: 40
    ,KEY_E: 69
    ,KEY_END: 35
    ,KEY_ENTER: 13
    ,KEY_EQUALS: 61
    ,KEY_ESCAPE: 27
    ,KEY_EXECUTE: 43
    ,KEY_F: 70
    ,KEY_F1: 112
    ,KEY_F10: 121
    ,KEY_F11: 122
    ,KEY_F12: 123
    ,KEY_F13: 124
    ,KEY_F14: 125
    ,KEY_F15: 126
    ,KEY_F16: 127
    ,KEY_F17: 128
    ,KEY_F18: 129
    ,KEY_F19: 130
    ,KEY_F2: 113
    ,KEY_F20: 131
    ,KEY_F21: 132
    ,KEY_F22: 133
    ,KEY_F23: 134
    ,KEY_F24: 135
    ,KEY_F3: 114
    ,KEY_F4: 115
    ,KEY_F5: 116
    ,KEY_F6: 117
    ,KEY_F7: 118
    ,KEY_F8: 119
    ,KEY_F9: 120
    ,KEY_FINAL: 24
    ,KEY_G: 71
    ,KEY_H: 72
    ,KEY_HANGUL: 21
    ,KEY_HANJA: 25
    ,KEY_HELP: 6
    ,KEY_HOME: 36
    ,KEY_I: 73
    ,KEY_INSERT: 45
    ,KEY_J: 74
    ,KEY_JUNJA: 23
    ,KEY_K: 75
    ,KEY_KANA: 21
    ,KEY_KANJI: 25
    ,KEY_L: 76
    ,KEY_LEFT: 37
    ,KEY_M: 77
    ,KEY_META: 224
    ,KEY_MODECHANGE: 31
    ,KEY_MULTIPLY: 106
    ,KEY_N: 78
    ,KEY_NONCONVERT: 29
    ,KEY_NUMPAD0: 96
    ,KEY_NUMPAD1: 97
    ,KEY_NUMPAD2: 98
    ,KEY_NUMPAD3: 99
    ,KEY_NUMPAD4: 100
    ,KEY_NUMPAD5: 101
    ,KEY_NUMPAD6: 102
    ,KEY_NUMPAD7: 103
    ,KEY_NUMPAD8: 104
    ,KEY_NUMPAD9: 105
    ,KEY_NUM_LOCK: 144
    ,KEY_O: 79
    ,KEY_OPEN_BRACKET: 219
    ,KEY_P: 80
    ,KEY_PAGE_DOWN: 34
    ,KEY_PAGE_UP: 33
    ,KEY_PAUSE: 19
    ,KEY_PERIOD: 190
    ,KEY_PRINT: 42
    ,KEY_PRINTSCREEN: 44
    ,KEY_Q: 81
    ,KEY_QUOTE: 222
    ,KEY_R: 82
    ,KEY_RETURN: 14
    ,KEY_RIGHT: 39
    ,KEY_S: 83
    ,KEY_SCROLL_LOCK: 145
    ,KEY_SELECT: 41
    ,KEY_SEMICOLON: 59
    ,KEY_SEPARATOR: 108
    ,KEY_SHIFT: 16
    ,KEY_SLASH: 191
    ,KEY_SLEEP: 95
    ,KEY_SPACE: 32
    ,KEY_SUBTRACT: 109
    ,KEY_T: 84
    ,KEY_TAB: 9
    ,KEY_U: 85
    ,KEY_UP: 38
    ,KEY_V: 86
    ,KEY_W: 87
    ,KEY_X: 88
    ,KEY_Y: 89
    ,KEY_Z: 90
});