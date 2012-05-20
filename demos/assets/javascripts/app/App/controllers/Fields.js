App.controllers.Fields = App.Controller.extend({
    indexAction: function() {

    }

    ,triggerAction: function() {
        field = new $.field.Trigger({
            appendTo: '#view'
            ,width: 300
            ,label: {
                width: 80
                ,html: 'Trigger: '
            }
        });
    }

    ,selectAction: function() {
        select = new $.field.Select({
            appendTo: '#view'
            ,width: 300
            ,label: {
                width: 80
                ,html: 'Select:'
            }
            ,validates: ['require']
            ,data: ['1 Item 1' ,'2 Item 2', '3 Item 3']


        });

        select2 = new $.field.Select({
            appendTo: '#view'
            ,width: 300
            ,label: {
                width: 80
                ,html: 'Select:'
            }
            ,validates: ['require']
            ,data: [[1, '1 Item 1'] ,[2, '2 Item 2'], [3, '3 Item 3']]


        });

        select3 = new $.field.Select({
            appendTo: '#view'
            ,width: 300
            ,label: {
                width: 80
                ,html: 'Select:'
            }
            ,validates: ['require']
            ,data: [
                {id: 1, value: 'value1'},
                {id: 2, value: 'value2'},
                {id: 3, value: 'value3'},
                {id: 4, value: 'value4'},
                {id: 5, value: 'value5'},
                {id: 6, value: 'value6'},
                {id: 7, value: 'value7'},
                {id: 8, value: 'value8'},
                {id: 9, value: 'value9'}
            ]
        });
    }

    ,dateAction: function() {
        field1 = new $.field.DateTime({
            appendTo: '#view'
            ,label: {
                width: 80
                ,html: 'Date: '
            }
        });

        field2 = new $.field.DateTime({
            appendTo: '#view'
            ,label: {
                width: 80
                ,html: 'Date Time: '
            }
            ,timeSelect: true
            ,format: 'm/d/Y H:i:s'
        });
    }

    ,rangeAction: function() {
        range1 = new $.field.Range({
            appendTo: '#view'
            ,length: 300
            ,label: 'Range: '
            ,styles: {
                margin: '10px'
            }
            ,min: 30
            ,value: 50
        });

        range2 = new $.field.Range({
            appendTo: '#view'
            ,length: 600
            ,label: 'Range2: '
            ,max: 150
            ,step: 30
        });

        range3 = new $.field.Range({
            appendTo: '#view'
            ,length: 400
            ,label: 'Range3: '
            ,max: 150
            ,step: 10
            ,direction: 'vertical'
        });
    }

    ,groupAction: function() {
        group1 = new $.field.group.Checkbox({
            appendTo: '#view'
            ,styles: {
                marginBottom: '20px'
            }
            ,label: {
                html: 'Checkbox Group'
                ,width: 120
            }
            ,width: 360
            ,name: 'id'
            ,columns: 3
            ,children: [
                {
                    boxLabel: 'Item 1'
                    ,name: 'item1'
                },{
                    boxLabel: 'Item 2'
                    ,name: 'item2'
                },{
                    boxLabel: 'Item 3'
                    ,name: 'item3'
                },{
                    boxLabel: 'Item 4'
                    ,name: 'item4'
                },{
                    boxLabel: 'Item 5'
                    ,name: 'item5'
                },{
                    boxLabel: 'Item 6'
                    ,name: 'item6'
                },{
                    boxLabel: 'Item 7'
                    ,name: 'item7'
                },{
                    boxLabel: 'Item 8'
                    ,name: 'item8'
                },{
                    boxLabel: 'Item 9'
                    ,name: 'item9'
                }
            ]
        });

        group2 = new $.field.group.Radio({
            appendTo: '#view'
            ,styles: {
                marginBottom: '20px'
            }
            ,label: {
                html: 'Radio Group'
                ,width: 120
            }
            ,width: 360
            ,name: 'id'
            ,columns: 3
            ,children: [
                {
                    boxLabel: 'Item 1'
                },{
                    boxLabel: 'Item 2'
                    ,checkedValue: 2
                    ,checked: true
                },{
                    boxLabel: 'Item 3'
                },{
                    boxLabel: 'Item 4'
                },{
                    boxLabel: 'Item 5'
                },{
                    boxLabel: 'Item 6'
                },{
                    boxLabel: 'Item 7'
                },{
                    boxLabel: 'Item 8'
                },{
                    boxLabel: 'Item 9'
                }
            ]
        });

        group3 = new $.field.Group({
            appendTo: '#view'
            ,columns: 3
            ,width: 360
            ,label: {
                html: 'Number: '
                ,width: 100
            }
            ,defaults: {
                xtype: 'field.text'
            }
            ,children: [
                {
                },{
                },{
                }
            ]
        });
    }
});