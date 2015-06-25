/*联系人列表*/
var MessageManagePageModel = function(){
	// Message Models
	var Message = Backbone.Model.extend({
		urlRoot: function(){
			return URL_MESSAGE;
		}
	});
	
	var MessageCollection =  Backbone.Collection.extend({ //联系人数组
		model: Message,
		url: function(){
			return URL_MESSAGE;
		}
	});
	
	var MessageItemView = Backbone.View.extend({
		tagName: 'tr', 
		tagClass: 'border',
		template: _.template($('#messagelistitem-template').html()),  
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        
	        return this;
	    },
	    
	});
	
	var MessageListView =  Backbone.View.extend({
		el: $('div #middle #message_list>tbody'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
		events: {			  
	    },
	    render: function() {
	    	this.$el.empty(); 
	    	var messageheight = $(".middle_box").height();
	    	var midheight = $("#middle").height();
	    	var mainheight = $("#main").height();
	    	var addedhei = (this.collection.length-1) * 70;
	    	if(this.collection.length > 1){
	    		$("#main").css("height",mainheight+addedhei);
	    		$("#middle").css("height",midheight+addedhei);
	    		$(".middle_box").css("height",messageheight+addedhei);
	    	}
	        this.collection.each( function( $model ) {
		            var itemview = new MessageItemView({model: $model}); 		            
		            this.$el.append( itemview.render().el );  
	        	}, this);
	        
	        return this;
	    },
	});
	 MessageManagePageModel.prototype.init = function(){ 
    	var myMessages = new MessageCollection();
    	var messageListView = new MessageListView({
    	        collection: myMessages   	        
    	});
    	myMessages.fetch({reset:true}); 
	 }
}

$(document).ready(function(){
	$("#sendMessageBtn").click(function(){
		$("#sendMessage").dialog({
			autoOpen: true,
			width: 500,
			buttons: {
				"发送": function() { 
					var dialogParent = $("#message");  
					var dialogOwn = $("#sendMessage"); 
	                $(this).dialog("destroy").remove(); 
	                dialogParent.append(dialogOwn);  
				}, 
				"取消": function() { 
					var dialogParent = $("#message");  
					var dialogOwn = $("#sendMessage"); 
	                $(this).dialog("destroy").remove(); 
	                dialogParent.append(dialogOwn);
				} 
			}
		});
	});
});