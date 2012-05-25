window.App = new $.App();
App.run({
	ready: function() {
        var search = new $.field.Text({
            appendTo: '#search'
            ,placeholder: 'Search...'
            ,input: {
                width: 280
            }
        });

        var classTree = new $.Tree({
            appendTo: '#class-tree'

            ,children: [
                {
                    html: 'J5'
                    ,expanded: true
                    ,children: new App.collections.ClassTrees
                }
            ]

            ,listeners: {
                select: function(items) {
                    var data = items[0].$data;
                    if (! data) {
                        return;
                    }
                    $.Navigator.navigate('/api?class=' + data.class);
                }
            }
        });

        var showProperties = new $.field.Checkbox({
            appendTo: '#class-toolbar'
            ,boxLabel: 'Properties'
        });

        var showSetters = new $.field.Checkbox({
            appendTo: '#class-toolbar'
            ,boxLabel: 'Setters'
        });

        var showMethods = new $.field.Checkbox({
            appendTo: '#class-toolbar'
            ,boxLabel: 'Methods'
        });

        var showEvents = new $.field.Checkbox({
            appendTo: '#class-toolbar'
            ,boxLabel: 'Events'
        });

        var searchInClass = new $.field.Text({
            appendTo: '#class-toolbar'
            ,classes: 'search'
            ,input: {
                width: 200
            }
            ,placeholder: 'Search...'
        });

		var view = new $.Component({
			el: $.Element.get('#view')
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
	}
});