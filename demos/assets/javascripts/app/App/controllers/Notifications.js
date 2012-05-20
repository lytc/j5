App.controllers.Notifications = App.Controller.extend({
    indexAction: function() {
        var pos = ['top left', 'top center', 'top right',
        'center left', 'center center', 'center right',
        'bottom left', 'bottom center', 'bottom right'];

        notifications = [];
        $.each(pos, function(p) {
            notifications.push(
                new $.Notify({
                    type: 'info'
                    ,html: p +  ': <strong>Oh snap!</strong> Change a few things up and try submitting again.'
                    ,width: 300
                    ,position: p
                    //,hidden: true
                    //,hideDelay: 2000
                })
            );

        });

        var button = new $.Button({
            appendTo: '#view'
            ,html: 'Show'
            ,styles: {
                margin: 20
            }
            ,listeners: {
                click: function() {
                    $.each(notifications, function(notification) {
                        notification.show();
                    });
                }
            }
        });
    }
});