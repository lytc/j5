App.controllers.Api = App.Controller.extend({
    indexAction: function() {
        var klass = this.getParam('class')
            ,model = new App.models.Api()
            ,tpl = new $.Template.get({url: '/assets/app/App/views/view.tpl'});

        model.set('id', klass);
        model.load(function() {
            $.Component.get('#view').setHtml(tpl.render(model.toJson()));
        });
    }
});