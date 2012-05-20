App.controllers.Animations = App.Controller.extend({
    indexAction: function() {
        new $.Component({
            appendTo: '#view'

            ,defaults: {
                xtype: 'button'
                ,styles: {
                    margin: '10px'
                }
            }
            ,children: [
                {
                    html: 'Fade'
                    ,click: function() {
                        el.fx().fade();
                    }
                },{
                    html: 'Fade Out'
                    ,click: function() {
                        el.fx().fadeOut();
                    }
                },{
                    html: 'Fade In'
                    ,click: function() {
                        el.fx().fadeIn();
                    }
                },{
                    html: 'Move To (300, 300)'
                    ,click: function() {
                        el.fx().move(300, 300);
                    }
                },{
                    html: 'Move To (0, 0)'
                    ,click: function() {
                        el.fx().move(0, 0);
                    }
                },{
                    html: 'Move To X (200)'
                    ,click: function() {
                        el.fx().moveX(200);
                    }
                },{
                    html: 'Move To Y (200)'
                    ,click: function() {
                        el.fx().moveY(200);
                    }
                },{
                    html: 'Slide'
                    ,click: function() {
                        el.fx().slide();
                    }
                },{
                    html: 'Slide Up'
                    ,click: function() {
                        el.fx().slideUp();
                    }
                },{
                    html: 'Slide Down'
                    ,click: function() {
                        el.fx().slideDown();
                    }
                },{
                    html: 'Rotate'
                    ,click: function() {
                        el.fx().rotate();
                    }
                },{
                    html: 'No concurrent'
                    ,click: function() {
                        el.fx({concurrent: false}).fadeOut().fadeIn().move(300, 300).slideUp().slideDown().move(100, 100).rotate();
                    }
                }
            ]
        });

        el = new $.Element({
            width: 100
            ,height: 100
            ,classes: 'el1'
            ,styles: {
                background: 'red'
                ,position: 'absolute'
            }
            ,listeners: {
                oAnimationEnd: function() {
                    console.log(111222)
                }
            }
        });

        el.appendTo('#view');
    }
});