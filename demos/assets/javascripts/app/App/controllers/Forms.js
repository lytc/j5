App.controllers.Forms = App.Controller.extend({
	indexAction: function() {
		form = new $.Form({
			appendTo: '#view'
			,method: 'POST'
			,action: '/posts'
			,validateEvery: 500
			,submittingMask: 'Processing...'
			,defaults: {
				label: {
					width: 120
				}
				,input: {
					width: 300
				}
			}
			,children: [
				{
					xtype: 'field.text'
					,name: 'name'
					,label: 'Name: '
                    ,selectOnFocus: true
					,validates: 'require'
				},{
                    xtype: 'field.text'
                    ,name: 'name2'
                    ,label: 'Name2: '
                    ,disabled: true
                },{
					xtype: 'field.text'
					,name: 'email'
					,label: 'Email: '
					,validates: ['require', 'email']
					,placeholder: 'E.g. tcl_java@yahoo.com'
				},{
                    xtype: 'field.datetime'
                    ,name: 'date'
                    ,label: 'Date: '
                    ,validates: 'date'
                },{
                    xtype: 'field.datetime'
                    ,name: 'datetime'
                    ,label: 'Date & Time: '
                    ,timeSelect: true
                    ,format: 'd F Y H:i:s'
                    ,validates: {
                        type: 'date'
                        //,max: '10 May 2013'
                    }
                },{
                    xtype: 'field.checkbox'
                    ,name: 'checkbox'
                    ,label: 'Checkbox: '
                    ,checked: true
                },{
                    xtype: 'field.checkbox'
                    ,name: 'checkbox2'
                    ,label: 'Checkbox2: '
                    ,boxLabel: 'Box label'
                    ,disabled: true
                },{
                    xtype: 'field.radio'
                    ,name: 'radio'
                    ,label: 'Radio: '
                    ,checked: true
                },{
                    xtype: 'field.radio'
                    ,name: 'radio'
                    ,label: 'Radio: '
                    ,boxLabel: 'Radio2'
                    ,disabled: true
                },{
                    xtype: 'field.range'
                    ,name: 'range'
                    ,label: 'Range: '
                    ,value: 20
                },{
                    xtype: 'field.select'
                    ,name: 'timezone'
                    ,label: 'Timezone: '
                    ,data: [
                        '(GMT-12:00) International Date Line West'
                        ,'(GMT-11:00) Midway Island, Samoa'
                        ,'(GMT-10:00) Hawaii'
                        ,'(GMT-10:00) Aleutian Islands'
                        ,'(GMT-09:00) Alaska'
                    ]
                },{
                    xtype: 'field.group'
                    ,label: 'Checkbox Group: '
                    ,columns: 2
                    ,defaults: {
                        xtype: 'field.checkbox'
                        ,name: 'group1'
                    }
                    ,children: [
                        {
                            boxLabel: 'Item 1'
                        },{
                            boxLabel: 'Item 2'
                        },{
                            boxLabel: 'Item 3'
                        },{
                            boxLabel: 'Item 4'
                            ,checked: true
                        },{
                            boxLabel: 'Item 5'
                        }
                    ]
                },{
                    xtype: 'field.group'
                    ,label: 'Radio Group: '
                    ,columns: 3
                    ,defaults: {
                        xtype: 'field.radio'
                        ,name: 'group1'
                    }
                    ,children: [
                        {
                            boxLabel: 'Item 1'
                        },{
                            boxLabel: 'Item 2'
                        },{
                            boxLabel: 'Item 3'
                        },{
                            boxLabel: 'Item 4'
                            ,checked: true
                        },{
                            boxLabel: 'Item 5'
                        },{
                            boxLabel: 'Item 6'
                        }
                    ]
                },{
                    xtype: 'field.group'
                    ,label: 'Text Group: '
                    ,columns: 2
                    ,children: [
                        {
                            xtype: 'field.text'
                            ,name: 'date'
                        },{
                            xtype: 'field.text'
                            ,name: 'time'
                        }
                    ]
                },{
                    xtype: 'field.textarea'
                    ,label: 'Textarea: '
                    ,name: 'textarea'
                    ,resizable: 'horizontal'
                },{
					style: {
						textAlign: 'center'
						,marginTop: '5px'
					}
					,children: [
						{
							xtype: 'button'
							,html: 'Save'
							,disableOnFormInvalid: true
							,disableOnSubmitting: true
                            ,styles: {
                                marginLeft: '80px'
                            }
						},{
							xtype: 'button'
							,html: 'Reset'
							,styles: {
								marginLeft: '10px'
							}
							,click: function(e) {
								e.preventDefault();
								form.reset();
							}
						}
					]
				}
			]
		});
	}
});