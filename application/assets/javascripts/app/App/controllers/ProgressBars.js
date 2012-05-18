App.controllers.ProgressBars = App.Controller.extend({
    indexAction: function() {
        var progressBar = new $.ProgressBar({
            appendTo: '#view'
            ,percentage: 10
            ,html: 'Loading...'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var progressBar = new $.ProgressBar({
            appendTo: '#view'
            ,percentage: 50
            ,html: 'Loading...'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var progressBar = new $.ProgressBar({
            appendTo: '#view'
            ,percentage: 90
            ,html: 'Loading...'
            ,styles: {
                marginBottom: '10px'
            }
        });


        var progressBarStriped = new $.ProgressBar({
            appendTo: '#view'
            ,width: 400
            ,percentage: 40
            ,striped: true
            ,styles: {
                marginBottom: '10px'
            }
        });

        var progressBarAnimate = new $.ProgressBar({
            appendTo: '#view'
            ,width: 400
            ,percentage: 100
            ,striped: true
            ,animate: true
            ,styles: {
                marginBottom: '10px'
            }
        });

        var progressBarWithLoop1 = new $.ProgressBar({
            appendTo: '#view'
            ,width: 400
            ,percentage: 0
            ,striped: true
            ,animate: true
            ,loop: true
            ,html: 'Loop 1 time ( {0} )'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var progressBarWithLoop2 = new $.ProgressBar({
            appendTo: '#view'
            ,width: 400
            ,percentage: 0
            ,striped: true
            ,animate: true
            ,loop: 2
            ,html: 'Loop 2 times ( {0} )'
            ,styles: {
                marginBottom: '10px'
            }
        });

        progressBarWithLoop3 = new $.ProgressBar({
            appendTo: '#view'
            ,width: 400
            ,percentage: 0
            ,striped: true
            ,animate: true
            ,loop: -1
            ,html: 'Loop forever ( {0} )'
            ,styles: {
                marginBottom: '10px'
            }
        });
    }
});