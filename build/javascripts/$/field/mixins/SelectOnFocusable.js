$.define('$.field.mixins.SelectOnFocusable', {
    setSelectOnFocus: function(bool) {
        if (bool && !this._selectOnFocusCallback) {
            this._selectOnFocusCallback = function() {
                this.dom.select();
            }
            this.inputEl.on('focus', this._selectOnFocusCallback);
        } else if (!bool && this._selectOnFocusCallback) {
            this.inputEl.un('focus', this._selectOnFocusCallback);
        }
        return this;
    }
});