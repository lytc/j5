App.controllers.Modals = App.Controller.extend({
    indexAction: function() {
        var modal = new $.Modal({
            children:  {
                html: '<h2>Hi!</h2><p>This is a simple modal!</p><p><i>Click me to close!</i></p>'
                ,styles: {
                    width: '300px'
                    ,background: 'white'
                    ,padding: '10px'
                }
                ,listeners: {
                    click: function() {
                        modal.hide();
                    }
                }
            }

        });

        var button = new $.Button({
            appendTo: '#view'
            ,html: 'Open Modal'
            ,styles: {
                margin: '10px'
            }
            ,click: function() {
                modal.show();
            }
        });


        var modalWithForm = new $.Modal({
            children: {
                styles: {
                    background: 'white'
                    ,padding: '10px'
                    ,borderRadius: '4px'
                }
                ,width: 300
                ,children: {
                    xtype: 'form'
                    ,width: 400
                    ,validateEvery: 500
                    ,defaults: {
                        label: {
                            width: 80
                        }
                        ,input: {
                            width: 200
                        }
                    }
                    ,children: [
                        {
                            xtype: 'field.text'
                            ,name: 'email'
                            ,label: {
                                html: 'Email: '
                            }
                            ,validates: ['require', 'email']
                        },{
                            xtype: 'field.text'
                            ,name: 'password'
                            ,label: {
                                html: 'Password: '
                            }
                            ,validates: [
                                'require'
                                ,{
                                    type: 'length'
                                    ,min: 6
                                }
                            ]
                        },{
                            xtype: 'button'
                            ,html: 'Save'
                            ,disableOnFormInvalid: true
                            ,styles: {
                                marginLeft: '80px'
                                ,marginRight: '10px'
                            }
                        },{
                            xtype: 'button'
                            ,html: 'Cancel'
                            ,click: function(e) {
                                e.preventDefault();
                                modalWithForm.hide();
                            }
                        }
                    ]
                }
            }

            ,listeners: {
                show: function() {
                    //console.log(abc = this);
                    //this.child(0).child(0).child(0).focus();
                }
            }
        });

        var withForm = new $.Button({
            appendTo: '#view'
            ,html: 'Modal With Form'
            ,styles: {
                margin: '10px'
            }
            ,click: function() {
                modalWithForm.show();
            }
        });
    }
});