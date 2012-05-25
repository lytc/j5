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
                                    ,pushState: '/buttons'
                                    ,children: [
                                        {
                                            html: 'Button Group'
                                            ,pushState: '/buttons/group'
                                        },{
                                            html: 'Button Menu'
                                            ,pushState: '/buttons/menu'
                                        }
                                    ]
                                },{
                                    html: 'Field'
                                    ,children: [
                                        {
                                            html: 'Trigger'
                                            ,pushState: '/fields/trigger'
                                        },{
                                            html: 'Select'
                                            ,pushState: '/fields/select'
                                        },{
                                            html: 'Date'
                                            ,pushState: '/fields/date'
                                        },{
                                            html: 'Range'
                                            ,pushState: '/fields/range'
                                        },{
                                            html: 'Group'
                                            ,pushState: '/fields/group'
                                        }
                                    ]
                                },{
                                    html: 'Form'
                                    ,pushState: '/forms'
                                    ,children: [

                                    ]
                                },{
                                    html: 'Slider'
                                    ,pushState: '/sliders'
                                },{
                                    html: 'List'
                                    ,pushState: '/lists'
                                },{
                                    html: 'Menu'
                                    ,pushState: '/menus'
                                },{
                                    html: 'Tree'
                                    ,pushState: '/trees'
                                },{
                                    html: 'Table'
                                    ,pushState: '/tables'
                                },{
                                    html: 'Modal'
                                    ,pushState: '/modals'
                                },{
                                    html: 'Alert'
                                    ,pushState: '/alerts'
                                },{
                                    html: 'Notifications'
                                    ,pushState: '/notifications'
                                },{
                                    html: 'Progress Bar'
                                    ,pushState: '/progress-bars'
                                },{
                                    html: 'Loading'
                                    ,pushState: '/loading'
                                },{
                                    html: 'Section'
                                    ,pushState: '/sections'
                                    ,children: [
                                        {
                                            html: 'Accordion'
                                            ,pushState: '/sections/accordion'
                                        }
                                    ]
                                },{
                                    html: 'Tab'
                                    ,pushState: '/tabs'
                                },{
                                    html: 'Calendar'
                                    ,pushState: '/calendars'
                                },{
                                    html: 'Paging'
                                    ,pushState: '/paging'
                                },{
                                    html: 'Color Palette'
                                    ,pushState: '/color-palettes'
                                }
                            ]
                        },{
                            html: 'Drag & Drop'
                            ,pushState: '/drag-drop'
                        },{
                            html: 'Animation'
                            ,pushState: '/animations'
                        },{
                            html: 'Event'
                            ,pushState: '/events'
                        },{
                            html: 'Key Listener'
                            ,pushState: '/key-listeners'
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
		
		function initpushState(root) {
			$.Element.get(root).selectAll('a[pushState]').on('click', function(e) {
				e.preventDefault();
				$.Navigator.navigate(this.getAttr('href'), {
					title: this.getAttr('title')
				});
			});
		}
		
		//initpushState('#nav');
		
		// $.Element.get('#view').on('change', function() {
		// 			initpushState(this);
		// 		});
	}
});