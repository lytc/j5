window.App = new $.App();
App.run({
	ready: function() {

        var navBar = new $.NavBar({
			appendTo: document.body
            ,fixed: true
			,children: [
				{
					xtype: 'menu'
					,children: [
						{
							html: 'Dashboard'
							,href: '/dashboard'
						},{
                            html: 'UI'
                            ,children: [
                                {
                                    html: 'Button'
                                    ,pushstate: '/buttons'
                                    ,children: [
                                        {
                                            html: 'Button Group'
                                            ,pushstate: '/buttons/group'
                                        },{
                                            html: 'Button Menu'
                                            ,pushstate: '/buttons/menu'
                                        }
                                    ]
                                },{
                                    html: 'Field'
                                    ,children: [
                                        {
                                            html: 'Trigger'
                                            ,pushstate: '/fields/trigger'
                                        },{
                                            html: 'Select'
                                            ,pushstate: '/fields/select'
                                        },{
                                            html: 'Date'
                                            ,pushstate: '/fields/date'
                                        },{
                                            html: 'Range'
                                            ,pushstate: '/fields/range'
                                        },{
                                            html: 'Group'
                                            ,pushstate: '/fields/group'
                                        }
                                    ]
                                },{
                                    html: 'Form'
                                    ,pushstate: '/forms'
                                    ,children: [

                                    ]
                                },{
                                    html: 'Slider'
                                    ,pushstate: '/sliders'
                                },{
                                    html: 'List'
                                    ,pushstate: '/lists'
                                },{
                                    html: 'Menu'
                                    ,pushstate: '/menus'
                                },{
                                    html: 'Tree'
                                    ,pushstate: '/trees'
                                },{
                                    html: 'Table'
                                    ,pushstate: '/tables'
                                },{
                                    html: 'Modal'
                                    ,pushstate: '/modals'
                                },{
                                    html: 'Alert'
                                    ,pushstate: '/alerts'
                                },{
                                    html: 'Notifications'
                                    ,pushstate: '/notifications'
                                },{
                                    html: 'Progress Bar'
                                    ,pushstate: '/progress-bars'
                                },{
                                    html: 'Loading'
                                    ,pushstate: '/loading'
                                },{
                                    html: 'Section'
                                    ,pushstate: '/sections'
                                    ,children: [
                                        {
                                            html: 'Accordion'
                                            ,pushstate: '/sections/accordion'
                                        }
                                    ]
                                },{
                                    html: 'Tab'
                                    ,pushstate: '/tabs'
                                },{
                                    html: 'Calendar'
                                    ,pushstate: '/calendars'
                                },{
                                    html: 'Paging'
                                    ,pushstate: '/paging'
                                },{
                                    html: 'Color Palette'
                                    ,pushstate: '/color-palettes'
                                }
                            ]
                        },{
                            html: 'Drag & Drop'
                            ,pushstate: '/drag-drop'
                        },{
                            html: 'Animation'
                            ,pushstate: '/animations'
                        },{
                            html: 'Event'
                            ,pushstate: '/events'
                        },{
                            html: 'Key Listener'
                            ,pushstate: '/key-listeners'
                        },{
							html: 'Application'
						}
					]
				}
			]
			//,html: '<ul><li>a</li></ul>'
		});
		
		var view = new $.Component({
			appendTo: document.body
			,el: {
				id: 'view'
			}
			,style: {
				padding: '10px'
			}
		});
		
		function initPushState(root) {
			$.Element.get(root).selectAll('a[pushstate]').on('click', function(e) {
				e.preventDefault();
				$.Navigator.navigate(this.getAttr('href'), {
					title: this.getAttr('title')
				});
			});
		}
		
		//initPushState('#nav');
		
		// $.Element.get('#view').on('change', function() {
		// 			initPushState(this);
		// 		});
	}
});