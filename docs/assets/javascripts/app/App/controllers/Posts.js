App.controllers.Posts = App.Controller.extend({
	indexAction: function() {
		var tpl = $.Template.get({url: '/assets/app/App/views/post/list.tpl'});
		
		var collection = new App.collections.Posts;
		collection.on('load', function(data) {
			var html = tpl.render({items: data});
			$.Element.get('#view').setHtml(html);
		});
		collection.load();
	}
	
	,viewAction: function() {
		var tpl = $.Template.get({url: '/assets/app/App/views/post/view.tpl'});
		var model = new App.models.Post;
		model.id(this.id);
		model.on('load', function(data) {
			var html = tpl.render({data: data});
			$.Element.get('#view').setHtml(html);
		});
		model.load();
	}
	
	,addAction: function() {
		form = new $.Form({
			action: '/posts'
			,method: 'POST'
			,width: 400
			,validateEvery: 500
			//,ajaxSubmit: true
			,defaults: {
				selectOnFocus: true
				,label: {
					width: 60
					,align: 'left'
					,style: {
						textAlign: 'left'
						,paddingRight: '5px'
					}
				}
				,input: {
					width: 250
				}
			}
			,appendTo: document.body
			,children: [
				{
					xtype: 'fieldset'
					,legend: {
						html: 'Infomation'
					}
					,defaults: {
						selectOnFocus: true
						,label: {
							width: 60
							,style: {
								textAlign: 'right'
								,paddingRight: '5px'
							}
						}
						,input: {
							width: 250
						}
					}
					,children: [
						{
							xtype: 'field.text'
							,name: 'email1'
							,label: {
								html: 'Email:'
							}
							,validates: ['require', 'email']
							,selectOnFocus: true
							,placeholder: 'E.g tcl_java@yahoo.com'
						},{
							xtype: 'field.checkbox'
							,name: 'status'
							,checked: true
							,label: {
								html: 'Status:'
							}
						},{
							xtype: 'field.radio'
							,name: 'radio'
							,label: {
								html: 'Radio:'
							}
						},{
							xtype: 'field.textarea'
							,name: 'info'
							,label: {
								html: 'Info:'
							}
							,input: {
								height: 100
							}
						}
					]
				},{
					xtype: 'field.hidden'
					,name: 'id'
				},{
					xtype: 'field.text'
					,name: 'email'
					,label: {
						html: 'Email:'
					}
					,validates: ['require', 'email']
					,selectOnFocus: true
					,placeholder: 'E.g tcl_java@yahoo.com'
				},{
					xtype: 'field.checkbox'
					,name: 'status'
					,label: {
						html: 'Status:'
					}
				},{
					xtype: 'field.radio'
					,name: 'radio'
					,label: {
						html: 'Radio:'
					}
				},{
					xtype: 'field.textarea'
					,name: 'info'
					,validates: 'require'
					,placeholder: 'Info...'
					,label: {
						html: 'Info:'
					}
					,input: {
						height: 100
					}
				},{
					xtype: 'button'
					,html: 'Save'
					,disableOnFormInvalid: true
					,style: {
						marginRight: '5px'
					}
				},{
					xtype: 'button'
					,html: 'Reset'
					,click: function() {
						form.reset();
					}
				}
			]
		});
		
		$.Element.get('#view').setHtml('').append(form.el);
		
		return;
		form = new $.Form({
			action: '/posts'
			,method: 'POST'
			,width: 600
			,validateEvery: 500
			,ajaxSubmit: true
			,preventSubmitOnInvalid: false
			//,preventBasicSubmit: false
			//,model: new App.models.Post()
			,defaults: {
				labelWidth: 100
				//,labelAlign: 'right'
			}
			,children: [
				{
					xtype: 'field.hidden'
					,name: 'id'
					,value: 10
				},{
					xtype: 'fieldset'
					,legend: 'Information'
					,defaults: {
						labelWidth: 100
					}
					,children: [
						{
							xtype: 'field.text'
							,name: 'name'
							,label: 'Name: '
							,selectOnFocus: true
							//,validates: ['require']
						},{
								xtype: 'field.text'
								,name: 'email'
								,label: 'Email: '
								,validates: ['require', 'email']
						},{
								xtype: 'field.text'
								,name: 'number'
								,label: 'Number: '
								,validates: [{
									type: 'number'
									,min: 100
									,max: 5000
								}]
						},{
								xtype: 'field.text'
								,name: 'url'
								,label: 'Url: '
								,validates: ['url']
						},{
							xtype: 'field.textarea'
							,name: 'description'
							,label: 'Description: '
							,height: 100
							,validates: {
								type: 'length'
								,min: 3
								,max: 5
							}
						}
					]
				},{
					xtype: 'field.text'
					,name: 'name'
					,label: 'Name: '
					//,selectOnFocus: true
					//,validates: ['require']
				},{
						xtype: 'field.text'
						,name: 'email'
						,label: 'Email: '
						,validates: ['require', 'email']
				},{
						xtype: 'field.text'
						,name: 'number'
						,label: 'Number: '
						,validates: [{
							type: 'number'
							,min: 100
							,max: 5000
						}]
				},{
						xtype: 'field.text'
						,name: 'url'
						,label: 'Url: '
						,validates: ['url']
				},{
					xtype: 'field.textarea'
					,name: 'description'
					,label: 'Description: '
					,height: 100
					,validates: {
						type: 'length'
						,min: 3
						,max: 5
					}
				},{
					xtype: 'field.checkbox'
					,name: 'status'
					,label: 'Status: '
				}/*,{
					xtype: 'field.button'
					,type: 'button'
					,text: 'Save'
					,click: function() {
						form.submit();
					}
				}*/
			]
			,buttons: [
				{
					type: 'submit'
					,html: 'Save'
					,disableOnFormInvalid: true
					,click: function() {
						form.bindToModel().save();
						form.submit();
					}
				},{
						type: 'button'
						,html: 'Reset'
						,click: function() {
							form.dom.reset();
						}
					}
			]
		});
		
		/*form.on('submit', function(e) {
			e.preventDefault();
			form.submit();
		});
		*/
		$.Element.get('#view').setHtml('').append(form);
	}
	
	,customAction: function() {
		console.log('custom action', this.getParam('abc'));
	}
});