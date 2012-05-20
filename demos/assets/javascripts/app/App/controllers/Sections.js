App.controllers.Sections = App.Controller.extend({
    indexAction: function() {
        var section = new $.Section({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                marginBottom: '20px'
            }
            ,header: 'Section Example'
            ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
        });

        var sectionCollapsible = new $.Section({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                marginBottom: '20px'
            }
            ,header: 'Section Collapsible'
            ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
            ,collapsible: true
            //,collapsed: true
        });

        var sectionCollapsible = new $.Section({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                marginBottom: '20px'
            }
            ,header: 'Section Collapsed'
            ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
            ,collapsed: true
        });

        var sectionCustomStyle = new $.Section({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                marginBottom: '20px'
                ,border: '1px solid #ccc'
                ,borderRadius: '4px'
                ,padding: '5px'
            }
            ,header: 'Section Custom Style'
            ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
        });

        var section2 = new $.Section({
            appendTo: '#view'
            ,width: 400
            ,styles: {
                marginBottom: '20px'
                ,border: '1px solid #ccc'
                ,borderRadius: '4px'
            }
            ,header: {
                html: 'Section With Form'
                ,styles: {
                    padding: '0 5px'
                }
            }
            ,body: {
                styles: {
                    padding: '0 5px 5px 5px'
                }
                ,children: [
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
        });
    }

    ,accordionAction: function() {
        var component = new $.Component({
            appendTo: '#view'
            ,width: 400

            ,defaults: {
                xtype: 'section'
                ,collapsible: 'checkbox' // radio
                ,collapsed: true
            }

            ,children: [
                {
                    header: 'Section 1'
                    ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
                },{
                    header: 'Section 2'
                    ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
                },{
                    header: 'Section 3'
                    ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
                },{
                    header: 'Section 4'
                    ,body: '<p>All content and graphics on this web site are the property of the company Refsnes Data.</p>'
                }
            ]
        });
    }
});