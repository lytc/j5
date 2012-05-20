App.controllers.Buttons = App.Controller.extend({
	indexAction: function() {
		var mini = new $.Button({
			appendTo: '#view'
            ,html: 'Mini Button'
            ,scale: 'mini'
            ,styles: {
                margin: '10px'
            }
        });

        var small = new $.Button({
            appendTo: '#view'
            ,html: 'Small Button'
            ,scale: 'small'
            ,styles: {
                margin: '10px'
            }
        });

        var medium = new $.Button({
            appendTo: '#view'
            ,html: 'Medium Button'
            ,scale: 'medium'
            ,styles: {
                margin: '10px'
            }
        });

        var large = new $.Button({
            appendTo: '#view'
            ,html: 'Large Button'
            ,scale: 'large'
            ,styles: {
                margin: '10px'
            }
        });

        var iconButton = new $.Button({
            appendTo: '#view'
            ,html: 'Icon Button'
            ,scale: 'medium'
            ,styles: {
                margin: '10px'
            }
            ,icon: 'refresh'
        });

        var iconOnlyButton = new $.Button({
            appendTo: '#view'
            ,scale: 'medium'
            ,icon: 'refresh'
        });

        var disabledButton = new $.Button({
            appendTo: '#view'
            ,html: 'Disabled Button'
            ,scale: 'medium'
            ,disabled: true
            ,styles: {
                margin: '10px'
            }
        });

        var enableToggleButton = new $.Button({
            appendTo: '#view'
            ,html: 'Enable Toggle'
            ,scale: 'medium'
            ,toggleable: true
            ,listeners: {
                toggle: function(pressed) {
                    var html = pressed? 'Enable Toggle (pressed)' : 'Enable Toggle';
                    this.setHtml(html);
                }
            }
        });
    }

    ,groupAction: function() {
        var btnGroup = new $.button.Group({
            appendTo: '#view'
            ,styles: {
                margin: '10px'
            }
            ,scale: 'medium'
            ,children: [
                {
                    html: 'Item 1'
                },{
                    html: 'Item 2'
                },{
                    html: 'Item 3'
                },{
                    html: 'Item 4'
                }
            ]
        });

        var btnGroupToggleable = new $.button.Group({
            appendTo: '#view'
            ,styles: {
                margin: '10px'
            }
            ,toggleable: true
            ,children: [
                {
                    html: 'Item 1'
                },{
                    html: 'Item 2'
                },{
                    html: 'Item 3'
                },{
                    html: 'Item 4'
                }
            ]
        });

        var btnGroupIcon = new $.button.Group({
            appendTo: '#view'
            ,styles: {
                margin: '10px'
            }
            ,radioable: true
            ,children: [
                {
                    icon: 'align-left'
                },{
                    icon: 'align-right'
                },{
                    icon: 'align-center'
                },{
                    icon: 'align-justify'
                }
            ]
        });

        var btnGroupRadioable = new $.button.Group({
            appendTo: '#view'
            ,styles: {
                margin: '10px'
            }
            ,radioable: true
            ,children: [
                {
                    html: 'On'
                },{
                    html: 'Off'
                }
            ]
        });

    }

    ,menuAction: function() {
        var small = new $.Button({
            appendTo: '#view'
            ,html: 'Button Menu'
            ,scale: 'small'
            ,icon: 'refresh'
            ,styles: {
                margin: '10px'
            }
            ,menu: [
                {
                    html: 'Menu item Add'
                },{
                    html: 'Edit'
                },{
                    html: 'Delete'
                }
            ]
        });
    }
});