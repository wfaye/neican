/*联系人列表*/
var ContactManagePageModel = function(){
	// Contact Models
	var Contact = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			if(tag != null && tag != ""){
				return URL_CONTACTS+"/"+tag;
			}else{
				return URL_CONTACTS;
			}
		}
	});
	
	var ContactCollection =  Backbone.Collection.extend({ //联系人数组
		model: Contact,
		url: function(){
			if(tag != null && tag != ""){
				return URL_CONTACTS+"/"+tag;
			}else{
				return URL_CONTACTS;
			}
		}
	})
	
	var cid;
	var tagName;
	var flag;
	var ContactTag = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			if(flag == "0"){
				return URL_CONTACTS+"/"+cid+"/"+tagName;
			}else if(flag == "1"){
				return "/ws/tags";
			}else{}
		},
		idAttribute: "_id"
	});
	
	var ContactTagCollection =  Backbone.Collection.extend({ //联系人数组
		model: ContactTag,
		url: function(){
			if(flag == "0"){
				return URL_CONTACTS+"/"+cid+"/"+tagName;
			}else if(flag == "1"){
				return "/ws/tags";
			}else{}
		}
	});
	
	
	// Contact Views  model数据发生变化时页面怎么响应
	var ContactItemView = Backbone.View.extend({
		tagName: 'tr', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#contactlistitem-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.tagitclose = this.$(".tagitclose");
		},
		events: {
		      "click .checkbox"   : "toggleCheckbox",
		      "click .contact_img" : "toggleDetail",
		      "click .contact_name" : "toggleDetail",
		      "click .toggle"   : "toggleDone",
		      "mouseover .singletaglist" : "showTagList",
		      "keyup #myTags" : "addtag",
		      "click .tagitclose" : "deletetag",
		      "click .singletaglist" : "hideTagList"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.attr("class","contact-item");
	        this.taglist = this.$(".singletaglist");
	        this.myTags = this.$("#myTags");
	        
	        return this;
	    },
	    toggleDetail : function(){
	    	var z=1;
	    	var y=this.model.id;
	    	x=$("#contact_page").detach();
	   	 	var contactDetail = new ContactDetailManagePageModel().init(z,y);
	    },
	    showTagList : function() {
	        this.$(".myTagsUl").css("display","block");
	        this.$("#myTags").tagit();
	    },
	    hideTagList : function() {
	        $(".myTagsUl").css("display","none");
	    },
	    addtag : function(e){
	    	if(e.keyCode == 13){
	    		var linum = this.$("li").length-1;
		    	var tagname = this.$("input[name='tags']").eq(linum-1).val();
		    	cid = this.model.id;
		    	tagName = tagname;
		    	flag = 0;
		    	var ctag = new ContactTagCollection();
		    	var ctagmodel = new ContactTag();
		    	ctagmodel.save();
	    	}
	    },
	    deletetag : function(){
	    	cid = this.model.id;
	    	tagName = arguments[0].currentTarget.id;
	    	$.ajax({
	    	    url: "/ws/contacts/" + cid + "/" + tagName,
	    	    type: 'DELETE',
	    	    success: function(result) {
	    	        // Do something with the result
	    	    }
	    	});
	    }
	});
	
	var ContactListView =  Backbone.View.extend({
		el: $('div #middle_contact #contact_list>tbody'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
	    	this.allCheckbox = $("#toggle-all");
	    	this.clearcommon = this.$(".clearcommon");
	    	this.showcommontags = this.$("#showcommontags");
	    	this.common_tags = this.$(".common_tags");
		},
		events: {			  
			"click #clearCompleted" : "clearContactCompleted",
			"mouseover #showcommontags" : "showCommonTags",
			"keyup #commontagstagit" : "addCommonTags",
			"click .common_tags" : "removeCommonTags",
			"click #showcommontags" : "clearCommonTags"
	    },
	    render: function() {
//	    	this.$el.empty(); 
	    	var contactheight = $(".middle_contact_box").height();
	    	var midheight = $("#middle_contact").height();
	    	var mainheight = $("#main").height();
	    	var addedhei = (this.collection.length-5) * 56;
	    	if(this.collection.length > 5){
	    		$("#main").css("height",mainheight+addedhei);
	    		$("#middle_contact").css("height",midheight+addedhei);
	    		$(".middle_contact_box").css("height",contactheight+addedhei);
	    	}
	        this.collection.each( function( $model ) {
		            var itemview = new ContactItemView({model: $model}); 		            
		            this.$el.append( itemview.render().el );  //参数添加到tbody
	        	}, this);
	        return this;
	    },
	    clearContactCompleted: function() {
	    	var ids = new Array();
	    	var models = new Array();
	    	var checkbox = $('input[name="chk_contact"]'); 
	    	var chknum = 0;
	    	var num = 0;
	        for(var i=0;i<checkbox.length;i++){
	        	if(checkbox[i].checked == true){
	        		ids[num] = checkbox[i].value;
	        		chknum++;
	        		num++;
	        	}
	        }    
	        for(var j = 0;j < chknum;j++){
	        	models[j] = this.collection.get(ids[j]);
	        }
	        _.invoke(models, 'destroy');
	        $("#toggle-all").attr("checked",this.checked);
	        var x = $("#contact_op").detach();
	        $("#contact_list>tbody").empty();
	        $("#contact_list>tbody").prepend(x);
	        ContactManagePageModel.prototype.init();
	    },
	    showCommonTags : function(){
//	    	var mycollection;
//	    	var myRefreshContacts = new ContactCollection();
//	    	myRefreshContacts.fetch({
//	    		success : function(collection, response) {
//	    			mycollection = response;
//	    			console.log(response);
//	    		}
//	    	}); 
	    	var tags = new Array();
	    	var map = new HashMap(); 
	    	var ids = new Array();
	    	var models = new Array();
	    	var checkbox = $('input[name="chk_contact"]'); 
	    	var chknum = 0;
	    	var num = 0;
	    	var comtagnum = 0;
	        for(var i=0;i<checkbox.length;i++){
	        	if(checkbox[i].checked == true){
	        		ids[num] = checkbox[i].value;
	        		chknum++;
	        		num++;
	        	}
	        }    
	        for(var j = 0;j < chknum;j++){
	        	models[j] = this.collection.get(ids[j]);
	        	var tagnum = models[j].get("tags").length;
	        	for(var k = 0;k < tagnum;k++){
	        		if(map.containsKey(models[j].get("tags")[k].name)){
	        			var value = map.get(models[j].get("tags")[k].name);
	        			map.remove(models[j].get("tags")[k].name);
	        			map.put(models[j].get("tags")[k].name,value+1);
	        			if(map.get(models[j].get("tags")[k].name) == chknum){
	        				tags[comtagnum] = models[j].get("tags")[k].name;
	        				comtagnum++;
	        			}
	        		}else{
	        			map.put(models[j].get("tags")[k].name,1);
	        			if(map.get(models[j].get("tags")[k].name) == chknum){
	        				tags[comtagnum] = models[j].get("tags")[k].name;
	        				comtagnum++;
	        			}
	        		}
	        	}
	        }
	    	$("#commontags").html( _.template($("#commontagsitem-template").html(), {tags:tags})); 
	    	this.$("#commontagstagit").tagit();
	    	$(".common_tags_li>a").addClass("common_tags");
	    	this.$("#commontagstagit").css("display","block");
	    },
	    addCommonTags : function(e){
	    	if(e.keyCode == 13){
	    		$(".common_tags_li>a").addClass('common_tags');
	    		var mytargets = new Array();
		    	var ids = new Array();
		    	var models = new Array();
		    	var checkbox = $('input[name="chk_contact"]'); 
		    	var chknum = 0;
		    	var num = 0;
		        for(var i=0;i<checkbox.length;i++){
		        	if(checkbox[i].checked == true){
		        		ids[num] = parseInt(checkbox[i].value);
		        		chknum++;
		        		num++;
		        	}
		        }    
		        mytargets[0] = {objectType:"contact",objectIdList:ids};
	    		var linum = $("#commontagstagit>li").length-1;
	    		console.log(linum);
		    	var tagname = new Array();
		    	tagname[0] = $("#commontagstagit>li>input[name='tags']").eq(linum-1).val();
		    	flag = 1;
		    	var ctag = new ContactTagCollection();
		    	var ctagmodel = new ContactTag();
		    	ctagmodel.save({tagList:tagname,targets:mytargets});
	    	}
	    },
	    clearCommonTags : function(){
	    	this.$("#commontagstagit").css("display","none");
	    },
	    removeCommonTags : function(){
	    	alert("llll");
	    		var mytargets = new Array();
		    	var ids = new Array();
		    	var models = new Array();
		    	var checkbox = $('input[name="chk_contact"]'); 
		    	var chknum = 0;
		    	var num = 0;
		        for(var i=0;i<checkbox.length;i++){
		        	if(checkbox[i].checked == true){
		        		ids[num] = parseInt(checkbox[i].value);
		        		chknum++;
		        		num++;
		        	}
		        }    
		        mytargets[0] = {objectType:"contact",objectIdList:ids};
	    		var linum = this.$("li").length-1;
		    	var tagname = new Array();
		    	tagname[0] = arguments[0].currentTarget.id;
		    	console.log(tagname[0]);
		    	var datas = {'tagList':tagname,'targets':mytargets};
		    	$.ajax({
		    	    url: "/ws/tags",
		    	    type: 'PUT',
		    	    data: JSON.stringify(datas),
		    	    contentType : "application/json",
		    	    success: function(result) {
		    	        // Do something with the result
		    	    }
		    	});
	    }
	});
	
	var tag;
	ContactManagePageModel.prototype.init = function(x){ //main里的init
		tag = x;
    	var myContacts = new ContactCollection();
    	var contactListView = new ContactListView({
    	        collection: myContacts   	        
    	});
    	myContacts.fetch({reset:true}); //关键，取数据contactlist
	}
}

/*机构列表*/
var OrgManagePageModel = function(){
	// Org Models
	var Org = Backbone.Model.extend({  //对应server里的数据
		urlRoot: URL_ORGANIZATIONS
	});
	
	var OrgCollection =  Backbone.Collection.extend({ //联系人数组
		model: Org,
		url: URL_ORGANIZATIONS 
	})
	
	// Org Views  model数据发生变化时页面怎么响应
	var OrgItemView = Backbone.View.extend({
		tagName: 'tr', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#orglistitem-template').html()),  //生成template函数，还没涉及怎么画
		events: {
		      "click .checkbox"   : "toggleCheckbox",
		      "click .org_name" : "toggleOrgDetail"
		},
		toggleCheckbox:checkednumber,
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.attr("class","org-item");
	        this.checkbox = this.$('checkbox'); 
	        return this;
	    },
	    toggleOrgDetail : function(){
	    	var org_id;
	    	var x;
	    	org_id = this.model.id;
	    	x=$("#contact_page").detach();
	   	 	var orgDetail = new OrgDetailManagePageModel().init(org_id);
	    }
	});
	
	var OrgListView =  Backbone.View.extend({
		el: $('#org_list>tbody'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
		events: {			  
//			  "click #contact_menu" : "remove"			  
	    },
	    render: function() {
	    	//this.$el.empty(); //前面显示的东西删掉
	        this.collection.each( function( $model ) {
		            var itemview = new OrgItemView({model: $model}); 
		            this.$el.append( itemview.render().el );  //参数添加到tbody
	        	}, this);
	        openPage:checkednumber();
	        return this;
	    },
	    remove: function() {  
            $(this.el).remove();  
        }  
	})
	
	OrgManagePageModel.prototype.init = function(){ //main里的init
    	var myOrgs = new OrgCollection();
    	var orgListView = new OrgListView({
    	        collection: myOrgs
    	    });
    	myOrgs.fetch({reset:true});//关键，取数据contactlist
	}
}

/*展示联系人详细信息列表*/
var ContactDetailManagePageModel = function(){
	// ContactDetail Models
	detail_userid = 0;
	detail_contactid = 0;
	var ContactDetail = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
		      return URL_CONTACTS;
		}
	});
	
	var ContactDetailCollection =  Backbone.Collection.extend({ //联系人数组
		model: ContactDetail,
		url: function(){
		      return URL_CONTACTS + "/" + detail_contactid;
		}
	})
	
	// ContactDetail Views  model数据发生变化时页面怎么响应
	/*联系人详情视图*/
	var ContactDetailItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#contactdetail-template').html()),  //生成template函数，还没涉及怎么画
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        return this;
	    }
	});
	
	/*联系人详情编辑视图*/
	var EditContactDetailItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#editcontactdetail-template').html()),  //生成template函数，还没涉及怎么画
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        return this;
	    }
	});
	
	editContactDetailListView={};
	var ContactDetailListView =  Backbone.View.extend({
		el: $('#main'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},	
		events: {			  
			  "click #edit_detail" : "editDetail"			
	    },
	    render: function() {
	    	//this.$el.empty(); //前面显示的东西删掉
	        this.collection.each( function( $model ) {
	        			var itemview = new ContactDetailItemView({model: $model}); 
			            this.$el.append( itemview.render().el );  //参数添加到tbody
	        	}, this);
	        return this;
	    },
	    
	    /*跳转到编辑页面*/
	    editDetail: function(){
	    	this.undelegateEvents();
	    	var editContactDetails = new ContactDetailCollection();
	    	editContactDetailListView = new EditContactDetailListView({
	    	        collection: editContactDetails
	    	    });
	    	editContactDetails.fetch({reset:true});//关键，取数据contactlist
	    }
	})
	
	var cmodel; //得到当前视图
	orscount=1; //公司个数
	socialcount=1; //社交网络列表个数
	var EditContactDetailListView =  Backbone.View.extend({
		el: $('#main'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},	
		events: {			  
//			  "click #add_phones" : "addPhones",
			  "click #add_emails" : "addEmails",
			  "click #save_detail" : "saveDetail",
			  "click #add_orgs" : "addOrgs",
			  "click #add_socials" : "addSocials"
	    },
	    render: function() {
	    	this.$el.empty(); //前面显示的东西删掉
	        this.collection.each( function( $model ) {
	        			cmodel = $model;
	        			var edititemview = new EditContactDetailItemView({model: $model}); 
			            this.$el.append( edititemview.render().el );  //参数添加到tbody
	        	}, this);	 
	        if(cmodel.get("social_medias") != null){
		        for(var i=0;i<cmodel.get("social_medias").length;i++){
		        	var option = "<option value=''>" + cmodel.get("social_medias")[i].type + "</option>";
		        	var inputurl = "<tr><td><input class='social_url' value='" + cmodel.get("social_medias")[i].url + "' /></td></tr>";
		        	var inputname = "<tr><td><input class='social_name' value='" + cmodel.get("social_medias")[i].sm_name + "' /></td></tr>";
		        	$(".social_network_select").append(option);
		        	$(".social_network").after(inputurl);
		        	$(".social_url").after(inputname);
		        }
	        }
	        return this;
	    },
//	    addPhones : function(){
//	    	//alert("phone"+this.cid);
//	    	var phonetext = "<tr><td><input class='other_phones_text' value='nihao'/></td></tr>";
//	    	$("#phone_list").prepend(phonetext);
//	    },
	    addEmails : function(){
	    	$("#email_list").prepend("<tr><td><input class='other_emails_text' /></td></tr>");
	    },
	    saveDetail : function(){
	    	var cname = $(".name_text").val();
	    	var mail = $(".email_text").val();
	    	var personpage = $(".person_text").val();
	    	var phone = $(".mobile_phone_text").val();
	    	var otherphones = new Array();
	    	var otheremails = new Array();
	    	var orgname = new Array();
	    	var orgdep = new Array();
	    	var orgposition = new Array();
	    	var orgadd = new Array();
	    	var officephone = new Array();
	    	var orgfax = new Array();
	    	var orgweb = new Array();
	    	var socialname = new Array();
	    	var socialurl = new Array();
	    	var socialtype = new Array();
	    	var org = new Array();
	    	var social = new Array();
	    	
	    	var otherPhonesClone = $.extend({}, cmodel.get("extra_phones"));
	    	otherphones[0] = $(".other_phones_text").eq(0).val();
	    	otherphones[1] = $(".other_phones_text").eq(1).val();
	    	otherPhonesClone.fax = otherphones[0];
	    	otherPhonesClone.office_phone = otherphones[1];
	    	cmodel.set({extra_phones:otherPhonesClone});
	    	
	    	for(var i=0;i<$(".other_emails_text").length;i++){
	    		if($(".other_emails_text").eq(i).val() != ""){
	    			otheremails[i] = $(".other_emails_text").eq(i).val();
	    		}
	    	}
	    	cmodel.set({extra_emails:otheremails});
	    	
	    	for(var i=0;i<orscount;i++){
	    		var orgClone = $.extend({}, cmodel.get("organizations")[i]);
	    		var str = new String();
	    		var strsplit = new Array();
	    		orgname[i] = $(".org_name_text").eq(i).val();
	    		orgdep[i] = $(".org_dep_text").eq(i).val();
	    		if($(".org_position_text").eq(i).val() != ""){
	    			str = $(".org_position_text").eq(i).val();
		    		strsplit = str.split(',');
	    		}
	    		orgposition[i] = strsplit;
	    		orgadd[i] = $(".org_add_text").eq(i).val();
	    		officephone[i] = $(".office_phone_text").eq(i).val();
	    		orgfax[i] = $(".org_fax_text").eq(i).val();
	    		orgweb[i] = $(".org_web_text").eq(i).val();
	    		orgClone.org_address = orgadd[i];
	    		orgClone.org_name = orgname[i];
	    		orgClone.job_positions = orgposition[i];
	    		org[i] = orgClone;
	    	}
	    	cmodel.set({organizations:org});
	    	
	    	for(var i=0;i<socialcount;i++){
	    		var socialClone = $.extend({}, cmodel.get("social_medias")[i]);
	    		socialtype[i] = $(".social_network").eq(i).find('option:selected').text();
	    		socialname[i] = $(".social_name").eq(i).val();
	    		socialurl[i] = $(".social_url").eq(i).val();
	    		socialClone.url = socialurl[i];
	    		socialClone.type = socialtype[i];
	    		socialClone.sm_name = socialname[i];
	    		social[i] = socialClone;
	    	}
	    	cmodel.set({social_medias:social});
	    	
	        cmodel.set({name:cname,primary_email:mail,mobile_phone:phone});
	        cmodel.save();
	        	 
	   	 	var contactDetail = new ContactDetailManagePageModel().init("1",cmodel.id);
	    },
	    addOrgs : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+220);
	    	$("#right_contact_01").css("height",rightheight+200);
	    	var orginfo = "<table id='org_" + orscount +"' width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
	    			"<tr><td height='1' bgcolor='#e2e2e2'></td></tr>" +
	    			"<tr><td><table width='100%' border='0' cellspacing='0' cellpadding='6'><tr>" +
					"<td width='24%'><img src='image/company_logo.jpg' width='45'height='37' /></td>" +
					"<td width='5%'>&nbsp;</td>" +
					"<td width='71%'><input class='org_name_text' value='公司名称' /></td></tr></table></td></tr><tr>" +
					"<td><table width='100%' border='0' cellspacing='2' cellpadding='0'>" +
					"<tr><td><input class='org_dep_text' value='部门' /></td></tr>" +
					"<tr><td><input class='org_position_text' value='职务' /></td></tr>" +
					"<tr><td><input class='office_phone_text' value='公司电话' /></td></tr>" +
					"<tr><td><input class='org_add_text' value='公司地址' /></td></tr>" +
					"<tr><td><input class='org_fax_text' value='传真' /></td></tr>" +
					"<tr><td><input class='org_web_text' value='网址' /></td></tr></table></tr></table>";
	    	$("#add_orgs").before(orginfo);
	    	orscount++;
	    },
	    addSocials : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+45);
	    	$("#right_contact_01").css("height",rightheight+56);
	    	var socialinfo = "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
	    					"<tr><td height='6'></td></tr>" +
	    					"<tr><td><select id='social_select_" + socialcount + "'" +
	    					"class='social_network' name='social_select'><option value='' selected='selected'>人人</option>" +
	    					"</select></td></tr><tr><td><input class='social_url' value='' /></td></tr><tr><td><input class='social_name' value='' /></td></tr></table>";
	    	$("#add_socials").before(socialinfo);
	    	for(var j=0;j<4;j++){
	    		var option = "<option value=''>新浪微博" + j + "</option>";
			    $("#social_select_"+socialcount).append(option);
	    	}
	    	socialcount++;
	    }
	})
	
	
	ContactDetailManagePageModel.prototype.init = function(m,n){ //main里的init	
		detail_userid = m;
		detail_contactid = n;
    	var myContactDetails = new ContactDetailCollection();
    	var contactDetailListView = new ContactDetailListView({
    	        collection: myContactDetails
    	    });
    	myContactDetails.fetch({reset:true});//关键，取数据contactlist
	}
}

/*增加联系人 */
var AddContactPageModel = function(){
	var AddContact = Backbone.Model.extend({  //对应server里的数据
		urlRoot: URL_CONTACTS
	});
	
	var AddContactCollection =  Backbone.Collection.extend({ //联系人数组
		model: AddContact,
		url: URL_CONTACTS
	})
	
	var AddContactItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#addcontact-template').html()),  //生成template函数，还没涉及怎么画
	    render: function() {
	        this.$el.html( this.template());
	        return this;
	    }
	});
	
	var cmodel = new AddContact();
	var ccollection = new AddContactCollection();
	orscount=1; //公司个数
	socialcount=1; //社交网络列表个数
	var AddContactView =  Backbone.View.extend({
		el: $('#main'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
		events: {			  
			  "click #add_phones" : "addPhones",
			  "click #add_emails" : "addEmails",
			  "click #save_add" : "saveDetail",
			  "click #add_orgs" : "addOrgs",
			  "click #add_socials" : "addSocials"
	    },
	    render: function() {
	    	this.$el.empty(); 
//	        this.collection.each( function( $model ) {
		            var itemview = new AddContactItemView(); 		            
		            this.$el.append( itemview.render().el );  //参数添加到tbody
//	        	}, this);
//	        return this;
	    },
	    addPhones : function(){
	    	//alert("phone"+this.cid);
	    	var phonetext = "<tr><td><input class='other_phones_text' value='nihao'/></td></tr>";
	    	$("#phone_list").prepend(phonetext);
	    },
	    addEmails : function(){
	    	$("#email_list").prepend("<tr><td><input class='other_emails_text' /></td></tr>");
	    },
	    saveDetail : function(){
	    	var cname = $(".name_text").val();
	    	var mail = $(".email_text").val();
	    	var personpage = $(".person_text").val();
	    	var phone = $(".mobile_phone_text").val();
	    	var firstname = $(".first_name_text").val();
	    	var lastname = $(".last_name_text").val();
	    	var nickname = $(".nick_name_text").val();
	    	var cgender = $(".gender_text").val();
	    	var birthday = $(".birth_text").val();
	    	var ctag = $(".tag_text").val();
	    	var otherphones = new Array();
	    	var otheremails = new Array();
	    	var orgname = new Array();
	    	var orgdep = new Array();
	    	var orgposition = new Array();
	    	var orgadd = new Array();
	    	var officephone = new Array();
	    	var orgfax = new Array();
	    	var orgweb = new Array();
	    	var socialname = new Array();
	    	var socialurl = new Array();
	    	var socialtype = new Array();
	    	var org = new Array();
	    	var social = new Array();
	    	var tag = new Array();
	    	
	    	var otherPhonesClone = $.extend({}, cmodel.get("extra_phones"));
	    	otherphones[0] = $(".other_phones_text").eq(0).val()==""?null:$(".other_phones_text").eq(0).val();
	    	otherphones[1] = $(".other_phones_text").eq(1).val()==""?null:$(".other_phones_text").eq(1).val();
	    	otherPhonesClone.fax = otherphones[0];
	    	otherPhonesClone.office_phone = otherphones[1];
	    	cmodel.set({extra_phones:otherPhonesClone});
	    	
	    	for(var i=0;i<$(".other_emails_text").length;i++){
	    		if($(".other_emails_text").eq(i).val() != ""){
	    			otheremails[i] = $(".other_emails_text").eq(i).val()==""?null:$(".other_emails_text").eq(i).val();
	    		}
	    	}
	    	cmodel.set({extra_emails:otheremails});
	    	
	    	var tagstr = new String();
    		var tagstrsplit = new Array();
    		if($(".tag_text").val() != ""){
    			tagstr = $(".tag_text").val();
    			tagstrsplit = tagstr.split(',');
    		}
    		for(var i=0;i<tagstrsplit.length;i++){
    			$.tagobj = function () { };
    		    $.extend($.tagobj,
    		             { name: "" }
    		    );
    		    var tagClone = new $.tagobj();
    			tagClone.name = tagstrsplit[i];
    			tag[i] = tagClone;
    		}
    		cmodel.set({tags:tag});
    		
	    	for(var i=0;i<orscount;i++){
	    		$.orgobj = function () { };
    		    $.extend($.orgobj,
    		             { org_address: null },
    		             { org_name: null },
    		             { job_positions: null }
    		    );
    		    var orgClone = new $.orgobj();
	    		var str = new String();
	    		var strsplit = new Array();
	    		orgname[i] = $(".org_name_text").eq(i).val()==""?null:$(".org_name_text").eq(i).val();
	    		orgdep[i] = $(".org_dep_text").eq(i).val()==""?null:$(".org_dep_text").eq(i).val();
	    		if($(".org_position_text").eq(i).val() != ""){
	    			str = $(".org_position_text").eq(i).val();
		    		strsplit = str.split(',');
	    		}
	    		orgposition[i] = strsplit;
	    		orgadd[i] = $(".org_add_text").eq(i).val()==""?null:$(".org_add_text").eq(i).val();
	    		officephone[i] = $(".office_phone_text").eq(i).val();
	    		orgfax[i] = $(".org_fax_text").eq(i).val();
	    		orgweb[i] = $(".org_web_text").eq(i).val();
	    		orgClone.org_address = orgadd[i];
	    		orgClone.org_name = orgname[i];
	    		orgClone.job_positions = orgposition[i];
	    		org[i] = orgClone;
	    	}
	    	cmodel.set({organizations:org});
	    	
	    	for(var i=0;i<socialcount;i++){
	    		if($(".social_name").eq(i).val() != ""){
	    			$.socialobj = function () { };
	    		    $.extend($.socialobj,
	    		             { url: null },
	    		             { type: null },
	    		             { sm_name: null }
	    		    );
	    		    var socialClone = new $.socialobj();
		    		socialtype[i] = $(".social_network").eq(i).find('option:selected').text();
		    		socialname[i] = $(".social_name").eq(i).val()==""?null:$(".social_name").eq(i).val();
		    		socialurl[i] = $(".social_url").eq(i).val()==""?null:$(".social_url").eq(i).val();
		    		socialClone.url = socialurl[i];
		    		socialClone.type = socialtype[i];
		    		socialClone.sm_name = socialname[i];
		    		social[i] = socialClone;
	    		}
	    	}
	    	cmodel.set({social_medias:social});
	    	
	        cmodel.set({name:cname,primary_email:mail,mobile_phone:phone,first_name:firstname,last_name:lastname,nick_name:nickname,gender:cgender,date_of_birth:birthday});
	        cmodel.save();
	        
	        var pra = null;
	        var y = $("#contact_op");
    		$("#main").empty();
    		$("#main").prepend(emptyview);
    		$("#contact_list tbody").empty();
    		$("#contact_list tbody").prepend(y);
    		$("#org_list tbody").empty();
	   	 	var contact = new ContactManagePageModel().init(pra);
	    },
	    addOrgs : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+220);
	    	$("#right_contact_01").css("height",rightheight+200);
	    	var orginfo = "<table id='org_" + orscount +"' width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
	    			"<tr><td height='1' bgcolor='#e2e2e2'></td></tr>" +
	    			"<tr><td><table width='100%' border='0' cellspacing='0' cellpadding='6'><tr>" +
					"<td width='24%'><img src='image/company_logo.jpg' width='45'height='37' /></td>" +
					"<td width='5%'>&nbsp;</td>" +
					"<td width='71%'><input class='org_name_text' value='公司名称' /></td></tr></table></td></tr><tr>" +
					"<td><table width='100%' border='0' cellspacing='2' cellpadding='0'>" +
					"<tr><td><input class='org_dep_text' value='部门' /></td></tr>" +
					"<tr><td><input class='org_position_text' value='职务' /></td></tr>" +
					"<tr><td><input class='office_phone_text' value='公司电话' /></td></tr>" +
					"<tr><td><input class='org_add_text' value='公司地址' /></td></tr>" +
					"<tr><td><input class='org_fax_text' value='传真' /></td></tr>" +
					"<tr><td><input class='org_web_text' value='网址' /></td></tr></table></tr></table>";
	    	$("#add_orgs").before(orginfo);
	    	orscount++;
	    },
	    addSocials : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+45);
	    	$("#right_contact_01").css("height",rightheight+56);
	    	var socialinfo = "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
	    					"<tr><td height='6'></td></tr>" +
	    					"<tr><td><label>类型：</label><select id='social_select_" + socialcount + "'" +
	    					"class='social_network' name='social_select'><option value='' selected='selected'>人人</option>" +
	    					"<option>新浪微博</option><option>facebook</option><option>twitter</option>" +
	    					"</select></td></tr><tr><td><label>昵称：</label><input class='social_name' value='' /></td></tr><tr><td><label>链接：</label><input class='social_url' value='' /></td></tr></table>";
	    	$("#add_socials").before(socialinfo);
//	    	for(var j=0;j<4;j++){
//	    		var option = "<option value=''>新浪微博" + j + "</option>";
//			    $("#social_select_"+socialcount).append(option);
//	    	}
	    	socialcount++;
	    }
	});
	
	var emptyview;
	AddContactPageModel.prototype.init = function(x){ //main里的init
		emptyview = x;
    	var addContact = new AddContactCollection();
    	var addContactView = new AddContactView({
    	        collection: addContact   	        
    	});
    	addContact.fetch({reset:true});//关键，取数据contactlist
	}
}

/*展示机构详细信息列表*/
var OrgDetailManagePageModel = function(){
	// OrgDetail Models
	orgid = 0;
	var OrgDetail = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
		      return URL_ORGANIZATIONS;
		}
	});
	
	var OrgDetailCollection =  Backbone.Collection.extend({ //联系人数组
		model: OrgDetail,
		url: function(){
		      return URL_ORGANIZATIONS + "/" + orgid;
		}
	})
	
	// OrgDetail Views  model数据发生变化时页面怎么响应
	/*机构详情视图*/
	var OrgDetailItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#orgdetail-template').html()),  //生成template函数，还没涉及怎么画
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        return this;
	    }
	});
	
	/*机构详情编辑视图*/
	var EditOrgDetailItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#editorganizationdetail-template').html()),  //生成template函数，还没涉及怎么画
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        return this;
	    }
	});
	
	editOrgDetailListView={};
	var OrgDetailListView =  Backbone.View.extend({
		el: $('#main'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},	
		events: {			  
			  "click #edit_detail" : "editDetail"			
	    },
	    render: function() {
	    	this.$el.empty(); //前面显示的东西删掉
	        this.collection.each( function( $model ) {
	        		if($model.id == orgid){
	        			var itemview = new OrgDetailItemView({model: $model}); 
			            this.$el.append( itemview.render().el );  //参数添加到tbody
	        		}	            
	        	}, this);
	        return this;
	    },
	    
	    /*跳转到编辑页面*/
	    editDetail: function(){
//	    	this.undelegateEvents();
	    	var editOrgDetails = new OrgDetailCollection();
	    	editOrgDetailListView = new EditOrgDetailListView({
	    	        collection: editOrgDetails
	    	    });
	    	editOrgDetails.fetch({reset:true});//关键，取数据Orglist
	    }
	})
	
	var cmodel; //得到当前视图
	orscount=1; //公司个数
	socialcount=1; //社交网络列表个数
	var EditOrgDetailListView =  Backbone.View.extend({
		el: $('#main'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
	    	//this.listenTo(this.collection, 'set', this.saveDetail);
		},	
		events: {			  
			  "click #add_phones" : "addPhones",
			  "click #add_emails" : "addEmails",
			  "click #save_detail" : "saveDetail",
			  "click #add_orgs" : "addOrgs",
			  "click #add_socials" : "addSocials"
	    },
	    render: function() {
	    	this.$el.empty(); //前面显示的东西删掉
	        this.collection.each( function( $model ) {
	        		if($model.id == orgid){
	        			cmodel = $model;
	        			var edititemview = new EditOrgDetailItemView({model: $model}); 
			            this.$el.append( edititemview.render().el );  //参数添加到tbody
	        		}	            
	        	}, this);	        
	        for(var i=0;i<4;i++){
	        	var option = "<option value=''>新浪微博" + i + "</option>";
	        	$(".social_network").append(option);
	        }
	        return this;
	    },
	    addPhones : function(){
	    	//alert("phone"+this.cid);
	    	var phonetext = "<tr><td><input class='other_phones_text' value='nihao'/></td></tr>";
	    	$("#phone_list").prepend(phonetext);
	    },
	    addEmails : function(){
	    	$("#email_list").prepend("<tr><td><input class='other_emails_text' /></td></tr>");
	    },
	    saveDetail : function(){
	    	var name = $(".name_text").val();
	    	var mail = $(".email_text").val();
	    	var personpage = $(".person_text").val();
	    	var phone = $(".mobile_phone_text").val();
	    	var otherphones = new Array();
	    	var otheremails = new Array();
	    	var orgname = new Array();
	    	var orgdep = new Array();
	    	var orgposition = new Array();
	    	var orgadd = new Array();
	    	var officephone = new Array();
	    	var orgfax = new Array();
	    	var orgweb = new Array();
	    	var socialmed = new Array();
	    	var socialid = new Array();
	    	for(var i=0;i<$(".other_phones_text").length;i++){
	    		otherphones[i] = $(".other_phones_text").eq(i).val();
	    	}
	    	for(var i=0;i<$(".other_emails_text").length;i++){
	    		otheremails[i] = $(".other_emails_text").eq(i).val();
	    	}
	    	for(var i=0;i<orscount;i++){
	    		orgname[i] = $(".org_name_text").eq(i).val();
	    		orgdep[i] = $(".org_dep_text").eq(i).val();
	    		orgposition[i] = $(".org_position_text").eq(i).val();
	    		orgadd[i] = $(".org_add_text").eq(i).val();
	    		officephone[i] = $(".office_phone_text").eq(i).val();
	    		orgfax[i] = $(".org_fax_text").eq(i).val();
	    		orgweb[i] = $(".org_web_text").eq(i).val();
	    		//alert(orgname[i]+orgdep[i]+orgposition[i]+orgadd[i]+officephone[i]+orgfax[i]+orgweb[i]);
	    	}
	    	for(var i=0;i<socialcount;i++){
	    		socialmed[i] = $(".social_network").eq(i).find('option:selected').text();
	    		socialid[i] = $(".social_id").eq(i).val();
	    		//alert(socialmed[i]+socialid[i]);
	    	}
	    	if (!mail) {
	            this.clear();
	          } else {
	        	 cmodel.save({primary_email: mail,office_phone:officephone});
	        	 //alert(cmodel.get("extra_phones"));
	          }
	   	 	var orgDetail = new OrgDetailManagePageModel().init(cmodel.id);
	    },
	    addOrgs : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+220);
	    	$("#right_contact_01").css("height",rightheight+200);
	    	var orginfo = "<table id='org_" + orscount +"' width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
	    			"<tr><td height='1' bgcolor='#e2e2e2'></td></tr>" +
	    			"<tr><td><table width='100%' border='0' cellspacing='0' cellpadding='6'><tr>" +
					"<td width='24%'><img src='image/company_logo.jpg' width='45'height='37' /></td>" +
					"<td width='5%'>&nbsp;</td>" +
					"<td width='71%'><input class='org_name_text' value='公司名称' /></td></tr></table></td></tr><tr>" +
					"<td><table width='100%' border='0' cellspacing='2' cellpadding='0'>" +
					"<tr><td><input class='org_dep_text' value='部门' /></td></tr>" +
					"<tr><td><input class='org_position_text' value='职务' /></td></tr>" +
					"<tr><td><input class='office_phone_text' value='公司电话' /></td></tr>" +
					"<tr><td><input class='org_add_text' value='公司地址' /></td></tr>" +
					"<tr><td><input class='org_fax_text' value='传真' /></td></tr>" +
					"<tr><td><input class='org_web_text' value='网址' /></td></tr></table></tr></table>";
	    	$("#add_orgs").before(orginfo);
	    	orscount++;
	    },
	    addSocials : function(){
	    	var mainheight = $("#main").height();
	    	var rightheight = $("#right_contact_01").height();
	    	$("#main").css("height",mainheight+45);
	    	$("#right_contact_01").css("height",rightheight+56);
	    	var socialinfo = "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
	    					"<tr><td height='6'></td></tr>" +
	    					"<tr><td><select id='social_select_" + socialcount + "'" +
	    					"class='social_network' name='social_select'><option value='' selected='selected'>人人</option>" +
	    					"</select></td></tr><tr><td><input class='social_id' value='id' /></td></tr></table>";
	    	$("#add_socials").before(socialinfo);
	    	for(var j=0;j<4;j++){
	    		var option = "<option value=''>新浪微博" + j + "</option>";
			    $("#social_select_"+socialcount).append(option);
	    	}
	    	socialcount++;
	    }
	})
	var orgDetailListView={};
	OrgDetailManagePageModel.prototype.init = function(m){ //main里的init	
		orgid = m;
    	var myOrgDetails = new OrgDetailCollection();
    	orgDetailListView = new OrgDetailListView({
    	        collection: myOrgDetails
    	    });
    	myOrgDetails.fetch({reset:true});//关键，取数据contactlist
	}
}

/*标签列表*/
var TagManagePageModel = function(){
	var Tag = Backbone.Model.extend({  //对应server里的数据
		urlRoot: URL_TAGS
	});
	
	var TagCollection =  Backbone.Collection.extend({ //联系人数组
		model: Tag,
		url: URL_TAGS
	})
	
	var TagItemView = Backbone.View.extend({
		tagName: 'li', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#taglistitem-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
//		events: {
//		      "click .checkbox"   : "toggleCheckbox",
//		      "click .contact_img" : "toggleDetail",
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
//		},
//		toggleCheckbox:checkednumber,
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        return this;
	    }
//	    toggleDetail : function(){
//	    	var z=1;
//	    	var y=this.model.id;
//	    	x=$("#contact_page").detach();
//	   	 	var contactDetail = new ContactDetailManagePageModel().init(z,y);
//	    },
//	    clear: function() {
//	        this.model.destroy();
//	    }
	});
	
	var TagListView =  Backbone.View.extend({
		el: $('.left_menu>ul'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
//	    	this.$el.empty(); 
	        this.collection.each( function( $model ) {
		            var itemview = new TagItemView({model: $model}); 		            
		            this.$el.append( itemview.render().el );  //参数添加到tbody
	        	}, this);
//	        var done = this.collection.done().length;
//	        var remaining = this.collection.remaining().length;
//	        this.allCheckbox.checked = !remaining;
//	        openPage:checkednumber();
	        return this;
	    }
	});
	
	TagManagePageModel.prototype.init = function(){ //main里的init
    	var mytags = new TagCollection();
    	var tagListView = new TagListView({
    	        collection: mytags   	        
    	});
    	mytags.fetch({reset:true});//关键，取数据contactlist
	}
}

/*记录checkbox选中个数*/
function checkednumber(){
	var m = 0;
	var check_num_txt = "";
    var checkbox = $('input[name="chk"]'); 
    for(var i=0;i<checkbox.length;i++){
    	if(checkbox[i].checked == true){
    		m = m + 1;
    	}
    }     
    check_num_txt = "<label>已选" + m + "个</label>";
    $("#checkednum").html(check_num_txt);
}

/*HashMap*/
function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}  

