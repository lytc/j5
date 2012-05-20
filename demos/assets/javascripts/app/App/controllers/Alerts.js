App.controllers.Alerts = App.Controller.extend({
    indexAction: function() {
        var errorAlert = new $.Alert({
            appendTo: '#view'
            ,width: 300
            ,type: 'error'
            ,html: '<strong>Oh snap!</strong> Change a few things up and try submitting again.'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var warningAlert = new $.Alert({
            appendTo: '#view'
            ,width: 300
            ,type: 'warning'
            ,html: 'Best check yo self, you\'re not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var successAlert = new $.Alert({
            appendTo: '#view'
            ,width: 300
            ,type: 'success'
            ,html: '<strong>Well done!</strong> You successfully read this important alert message.'
            ,styles: {
                marginBottom: '10px'
            }
        });

        var infoAlert = new $.Alert({
            appendTo: '#view'
            ,width: 300
            ,type: 'info'
            ,html: '<strong>Heads up!</strong> This alert needs your attention, but it\'s not super important.'
            ,styles: {
                marginBottom: '10px'
            }
        });
    }
});