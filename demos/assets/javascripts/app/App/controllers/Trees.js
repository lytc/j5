App.controllers.Trees = App.Controller.extend({
    indexAction: function() {
        tree = new $.Tree({
            children: [
                {
                    html: 'Item #1'
                    ,$data: {a: 1, b: 2}
                    ,children: [
                        {
                            html: 'Item #11'
                            ,children: [
                                {
                                    html: 'Item #11'
                                },{
                                    html: 'Item #11'
                                },{
                                    html: 'Item #11'
                                }
                            ]
                        },{
                          html: 'Item #11'
                        },{
                           html: 'Item #11'
                        }
                    ]
                },{
                    html: 'Item #2'
                    ,children: [
                        {
                            html: 'Item #11'
                        },{
                            html: 'Item #11'
                        },{
                            html: 'Item #11'
                        }
                    ]
                },{
                    html: 'Item #3'
                    ,children: [
                        {
                            html: 'Item #11'
                        },{
                            html: 'Item #11'
                        },{
                            html: 'Item #11'
                        }
                    ]
                },{
                    html: 'Item #4'
                },{
                    html: 'Item #5'
                }
            ]

            ,listeners: {
                select: function(items) {
                    console.log(items);
                }
            }
        });

        var comp = new $.Component({
            appendTo: '#view'
            ,children: tree
            ,width: 300
            ,styles: {
                padding: '10px'
                ,border: '1px solid #ccc'
                ,borderRadius: '4px'
                ,maxHeight: '300px'
                ,overflowY: 'auto'
            }
        });
    }
});