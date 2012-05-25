App.controllers.Paging = App.Controller.extend({
    indexAction: function() {
        collection = new App.collections.Posts();

        table2 = new $.Table({
            appendTo: '#view'
            ,width: 900
            ,maskOnLoad: new $.Loading({
                message: 'Loading...'
            })
            ,styles: {
                marginBottom: '10px'
            }
            ,columns: [
                {
                    xtype: 'table.column.rownumberer'
                    ,html: '#'
                    ,width: 30
                },{
                    html: 'ID'
                    ,dataField: 'id'
                    ,width: 100
                    //,hidden: true
                },{
                    html: 'Name'
                    ,dataField: 'name'
                    ,editable: true
                    ,width: 300
                    ,renderer: function(v) {
                        return '<b>' + v + '</b>';
                    }
                },{
                    html: 'Value'
                    ,dataField: 'value'
                    ,width: 300
                    ,align: 'center'
                }
            ]
            ,collection: collection
        });

        collection.getPaginator().setAppendTo('#view').refreshPage();
    }
});