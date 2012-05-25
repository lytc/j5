App.controllers.Loading = App.Controller.extend({
    indexAction: function() {
        loadingSpinner1 = new $.Loading({
            appendTo: '#view'
            ,styles: {
                margin: '20px'
            }
            //,width: 100
            //,height: 100
        });

        loadingSpinner2 = new $.Loading({
            appendTo: '#view'
            ,message: 'Loading...'
            ,styles: {
                margin: '20px'
            }
            //,width: 100
            //,height: 100
        });

        loadingSpinner3 = new $.Loading({
            appendTo: '#view'
            ,styles: {
                margin: '20px'
                ,padding: '5px'
                ,background: 'black'
                ,borderRadius: '4px'
            }
            ,color: 'white'
            //,width: 100
            //,height: 100
        });

        loadingSpinner4 = new $.Loading({
            appendTo: '#view'
            ,message: {
                html: 'Loading...'
                ,styles: {
                    color: 'red'
                }
            }
            ,styles: {
                margin: '20px'
                ,padding: '5px'
                ,background: 'blue'
                ,borderRadius: '4px'
            }
            ,size: 50
            ,color: 'white'
            //,width: 100
            //,height: 100
        });
    }
});