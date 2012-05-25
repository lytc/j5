App.controllers.Calendars = App.Controller.extend({
    indexAction: function() {
        calendar1 = new $.Calendar({
            appendTo: '#view'
        });

        calendar2 = new $.Calendar({
            appendTo: '#view'
            ,timeSelect: true
            ,format: 'm/d/Y H:i:s'
        });
    }
});