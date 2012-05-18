App.controllers.Tabs = App.Controller.extend({
    indexAction: function() {
        tab = new $.Tab({
            appendTo: '#view'
            ,activeTab: 1
            ,height: 200
            ,styles: {
                border: '1px solid #ccc'
                ,padding: '5px'
                ,marginBottom: '20px'
            }
            ,children: [
                {
                    header: 'Tab 1'
                    ,body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia elit nec mi ornare et viverra massa pharetra. Phasellus mollis, massa sed suscipit pharetra, nunc tellus sagittis nunc, et tempus dui lorem a ipsum.'
                },{
                    header: 'Tab 2'
                    ,body: '2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia elit nec mi ornare et viverra massa pharetra. Phasellus mollis, massa sed suscipit pharetra, nunc tellus sagittis nunc, et tempus dui lorem a ipsum.'
                },{
                    header: 'Tab 3'
                    ,body: '3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia elit nec mi ornare et viverra massa pharetra. Phasellus mollis, massa sed suscipit pharetra, nunc tellus sagittis nunc, et tempus dui lorem a ipsum.'
                },{
                    header: 'Tab 4'
                    ,body: '4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia elit nec mi ornare et viverra massa pharetra. Phasellus mollis, massa sed suscipit pharetra, nunc tellus sagittis nunc, et tempus dui lorem a ipsum.'
                }
            ]
        });

        tab2 = new $.Tab({
            appendTo: '#view'
            ,activeTab: 1
            ,children: [
                {
                    header: 'Tab 1'
                    ,body: {
                        children: [
                            {
                                xtype: 'form'
                                ,defaults: {
                                    xtype: 'field.text'
                                    ,label: {
                                        width: 80
                                    }
                                    ,input: {
                                        width: 300
                                    }
                                }
                                ,children: [
                                    {
                                        label: {
                                            html: 'Name'
                                        }
                                    },{
                                        label: {
                                            html: 'Email'
                                        }
                                    },{
                                        label: {
                                            html: 'Address'
                                        }
                                    },{
                                        xtype: 'button'
                                        ,html: 'Send'
                                        ,styles: {
                                            marginLeft: '80px'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },{
                    header: 'Tab 2'
                    ,body: '2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia elit nec mi ornare et viverra massa pharetra. Phasellus mollis, massa sed suscipit pharetra, nunc tellus sagittis nunc, et tempus dui lorem a ipsum.'
                }
            ]
        });
    }
});