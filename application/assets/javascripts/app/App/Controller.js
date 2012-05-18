App.Controller = $.Controller.extend({
    before: function() {
        $.Component.get('#view').empty();
    }
});