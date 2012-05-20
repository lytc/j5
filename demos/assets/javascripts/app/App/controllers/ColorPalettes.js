App.controllers.ColorPalettes = App.Controller.extend({
    indexAction: function() {
        colorPalette = new $.ColorPalette({
            appendTo: '#view'
            ,value: 'CCFFFF'
        });
    }
});