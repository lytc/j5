App.controllers.Menus = App.Controller.extend({
	indexAction: function() {
		menu = new $.Menu({
			appendTo: '#view'
            //,hideGutter: true
			,children: [
				{
					html: 'Menu item 1'
                    ,icon: 'refresh'
				},{
					html: 'Menu item 2'
                    ,icon: 'volume-down'
					,children: [
						{
							html: 'Menu item 2#1'
						},{
							html: 'Menu item 2#2'
							,children: [
								{
									html: 'Menu item 2#2#1'
                                    ,icon: 'volume-down'
                                },{
									html: 'Menu item 2#2#2'
								},{
									html: 'Menu item 2#2#3'
								}
							]
						},{
							html: 'Menu item 2#3'
						},{
							html: 'Menu item 2#4'
						}
					]
				},{
					html: 'Menu item 3'
                    ,icon: 'edit'
				},{
					html: 'Menu item 4'
				}
			]
		});
	}
});