App.controllers.Lists = App.Controller.extend({
    indexAction: function() {
        list = new $.List({
            appendTo: '#view'
            ,width: 200
            ,styles: {
                marginBottom: '20px'
            }

            ,children: [
                {
                    html: 'Item 1'
                },{
                    html: 'Item 2'
                },{
                    html: 'Item 3'
                },{
                    html: 'Item 4'
                },{
                    html: 'Item 5'
                },{
                    html: 'Item 6'
                }
            ]
        });

        list2 = new $.List({
            appendTo: '#view'
            ,width: 400
            ,direction: 'horizontal'
            ,multiSelect: true
            ,defaults: {
                width: 100
                ,height: 100
            }

            ,children: [
                {
                    html: 'Item 1'
                },{
                    html: 'Item 2'
                },{
                    html: 'Item 3'
                },{
                    html: 'Item 4'
                },{
                    html: 'Item 5'
                },{
                    html: 'Item 6'
                }
            ]
        });
    }
});