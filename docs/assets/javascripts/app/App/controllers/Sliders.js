App.controllers.Sliders = App.Controller.extend({
    indexAction: function() {
        slider1 = new $.Slider({
            appendTo: '#view'
            ,styles: {
                margin: '30px'
            }
            ,value: 50
        });

        slider2 = new $.Slider({
            appendTo: '#view'
            ,styles: {
                margin: '30px'
            }
            ,min: 15
            ,max: 80
            ,value: 40
        });

        slider3 = new $.Slider({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                margin: '30px'
            }
            ,min: 50
            ,max: 200
            ,value: 150
            ,step: 50
        });

        slider4 = new $.Slider({
            appendTo: '#view'
            ,styles: {
                margin: '30px'
            }
            ,direction: 'vertical'
            ,value: 50
        });

        slider5 = new $.Slider({
            appendTo: '#view'
            ,styles: {
                margin: '30px'
            }
            ,direction: 'vertical'
            ,min: 15
            ,max: 80
            ,value: 40
        });

        slider6 = new $.Slider({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                margin: '30px'
            }
            ,direction: 'vertical'
            ,min: 50
            ,max: 200
            ,value: 150
            ,step: 50
        });
    }
});