App.controllers.KeyListeners = App.Controller.extend({
    indexAction: function() {
        var input = new $.Element({
            dom: '<input>'
            ,attr: {
                type: 'text'
            }
        });

        input.appendTo('#view');

        var keyListener = new $.KeyListener(input);

        keyListener.on('!', function(e) {
            console.log('!');
        })

        keyListener.on('ctrl A', function(e) {
            console.log('ctrl A');
        })

        keyListener.on('esc', function(e) {
            console.log('esc');
        })

        keyListener.on('ctrl shift alt', function(e) {
            console.log('ctrl shift alt');
        });

    }
});