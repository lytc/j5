App.controllers.Events = App.Controller.extend({
    indexAction: function() {
        el1 = new $.Element({
            width: 200
            ,height: 200
            ,styles: {
                background: 'red'
                ,position: 'absolute'
            }
            ,listeners: {
                click: function(e) {
                    abc = new $.Event(e);
                }
            }
        });

        var wrapEl1 = el1.wrap({
            styles: {
                position: 'relative'
                ,padding: '20px'
                ,background: 'blue'
            }
        });

        wrapEl1.appendTo('#view');

        //el1.appendTo('#view');
    }
});