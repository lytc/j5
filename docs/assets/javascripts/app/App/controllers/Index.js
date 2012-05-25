App.controllers.Index = App.Controller.extend({
	indexAction: function() {
        var line = '<p>test</p>';
        var html = '';
        for (var i = 0; i < 200; i ++) {
            html += line;
        }
        $.Component.get('#view').setHtml(html);
	}
});