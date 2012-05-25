App.controllers.DragDrop = App.Controller.extend({
    indexAction: function() {
        var el = new $.Element({
            width: 50
            ,height: 50
            ,styles: {
                background: 'red'
                ,color: 'white'
            }
        });

        el.appendTo('#view');

        drag1 = new $.drag.Anywhere(el);

        var box = new $.Element({
            width: 300
            ,height: 300
            ,styles: {
                border: '1px solid #ccc'
            }
        });

        box.appendTo('#view');

        var el2 = new $.Element({
            width: 50
            ,height: 50
            ,styles: {
                background: 'blue'
            }
        });

        box.append(el2);

        drag2 = new $.drag.Anywhere(el2, {
            constrain: true
            ,lockX: true
        });

        var el3 = new $.Element({
            width: 50
            ,height: 50
            ,styles: {
                background: 'green'
                ,position: 'absolute'
            }
        });

       // el3.appendTo('#view');
        //$.Element.get('#view').on('mousemove', function(e) {
        //    el3.setLeft(e.clientX).setTop(e.clientY);
        //});
    }
});