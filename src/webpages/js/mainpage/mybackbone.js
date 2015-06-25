/*smart agent*/
var SmartAgentModel = function(){
	var comid = 0;
	agentid = 0;
	var searchDays = 0;
	var pageNum = 0;
	var SmartAgent = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "http://192.168.30.47:8080/ekb/company/smartAgentList?pageNum=" + pageNum + "&id=" + comid + "&searchDays="+searchDays;
		}
	});
	
	var SmartAgentCollection =  Backbone.Collection.extend({ 
		model: SmartAgent,
		url: function(){
			return "http://192.168.30.47:8080/ekb/company/smartAgentList?pageNum=" + pageNum + "&id=" + comid + "&searchDays="+searchDays;
		},
		parse: function(response) {
			if(response.data.agentResultSets != "" && response.data.agentResultSets != null){
				agentid = response.data.agentResultSets[0].agentId;
				var SmartAgentArticleMan = new SmartAgentArticleModel().init(comid,agentid,searchDays,pageNum);
				$(".buckets").css("display","block");
				$(".show_more_news_link").show();
			}else{
				$(".buckets").css("display","none");
			}
			return response.data.agentResultSets; 
		}
	})
	
	agentcount = 0;
	var SmartAgentItemView = Backbone.View.extend({
		tagName: 'li', //每增加一个新数据增加一行
		tagClass: 'border',
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.articleitem = this.$(".articleitem");
		},
		events: {
		      "click .articleitem"   : "showArticle"
		},
	    render: function() {
	    	agentcount++;
	    	this.$el.html("<a href='#' class='articleitem' title='" + this.model.get("agentName") + "'>"+this.model.get("resultCount")+" "+this.model.get("agentName").substring(0,15)+"</a>");
	    	this.$el.addClass("item");
	    	this.articleitem = this.$(".articleitem");
	    	if(agentcount == 1){
	    		this.$el.addClass("active-item");
	    	}
	    	
	        return this;
	    },
		showArticle : function(e){
			e.preventDefault();
	    	var y = this.model.get("agentId");
	    	$("li").removeClass("active-item");
	    	this.$el.addClass("active-item");
	   	 	var articleDetail = new SmartAgentArticleModel().init(comid,y,searchDays,pageNum);
	    }
	});
	
	var SmartAgentListView =  Backbone.View.extend({
		el: $('#smart-agent-ul>ul'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model ) {
	            var itemview = new SmartAgentItemView({model: $model}); 	
	            this.$el.append( itemview.render().el );  //参数添加到tbody
        	}, this);
	    	
	        return this;
	    }
	});
	
	SmartAgentModel.prototype.init = function(id,days,page_num){ //main里的init
		comid = id;
		searchDays = days;
		pageNum = page_num;
    	var mysmartagent = new SmartAgentCollection();
    	var smartagentListView = new SmartAgentListView({
    	        collection: mysmartagent   	        
    	});
    	mysmartagent.fetch({reset:true});//关键，取数据contactlist
	}
}

/*smart agent article*/
var SmartAgentArticleModel = function(){
	detail_articleid = 0;
	var companyid = 0;
	var searchDays = 0;
	var pageNum = 0;
	var totalCount = 0;
	var SmartAgentArticle = Backbone.Model.extend({  //对应server里的数据
		idAttribute: "_dummyId",
		urlRoot: function(){
			return "http://192.168.30.47:8080/ekb/company/smartAgentArticles?pageNum=" + pageNum + "&id=" + companyid + "&searchDays=" + searchDays + "&saId=" + detail_articleid;
		}
	});
	
	var SmartAgentArticleCollection =  Backbone.Collection.extend({ 
		model: SmartAgentArticle,
		url: function(){
			return "http://192.168.30.47:8080/ekb/company/smartAgentArticles?pageNum=" + pageNum + "&id=" + companyid + "&searchDays=" + searchDays + "&saId=" + detail_articleid;
		},
		parse: function(response) {
			totalCount = response.data.resultCount;
			
		    return response.data.results; 
		}
	})
	
	var itemCount = 0;
	var SmartAgentArticleItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#smart-agent-article-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		render: function() {
			var articledate = this.model.get("dateText").toString();
			this.$el.html(this.template(this.model.toJSON()));
	        this.$el.addClass("article");
	        this.$(".articletime").html("&nbsp;&nbsp;"+articledate+"&nbsp;|&nbsp;");
	        
	        if(itemCount > 9){
	    		this.$el.css("display","none");
	    	}
	        itemCount++;
	        
	        return this;
	    }
	});
	
	var SmartAgentArticleListView =  Backbone.View.extend({
		el: $('.buckets'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},	
	    render: function() {
	    	this.$el.empty();
//	    	$(".buckets").empty();
	        this.collection.each( function( $model ) {
	        			var saitemview = new SmartAgentArticleItemView({model: $model}); 
			            this.$el.append( saitemview.render().el );  //参数添加到tbody
	        	}, this);
	        if(totalCount != 0){
	    		$("#newspagetable").css("display","block");
		    	if(pageNum == 1 || pageNum == "1"){
		    		/*数据分页*/
			    	var pagecount = 0;
					if(totalCount <= 20){
						pagecount = 1;
					}else{
						pagecount = Math.ceil(totalCount/20);
					}
			    	$("#newspagetable").paginate({
			    			count 		: pagecount,
			    			start 		: 1,
			    			display     : 10,
			    			border					: true,
			    			border_color			: '#BEF8B8',
			    			text_color  			: '#68BA64',
			    			background_color    	: '#E3F2E1',	
			    			border_hover_color		: '#68BA64',
			    			text_hover_color  		: 'black',
			    			background_hover_color	: '#CAE6C6', 
			    			rotate      : false,
			    			images		: false,
			    			mouse		: 'press'
			    		});
		    	}
		    	$("#newspagetable").css("padding-left","51px");
		    	
		    	$("#newspagetable .jPag-pages li").addClass("newpage");
		    	$("#newspagetable .jPag-pages li a,#newspagetable .jPag-pages li span").addClass("pagenum");
		    	$("#newspagetable .pagenum").unbind('click');
		    	$("#newspagetable .pagenum").click(function(event){
		    		var pagenum = $(event.srcElement || event.target).text();
		    		var articleDetail = new SmartAgentArticleModel().init(companyid,detail_articleid,searchDays,pageNum);
		    	});
	    	}
	        
	        return this;
	    }
	});
	
	SmartAgentArticleModel.prototype.init = function(n,m,days,page_num){ //main里的init	
		detail_articleid = m;
		companyid = n;
		searchDays = days;
		pageNum = page_num; 
    	var articles = new SmartAgentArticleCollection();
    	var articleListView = new SmartAgentArticleListView({
    	        collection: articles
    	    });
    	articles.fetch({reset:true});
	}
}


//var PeopleSummaryClass = function(){
//	var comid = 0;
//	var filterjson = {};
//	PeopleSummaryClass.prototype.init = function(comid,cate,filterjson){
//		comid = comid;
//		filterjson = JSON.stringify(filterjson);
//		/**
//		 * 得到人脉左边菜单栏信息
//		 */
//		$.ajax({
//			url : "/ekb/company/"+comid+"/people?category="+cate+"&filter="+filterjson,
//			type : "GET",
//		    contentType : "application/json",
//		    dataType: "json",
//		    success: function(data) {
//		    	//category1
//		    	$("#job1-count").text("(" + data[0].people.clevel + ")");
//		    	$("#job1-count").parent().attr("value",data[0].people.clevel);
//		    	$("#job2-count").text("(" + data[0].people.vp + ")");
//		    	$("#job2-count").parent().attr("value",data[0].people.vp);
//		    	$("#job3-count").text("(" + data[0].people.director + ")");
//		    	$("#job3-count").parent().attr("value",data[0].people.director);
//		    	$("#job3a-count").text("(" + data[0].people.manager + ")");
//		    	$("#job3a-count").parent().attr("value",data[0].people.manager);
//		    	$("#job4-count").text("(" + data[0].people.other + ")");
//		    	$("#job4-count").parent().attr("value",data[0].people.other);
//		    	$("#job5-count").text("(" + data[0].people.board + ")");
//		    	$("#job5-count").parent().attr("value",data[0].people.board);
//		    	
//		    	$(".countHook").removeClass("disableFilter");
//		    	var cate1 = $(".countHook");
//		    	for(var i = 0;i < cate1.length;i++){
//		    		if((cate1.eq(i).attr("value") == "0") || (cate1.eq(i).attr("value") == "null")){
//		    			cate1.eq(i).addClass("disableFilter");
//		    			var labelfor = cate1.eq(i).attr("for");
//		    			var chk = $(".filter");
//		    			for(var j = 0;j < chk.length;j++){
//		    				if(chk.eq(j).attr("id") == labelfor){
//		    					chk.eq(j).attr("disabled","disabled");
//		    				}
//		    				chk.eq(j).attr("checked",false);
//		    			}
//		    		}
//		    	}
//		    	$("#peopleCount").html(data[0].people.totalCount+"&nbsp;&nbsp;&nbsp;<span>人</span>");
//		    }
//		});
//	}
//}

/**
 * 职位列表
 */
var PositionModel = function(){
	var comid = 0;
	var totalcount = 0;
	var positionChk = '<li><input id="filter-list-job" checked="checked" class="default chkbx checked" name="allJobLevels" value="alljobs" type="checkbox" /><label class="red_bold" for="filter-list-job">职务级别</label></li>';
	var Position = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/jobtypes";
		}
	});
	
	var PositionCollection =  Backbone.Collection.extend({ 
		model: Position,
		url: function(){
			return "/ekb/company/"+comid+"/jobtypes";
		},
		parse : function(response){
			totalcount = response.data.count;
			
			return response.data.jobPositionTypes;
		}
	})
	
	var PositionItemView = Backbone.View.extend({
		tagName: 'li', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#position-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		      "click .position_filter" : "togglePosition"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	
	        return this;
	    },
	    togglePosition : function(){
	    	var pos = [];
	    	var s = "";
	    	this.$el.find("[name='pos_clevel']:checked").each(function(){
	    		pos.push($(this).attr("id")); 
	    	});
	    	s = pos.join(",");
	    	var People1Man = new NewPeopleModel().init(comid,s);
	    }
	});
	
	var PositionListView =  Backbone.View.extend({
		el: $('.people-left-list .filter-list-job'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.$el.prepend(positionChk);
	    	this.collection.each( function( $model) {
    			var itemview = new PositionItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	PositionModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var myposition = new PositionCollection();
    	var positionListView = new PositionListView({
    	        collection: myposition   	        
    	});
    	myposition.fetch({reset:true});
	}
}

/*people list new version*/
var NewPeopleModel = function(){
	var comid = 0;
	var totalcount = 0;
	var q = "";
	var NewPeople = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/people?q=" + q;
		}
	});
	
	var NewPeopleCollection =  Backbone.Collection.extend({ 
		model: NewPeople,
		url: function(){
			return "/ekb/company/"+comid+"/people?q=" + q;
		},
		parse : function(response){
			
			return response.data.employees;
		}
	})
	
	peoplecount = 0;
	var NewPeopleItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#people-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		      "click .contact_name" : "toggleDetail"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	this.$el.addClass("row contact peoplelist");
	    	this.$el.attr("value",peoplecount);
	    	this.$el.attr("id",peoplecount);
	    	if((totalcount > 6) && (peoplecount < totalcount-6)){
	    		this.$el.css("display","none");
	    	}
	    	if(this.model.get("imageUrl") == "" || this.model.get("imageUrl") == null){
	    		this.$(".contact_img").attr("src","image/mainpage/usernoPhotoMedium.png");
	    	}else{
	    		this.$(".contact_img").attr("src",this.model.get("imageUrl"));
	    	}
	    	peoplecount++;
	    	
	        return this;
	    },
	    toggleDetail : function(){
	    	var conid = this.model.get("employmentId");
			$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").css("display","none");
			$("#peopleDetail").css("display","block");
			
			var contactOverviewClass = new ContactOverviewClass().init(conid);
			var contactNewsClass = new ContactNewsListModel().init(conid);
			var contactEducationClass = new ContactEducationListModel().init(conid);
	    }
	});
	
	var NewPeopleListView =  Backbone.View.extend({
		el: $('#current .bucketContent'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new NewPeopleItemView({model : $model}); 		            
	            this.$el.prepend(itemview.render().el);  
        	}, this);
	    	$("#companyPeopleLoader").css("display","none");
//	    	$("#peopleCount").html(totalcount+"&nbsp;&nbsp;&nbsp;<span>人</span>");
	    	
	    	//category1
//	    	$("#job1-count").text("(" + data[0].people.clevel + ")");
//	    	$("#job1-count").parent().attr("value",data[0].people.clevel);
//	    	$("#job2-count").text("(" + data[0].people.vp + ")");
//	    	$("#job2-count").parent().attr("value",data[0].people.vp);
//	    	$("#job3-count").text("(" + data[0].people.director + ")");
//	    	$("#job3-count").parent().attr("value",data[0].people.director);
//	    	$("#job3a-count").text("(" + data[0].people.manager + ")");
//	    	$("#job3a-count").parent().attr("value",data[0].people.manager);
//	    	$("#job4-count").text("(" + data[0].people.other + ")");
//	    	$("#job4-count").parent().attr("value",data[0].people.other);
//	    	$("#job5-count").text("(" + data[0].people.board + ")");
//	    	$("#job5-count").parent().attr("value",data[0].people.board);
	    	
//	    	$(".countHook").removeClass("disableFilter");
//	    	var cate1 = $(".countHook");
//	    	for(var i = 0;i < cate1.length;i++){
//	    		if((cate1.eq(i).attr("value") == "0") || (cate1.eq(i).attr("value") == "null")){
//	    			cate1.eq(i).addClass("disableFilter");
//	    			var labelfor = cate1.eq(i).attr("for");
//	    			var chk = $(".filter");
//	    			for(var j = 0;j < chk.length;j++){
//	    				if(chk.eq(j).attr("id") == labelfor){
//	    					chk.eq(j).attr("disabled","disabled");
//	    				}
//	    				/*chk.eq(j).attr("checked",false);*/
//	    			}
//	    		}
//	    	}
//	    	$("#peopleCount").html(data[0].people.totalCount+"&nbsp;&nbsp;&nbsp;<span>人</span>");
	    	
	        return this;
	    }
	});
	
	NewPeopleModel.prototype.init = function(id,query){ //main里的init
		comid = id;
		q = query;
    	var mypeople = new NewPeopleCollection();
    	var peopleListView = new NewPeopleListView({
    	        collection: mypeople   	        
    	});
    	mypeople.fetch({reset:true});
	}
}

/*people list old version*/
var Category1PeopleModel = function(){
	var comid = 0;
	var filter = {};
	var category = 0;
	var totalcount = 0;
	var data = null;
	var People = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/people?category="+category+"&filter="+filter;
		}
	});
	
	var PeopleCollection =  Backbone.Collection.extend({ 
		model: People,
		url: function(){
			return "/ekb/company/"+comid+"/people?category="+category+"&filter="+filter;
		},
		parse : function(response){
			var collection = [];
			var count = 0;
			totalcount = response[0].people.totalCount;
			for(var i = 0;i < response.length;i++){
				for(var j = 0;j < response[i].people.executiveInfos.length;j++){
					collection[count] = response[i].people.executiveInfos[j];
					count++;
				}
			}
			data = response;
			
			return collection;
		}
	})
	
	peoplecount = 0;
	var PeopleItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#people-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		      "click .contact_name" : "toggleDetail"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	this.$el.addClass("row contact peoplelist");
	    	this.$el.attr("value",peoplecount);
	    	this.$el.attr("id",peoplecount);
	    	if((totalcount > 6) && (peoplecount < totalcount-6)){
	    		this.$el.css("display","none");
	    	}
	    	if(this.model.get("imageUrl") == "" || this.model.get("imageUrl") == null){
	    		this.$(".contact_img").attr("src","image/mainpage/usernoPhotoMedium.png");
	    	}else{
	    		this.$(".contact_img").attr("src",this.model.get("imageUrl"));
	    	}
	    	peoplecount++;
	    	
	        return this;
	    },
	    toggleDetail : function(){
	    	var conid = this.model.get("employmentId");
			$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").css("display","none");
			$("#peopleDetail").css("display","block");
			var contactOverviewClass = new ContactOverviewClass().init(conid);
			var contactNewsClass = new ContactNewsListModel().init(conid);
			var contactEducationClass = new ContactEducationListModel().init(conid);
	    }
	});
	
	var PeopleListView =  Backbone.View.extend({
		el: $('#current .bucketContent'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new PeopleItemView({model : $model}); 		            
	            this.$el.prepend(itemview.render().el);  
        	}, this);
	    	$("#companyPeopleLoader").css("display","none");
//	    	$("#peopleCount").html(totalcount+"&nbsp;&nbsp;&nbsp;<span>人</span>");
	    	
	    	//category1
	    	$("#job1-count").text("(" + data[0].people.clevel + ")");
	    	$("#job1-count").parent().attr("value",data[0].people.clevel);
	    	$("#job2-count").text("(" + data[0].people.vp + ")");
	    	$("#job2-count").parent().attr("value",data[0].people.vp);
	    	$("#job3-count").text("(" + data[0].people.director + ")");
	    	$("#job3-count").parent().attr("value",data[0].people.director);
	    	$("#job3a-count").text("(" + data[0].people.manager + ")");
	    	$("#job3a-count").parent().attr("value",data[0].people.manager);
	    	$("#job4-count").text("(" + data[0].people.other + ")");
	    	$("#job4-count").parent().attr("value",data[0].people.other);
	    	$("#job5-count").text("(" + data[0].people.board + ")");
	    	$("#job5-count").parent().attr("value",data[0].people.board);
	    	
	    	$(".countHook").removeClass("disableFilter");
	    	var cate1 = $(".countHook");
	    	for(var i = 0;i < cate1.length;i++){
	    		if((cate1.eq(i).attr("value") == "0") || (cate1.eq(i).attr("value") == "null")){
	    			cate1.eq(i).addClass("disableFilter");
	    			var labelfor = cate1.eq(i).attr("for");
	    			var chk = $(".filter");
	    			for(var j = 0;j < chk.length;j++){
	    				if(chk.eq(j).attr("id") == labelfor){
	    					chk.eq(j).attr("disabled","disabled");
	    				}
	    				/*chk.eq(j).attr("checked",false);*/
	    			}
	    		}
	    	}
	    	$("#peopleCount").html(data[0].people.totalCount+"&nbsp;&nbsp;&nbsp;<span>人</span>");
	    	
	        return this;
	    }
	});
	
	Category1PeopleModel.prototype.init = function(id,cate,filterjson){ //main里的init
		comid = id;
//		filter = JSON.stringify(filterjson);
		filter = filterjson;
		category = cate;
    	var mypeople = new PeopleCollection();
    	var peopleListView = new PeopleListView({
    	        collection: mypeople   	        
    	});
    	mypeople.fetch({reset:true});
	}
}

/*buzz post list*/
var BuzzPostModel = function(){
	postHasMore = null;
	var comid = 0;
	var method = "";
	var type = "";
	var BuzzPost = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/posts?"+method+"="+type;
		}
	});
	
	var BuzzPostCollection =  Backbone.Collection.extend({ 
		model: BuzzPost,
		url: function(){
			return "/ekb/company/"+comid+"/posts?"+method+"="+type;
		},
		parse : function(response){
			return response.data.updates;
		}
	})
	
	buzzcount = 0;
	var BuzzPostItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#buzz-post-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	this.$el.addClass("post postbuzzlist");
	    	this.$el.attr("value",buzzcount);
	    	this.$el.attr("id","post_"+this.model.get("postId"));
	    	if(buzzcount > 5){
	    		this.$el.css("display","none");
	    	}
	    	buzzcount++;
	    	this.$el.append("<hr size='1' class='line_dashed' />");
	    	
	    	/*
	    	 * 转换时间
	    	 */
	    	var itoday = new Date();
            itoday = itoday.getTime();
            var inewtime = new Date(this.model.get("postTime")*1000);
            var inewtimesec = inewtime.getTime();
            var iminusTime = itoday-inewtimesec;
            var ileave = iminusTime%(24*3600*1000);    //计算天数后剩余的毫秒数
            var idays = 0; //计算出相差天数
            if((new Date()).toLocaleDateString() == inewtime.toLocaleDateString()){
            	idays = 0;
            }else{
            	idays = 1;
            }
            var ihours = Math.floor(ileave/(3600*1000));
            var iminites = inewtime.getMinutes();
            if(iminites < 10){
            	iminites = "0"+iminites;
            }
            
            if(ihours < 1 && idays < 1){
            	this.$(".timeago").attr("datetime",inewtime);
            	this.$(".timeago").timeago();
        	}else if(ihours < 24 && idays < 1){
        		this.$(".posttime").text("今天  " + inewtime.getHours()+":"+inewtime.getMinutes());
        	}else{
        		this.$(".posttime").text(inewtime.toLocaleDateString()+"   "+inewtime.getHours()+":"+iminites);
        	}
            
	        return this;
	    }
	});
	
	var BuzzPostListView =  Backbone.View.extend({
		el: $('#postbuzz'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	
	    	this.collection.each( function( $model) {
    			var itemview = new BuzzPostItemView({model : $model}); 		            
	            
    			this.$el.append(itemview.render().el);  
        	}, this);
	    	
	    	if(postHasMore == true){
	    		$("#postMore").css("display","block");
	    	}
	    	
	        return this;
	    }
	});
	
	BuzzPostModel.prototype.init = function(company,cmethod,ctype){ //main里的init
		comid = company;
		method = cmethod;
		type = ctype;
    	var mybuzzpost = new BuzzPostCollection();
    	var buzzPostListView = new BuzzPostListView({
    	        collection: mybuzzpost   	        
    	});
    	mybuzzpost.fetch({reset:true});
	}
}

/*buzz mentions list*/
var BuzzMentionsModel = function(){
	hasMore = null;
	var comid = 0;
	var method = "";
	var type = "";
	var BuzzMentions = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/mentioned?"+method+"="+type;
		}
	});
	
	var BuzzMentionsCollection =  Backbone.Collection.extend({ 
		model: BuzzMentions,
		url: function(){
			return "/ekb/company/"+comid+"/mentioned?"+method+"="+type;
		},
		parse : function(response){
			
			return response.data.updates;
		}
	})
	
	menbuzzcount = 0;
	var BuzzMentionsItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#short-buzz-template').html()),  
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	this.$el.addClass("postText");
	    	
	    	/*
	    	 * 转换时间
	    	 */
	    	var itoday = new Date();
            itoday = itoday.getTime();
            var inewtime = new Date(this.model.get("publishTime")*1000);
            var inewtimesec = inewtime.getTime();
            var iminusTime = itoday-inewtimesec;
            var ileave = iminusTime%(24*3600*1000);    //计算天数后剩余的毫秒数
            var idays = 0; //计算出相差天数
            if((new Date()).toLocaleDateString() == inewtime.toLocaleDateString()){
            	idays = 0;
            }else{
            	idays = 1;
            }
            var ihours = Math.floor(ileave/(3600*1000));
            var iminites = inewtime.getMinutes();
            if(iminites < 10){
            	iminites = "0"+iminites;
            }
            
            if(ihours < 1 && idays < 1){
            	this.$(".timeago").attr("datetime",inewtime);
            	this.$(".timeago").timeago();
        	}else if(ihours < 24 && idays < 1){
        		this.$(".postTime").text("今天  " + inewtime.getHours()+":"+inewtime.getMinutes());
        	}else{
        		this.$(".postTime").text(inewtime.toLocaleDateString()+"   "+inewtime.getHours()+":"+iminites);
        	}
	    	
	        return this;
	    }
	});
	
	var BuzzMentionsListView =  Backbone.View.extend({
		el: $('#shortBuzzContainer'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
	    		if($model.attributes.type=="腾讯微博"){
	    			var itemview = new BuzzMentionsItemView({model : $model}); 		            
		            this.$el.append(itemview.render().el); 
	    		}  
        	}, this);
	    	
	        return this;
	    }
	});
	var BuzzMentionsListView_zhaopin =  Backbone.View.extend({
		el: $('#shortBuzzContainer-zhaopin'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	
	    	this.collection.each( function( $model) {
	    		if($model.attributes.type=="招聘信息"){
	    			var itemview = new BuzzMentionsItemView({model : $model}); 		            
		            this.$el.append(itemview.render().el); 
	    		} 
        	}, this);
	    	
	        return this;
	    }
	});
	
	BuzzMentionsModel.prototype.init = function(id,cmethod,ctype){ //main里的init
		comid = id;
		method = cmethod;
		type = ctype;
    	var mybuzzmentions = new BuzzMentionsCollection();
    	var buzzMentionsListView = new BuzzMentionsListView({
    	        collection: mybuzzmentions   	        
    	});
    	var buzzMentionsListView_zhaopin = new BuzzMentionsListView_zhaopin({
	        collection: mybuzzmentions   	        
	});
    	mybuzzmentions.fetch({reset:true});
	}
}

var CompanyOverviewClass = function(){
	var comid = 0;
	CompanyOverviewClass.prototype.init = function(id){
		comid = id;
    	/**
    	 * 得到公司概况信息
    	 */
    	$.ajax({
    		url : "/ekb/company/" + comid + "/overview",
    		type : "GET",
    	    contentType : "application/json",
    	    dataType: "json",
    	    success: function(data) {
    	    	var des = data.companyInfo.description;
    	    	var add = data.contactDetails.address;
    	    	var companyinfo = data.companyInfo;
    	    	comid = companyinfo.id;
    	    	
    	    	$("#company_name").text(data.companyInfo.name);
    	    	if(data.companyInfo.isPublic == false){
    	    		$("#public_company").text("私营公司");
    	    	}else{
    	    		$("#company_on_line").html("("+data.companyInfo.publicCode+")");
    	    		$("#company_on_line").attr("href",data.companyInfo.stockLink);
    	    	}
    	    	
    	    	$("#industryProfileLink").text(data.companyInfo.industry);
    	    	if(data.companyInfo.revenue == "None"){
    	    		$("#income").css("display","none");
    	    		$("#incomeLabel").css("display","none");
    	    	}else{
    	    		$("#income").css("display","block");
    	    		$("#income").text(data.companyInfo.revenue?data.companyInfo.revenue:"");
    	    	}
    	    	
    	    	if(data.companyInfo.employees != null && data.companyInfo.employees != ""){
    	    		$("#employ").css("display","block");
    	    		$("#employnum").text(data.companyInfo.employees?data.companyInfo.employees:"不详");
    	    	}else{
    	    		$("#employ").css("display","none");
    	    	}
    	    	
    	    	$("#showMoreDiv").text("");
    	    	$("#showLessDiv").text("");
    	    	if(des == null){
    	    		$("#description").css("display","none");
    	    	}else{
    	    		if(des.length < 100){
	    	    		$("#showMoreDiv").text(des);
	    	    	}else{
	    	    		$("#showMoreDiv").prepend(des.substring(0, 100) + "...");
	    	    		$("#showLessDiv").prepend(des);
	    	    	}
    	    	}
    	    	
    	    	if(data.contactDetails.website != null){
    	    		$("#website").text(data.contactDetails.website);
    	    		$("#website").attr("href","http://"+data.contactDetails.website);
    	    		$("#website").css("display","block");
    	    	}else{
    	    		$("#website").css("display","none");
    	    	}
    	    	
    	    	if(data.contactDetails.phone != null){
    	    		$("#tele").text(data.contactDetails.phone);
    	    		$("#telephone").css("display","block");
    	    	}else{
    	    		$("#telephone").css("display","none");
    	    	}
    	    	
    	    	if(add.length < 12){
    	    		$("#detailaddress1").text(add.substring(0,12));
    	    	}else{
    	    		$("#detailaddress1").text(add.substring(0,12));
    		    	$("#detailaddress2").text(add.substring(12,add.length));
    	    	}
    	    	
    	    	//工商注册信息
    	    	if(companyinfo.registered_capital == null){
    	    		$("#registerFund").text("不详");
    	    	}else{
    	    		$("#registerFund").text(companyinfo.registered_capital);
    	    	}
    	    	
    	    	$("#legalPer").text(companyinfo.in_charge_person_name);
    	    	
    	    	if(companyinfo.license_number == null){
    	    		$("#busiLicen").text("不详");
    	    	}else{
    	    		$("#busiLicen").text(companyinfo.license_number);
    	    	}
    	    	
    	    	$("#period").text(companyinfo.operation_start_date + " 至 " + companyinfo.operation_end_date);
    	    	$("#linceStartTime").text(companyinfo.license_issue_date);
    	    	$("#mainBusi").text(companyinfo.core_business?companyinfo.core_business:"不详");
    	    	if(companyinfo.canceled_date_key != null && companyinfo.canceled_date_key != ""){
    	    		$("#cancelDate").text(companyinfo.canceled_date_key);
    	    	}else{
    	    		$("#cancelDate").css("display","none");
    	    		$("#cancelDateLabel").css("display","none");
    	    	}
    	    	if(companyinfo.license_revoke_date != null && companyinfo.license_revoke_date != ""){
    	    		$("#revokeDate").text(companyinfo.license_revoke_date);
    	    	}else{
    	    		$("#revokeDate").css("display","none");
    	    		$("#revokeDateLabel").css("display","none");
    	    	}
    	    	
    	    	//给全局变量赋值
    	    	global_short_name = companyinfo.shortName;
    	    	global_english_name = companyinfo.englishName;
    	    	global_english_name_abbr = companyinfo.englishNameAbbr;
    	    	
    	    }
    	});
	}
}

// TODO: 整理成MV
var SocialProfileClass = function(){
	var comid = 0;
	SocialProfileClass.prototype.init = function(id){ //main里的init
		comid = id;
		/*展示动态中社交媒体的内容
		 * social profile
		 * */
		$.ajax({
			url : "/ekb/company/" + comid + "/socialProfile",
			type : "GET",
		    contentType : "application/json",
		    dataType: "json",
		    success: function(result) {
		    	
		    	//以下是腾讯微博的内容
		    	if(result.data.qweibo != null){
		    		$("#tengxunContainer").css("display","block");
		    		var qweibo = result.data.qweibo.otherInfo.data;
			    	var fo = result.data.qweibo;
			    	$("#tengxunFloatLeft").text(qweibo.nick);
			    	$("#tengxunFloatRight").text("@"+qweibo.name);
			    	$("#tengxunFloatRight").attr("href","http://t.qq.com/"+qweibo.name);
			    	$("#tengxuProfileImg").attr("src",qweibo.head+"/40");
			    	$("#tengxunAbout").attr("title",qweibo.tweetinfo[0].text);
			    	$("#tengxunAbout").text(qweibo.tweetinfo[0].text.substring(0,44)+"...");
			    	$("#tengxunAddress").text(qweibo.tweetinfo[0].location);
			    	$("#tengxunurl").attr("href",qweibo.homepage);
			    	$("#tengxunurl").text(qweibo.homepage);
			    	$("#tengxunCount").text(qweibo.tweetnum);
			    	$("#tengxunCount").attr("href","http://t.qq.com/"+qweibo.name);
			    	$("#tengxunMentionsCount").text(qweibo.exp);
			    	$("#tengxunMentionsCount").attr("href","http://t.qq.com/" + qweibo.name + "/lists/memberships");
			    	$("#qweiboFollowingCount").text(qweibo.idolnum);
			    	$("#qweiboFollowingCount").attr("href","http://t.qq.com/"+qweibo.name+"/following");
			    	
			    	$("#qweiboFollowingPhotos").empty();
			    	for(var i = 0;i < 3;i++){
			    		var a = "<a style='margin-right:2px;' target='tengxun' title='" + fo.followingUsers.data.info[i].nick + 
			    				"' href='http://t.qq.com/" + fo.followingUsers.data.info[i].name + 
			    				"' class='bluefont_14px'>"+
								"<img src='" + fo.followingUsers.data.info[i].head + "/30' width='25' height='25' alt='' /></a>"
			    		$("#qweiboFollowingPhotos").append(a);
			    	}
			    	
			    	$("#qweiboFollowersCount").text(qweibo.fansnum);
			    	$("#qweiboFollowersCount").attr("href","http://weibo.qq.com/"+qweibo.name+"/followers");
			    	
			    	$("#qweiboFollowersPhotos").empty();
			    	for(var i = 0;i < 3;i++){
			    		var a = "<a style='margin-right:2px;' target='tengxun' title='" + fo.followers.data.info[i].nick + 
			    				"' href='http://t.qq.com/" + fo.followers.data.info[i].name + 
			    				"' class='bluefont_14px'>"+
								"<img src='" + fo.followers.data.info[i].head + "/30' width='25' height='25' alt='' /></a>"
			    		$("#qweiboFollowersPhotos").append(a);
			    	}
		    	}
		    	
		    	
		    	//以下是新浪微博内容
		    	if(result.data.weibo != null){
		    		var weibo = result.data.weibo.otherInfo;
			    	var weibofo = result.data.weibo;
			    	$("#sinaFloatLeft").text(weibo.screen_name);
			    	$("#sinaFloatRight").text("@"+weibo.name);
			    	$("#sinaFloatRight").attr("href","http://weibo.com/"+weibo.idstr);
			    	$("#sinaProfileImg").attr("src",weibo.profile_image_url);
			    	$("#sinaAbout").attr("title",weibo.status.text);
			    	$("#sinaAbout").text(weibo.status.text.substring(0,44)+"...");
			    	//$("#sinaAddress").text(weibo.status.geo);
			    	$("#sinaurl").attr("href",weibo.url);
			    	$("#sinaurl").text(weibo.url);
			    	$("#sinaCount").text(weibo.statuses_count);
			    	$("#sinaCount").attr("href","http://weibo.com/"+weibo.idstr);
			    	$("#sinaMentionsCount").text(weibo.favourites_count);
			    	$("#sinaMentionsCount").attr("href","http://weibo.com/" + weibo.idstr + "/lists/memberships");
			    	$("#sinaFollowingCount").text(weibofo.followingUsers.total_number);
			    	$("#sinaFollowingCount").attr("href","http://weibo.com/"+weibo.idstr+"/following");
			    	
			    	$("#sinaFollowingPhotos").empty();
			    	for(var i = 0;i < 3;i++){
			    		var a = "<a style='margin-right:2px;' target='sina' title='" + weibofo.followingUsers.users[i].screen_name + 
			    				"' href='http://weibo.com/" + weibofo.followingUsers.users[i].profile_url + 
			    				"' class='bluefont_14px'>"+
								"<img src='" + weibofo.followingUsers.users[i].profile_image_url + " width='25' height='25' alt='' /></a>"
			    		$("#sinaFollowingPhotos").append(a);
			    	}
			    	
			    	$("#sinaFollowersPhotos").empty();
			    	$("#sinaFollowersCount").text(weibofo.followers.total_number);
			    	$("#sinaFollowersCount").attr("href","http://weibo.com/"+weibo.idstr+"/followers");
			    	
			    	for(var i = 0;i < 3;i++){
			    		var a = "<a style='margin-right:2px;' target='sina' title='" + weibofo.followers.users[i].screen_name + 
			    				"' href='http://weibo.com/" + weibofo.followers.users[i].profile_url + 
			    				"' class='bluefont_14px'>"+
								"<img src='" + weibofo.followers.users[i].profile_image_url + " width='25' height='25' alt='' /></a>"
			    		$("#sinaFollowersPhotos").append(a);
			    	}
			    }
		    }
		    	
		});
	}	
}

/*family tree list*/
var FamilyTreeModel = function(){
	var comid = 0;
	var FamilyTree = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/familytree";
		}
	});
	
	var FamilyTreeCollection =  Backbone.Collection.extend({ 
		model: FamilyTree,
		url: function(){
			return "/ekb/company/"+comid+"/familytree";
		},
		parse : function(response){
			return response.data.root;
		}
	})
	
	var FamilyTreeItemView = Backbone.View.extend({
		tagName: 'table', 
		tagClass: 'border',
		template: _.template($('#familyTree-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.rootCom = this.$(".rootCom");
	    	this.childCom = this.$(".childCom");
		},
		events: {
		      "click .rootCom"   : "hideAllChild",
		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	this.$el.attr("border","0");
	    	this.$el.attr("cellspacing","0");
	    	this.$el.attr("cellpadding","0");
	    	
	        return this;
	    },
	    hideAllChild : function(){
	    	if(this.$(".firstChild").css("display") == "block"){
	    		this.$(".firstChild").css("display","none");
	    	}else{
	    		this.$(".firstChild").css("display","block");
	    	}
	    	
	    },
	    hideChild : function(e){
	    	var childId = $(e.currentTarget).attr("value");
	    	var child = $(".thirdChild");
	    	for(var i = 0;i < child.length;i++){
	    		if(child.eq(i).attr("value") == childId){
	    			if(child.eq(i).css("display") == "block"){
	    				child.eq(i).css("display","none");
	    	    	}else{
	    	    		child.eq(i).css("display","block");
	    	    	}
	    		}
	    	}
	    }
	});
	
	var FamilyTreeListView =  Backbone.View.extend({
		el: $('#familyTreeList'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new FamilyTreeItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	    	/*
	    	 * 根据数据显示current company
	    	 */
	    	var cc = $(".currentCom");
	    	for(var i = 0;i < cc.length;i++){
	    		if(cc.eq(i).attr("value") == "true"){
	    			cc.eq(i).text("(当前公司)");
	    			cc.eq(i).css("display","block");
	    		}
	    	}
	    	
	        return this;
	    }
	});
	
	FamilyTreeModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var myfamily = new FamilyTreeCollection();
    	var FamilyListView = new FamilyTreeListView({
    	        collection: myfamily   	        
    	});
    	myfamily.fetch({reset:true});
	}
}

/*competitors list*/
var CompetitorsListModel = function(){
	var comid = 0;
	var CompetitorsList = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/competitors";
		}
	});
	
	var CompetitorsListCollection =  Backbone.Collection.extend({ 
		model: CompetitorsList,
		url: function(){
			return "/ekb/company/"+comid+"/competitors";
		},
		parse : function(response){
			return response.data.results;
		}
	})
	
	var CompetitorsListItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#competitors-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	    	
	        return this;
	    }
	});
	
	var CompetitorsListView =  Backbone.View.extend({
		el: $('#competitorInfoText'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new CompetitorsListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	CompetitorsListModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var mycompetitors = new CompetitorsListCollection();
    	var competitorListView = new CompetitorsListView({
    	        collection: mycompetitors   	        
    	});
    	mycompetitors.fetch({reset:true});
	}
}

/*jobs list*/
var JobsModel = function(){
	jobcount = 0;
	var comid = 0;
	var Jobs = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/jobs";
		}
	});
	
	var JobsCollection =  Backbone.Collection.extend({ 
		model: Jobs,
		url: function(){
			return "/ekb/company/"+comid+"/jobs";
		},
		parse : function(response){
			jobcount = response.data.count;
			
			return response.data.results;
		}
	})
	
	var JobsItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#jobs-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var JobsListView =  Backbone.View.extend({
		el: $('#jobsbuzz'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new JobsItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	JobsModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var myjobs = new JobsCollection();
    	var jobsListView = new JobsListView({
    	        collection: myjobs   	        
    	});
    	myjobs.fetch({reset:true});
	}
}

/*search list*/
var SearchModel = function(){
	keyword = "";
	var Search = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/autocomplete?searchString="+ keyword +"&grouptype="+group_type+"&groupid="+group_id ;
		}
	});
	
	var SearchCollection =  Backbone.Collection.extend({ 
		model: Search,
		url: function(){
			return "/ekb/autocomplete?searchString="+ keyword +"&grouptype="+group_type+"&groupid="+group_id ;
		},
		parse : function(response){
			temp=response.data.orgs;
			for(var i=0;i<temp.length;i++){
				if(response.data.persons[i]==undefined){
					temp[i]['company_name_person']=("");
					temp[i]['person_name']=("");
					temp[i]['emp_fact_id']=("");
				}
				else{
					temp[i]['company_name_person']=(response.data.persons[i].company_name);
					temp[i]['person_name']=(response.data.persons[i].person_name);
					temp[i]['emp_fact_id']=(response.data.persons[i].emp_fact_id);
				}
			}
			return temp;
		}
	});
//	var Search_Person = Backbone.Model.extend({  //对应server里的数据
//		urlRoot: function(){
//			return "/ekb/autocomplete_person?searchString=" + keyword;
//		}
//	});
//	
//	var SearchCollection_person =  Backbone.Collection.extend({ 
//		model: Search_Person,
//		url: function(){
//			return "/ekb/autocomplete_person?searchString=" + keyword;
//		},
//		parse : function(response){
//			return response;
//		}
//	});
//	
	var SearchItemView = Backbone.View.extend({
		tagName: 'li', 
		tagClass: 'border',
		template: _.template($('#search-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.searchA = this.$(".searchA");
		},
		events: {
		      "mouseover .searchA"   : "addCss",
		      "mouseout .searchA"   : "removeCss",
		      "click .searchA" : "leadtoCom"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("searchResultItem");
	        this.searchA = this.$(".searchA");
	    	
	        return this;
	    },
	    addCss : function(){
	    	this.$el.css("background-color","#f0f0f0");
	    },
	    removeCss : function(){
	    	this.$el.css("background-color","white");
	    },
	    leadtoCom : function(){
	    	global_comid = this.model.get("company_id");
	    	
	    	$("#searchbox").val(this.model.get("company_name"));
	    	$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").hide();
			$(".companyPage").show();
			$("#sideBar").hide();
			$("#firstpage").show();
			
			$("#tabAnalysis").click();	    	
	    }
	});
	var SearchItemView_person = Backbone.View.extend({
		tagName: 'li', 
		tagClass: 'border',
		template: _.template($('#search-template-person').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.searchA = this.$(".searchA");
		},
		events: {
		      "mouseover .searchA"   : "addCss",
		      "mouseout .searchA"   : "removeCss",
		      "click .searchA" : "leadtoCom"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("searchResultItem");
	        this.searchA = this.$(".searchA");
	    	
	        return this;
	    },
	    addCss : function(){
	    	this.$el.css("background-color","#f0f0f0");
	    },
	    removeCss : function(){
	    	this.$el.css("background-color","white");
	    },
	    leadtoCom : function(){
	    	global_comid = this.model.get("emp_fact_id");
	    	$("#searchbox").val(this.model.get("person_name"));
	    	$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").hide();
			$(".companyPage").show();
			$("#sideBar").hide();
			$("#firstpage").show();
			$("#tabAnalysis").click();
	    }
	});
	var SearchListView =  Backbone.View.extend({
		el: $('#searchresult'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	$("#searchresult").empty();
	    	this.collection.each( function( $model) {
	    		if($model.attributes.company_name!=""){
	    			var itemview = new SearchItemView({model : $model}); 		            
		            this.$el.append(itemview.render().el);  
	    		}
        	}, this);
	    	$("#searchresult").append('<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=1)" width="94%" color=#987cb9 SIZE=1>');
	    	this.collection.each( function( $model) {
	    		if($model.attributes.person_name!=""){
	    			var itemview = new SearchItemView_person({model : $model}); 		            
	    			this.$el.append(itemview.render().el);  
	    		}
        	}, this);
	        return this;
	    }
	});
//	var SearchListView_person =  Backbone.View.extend({
//		el: $('#searchresult'),
//		initialize:  function(){
//	    	this.listenTo(this.collection, 'reset', this.render);
//		},
////		events: {			  
////			"click #clearCompleted" : "clearContactCompleted"
////	    },
//	    render: function() {
//	    	this.collection.each( function( $model) {
//    			var itemview = new SearchItemView_person({model : $model}); 		            
//	            this.$el.append(itemview.render().el);  
//        	}, this);
//	    	
//	        return this;
//	    }
//	});
	SearchModel.prototype.init = function(key){ //main里的init
		keyword = key;
    	var mysearch = new SearchCollection();
    	var searchListView = new SearchListView({
    	        collection: mysearch   	        
    	});
    	mysearch.fetch({reset:true});
	}
}

/*
 * enter press when search(company)
 */
var SearchResultsForModel = function(){
	keyword = "";
	pagenum = "";
	status = "";
	var companycount = 0;
	var SearchResultsFor = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/globalsearch/companies?searchString=" + keyword + "&pageNum=" + pagenum;
		}
	});
	
	var SearchResultsForCollection =  Backbone.Collection.extend({ 
		model: SearchResultsFor,
		url: function(){
			return "/ekb/globalsearch/companies?searchString=" + keyword + "&pageNum=" + pagenum;
		},
		parse : function(response){
			companycount = response.data.total;
			
			return response.data.companies;
		}
	})
	
	var recount = 0;
	var SearchResultsForItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#searchResultForList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.comp_name_class = this.$(".comp_name_class");
		},
		events: {
//		      "mouseover .searchA"   : "addCss",
//		      "mouseout .searchA"   : "removeCss",
//		      "click .comp_name_class" : "leadtoCom"
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	        this.$el.addClass("com_key_search_rows");
	        this.$el.attr("value",recount);
	        
	        if(recount < 3 || status == "all"){
	        	this.$el.css("display","block");
	        }else{
	        	this.$el.css("display","none");
	        }
	        recount++;
	    	
	        return this;
	    }
//	    leadtoCom : function(){
//	    	global_comid = this.model.get("companyId");
//	    	/**
//	    	 * 得到公司概况信息
//	    	 */
//	    	var companyOverview = new CompanyOverviewClass().init(global_comid);
//	    	var SmartAgentMan = new SmartAgentModel().init(global_comid);  //显示smart agent列表
//	    	var buzzPostMan = new BuzzPostModel().init(global_comid,"include","qweibo"); //显示post buzz列表
//	    	$(".menu_tab").removeClass("menu_bg");
//	    	$("#homePage").addClass("menu_bg");
//	    	$(".mainGreyBox").css("display","none");
//	    	$("#firstpage").css("display","block");
//	    	$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
//	    	$("#tabAnalysis").addClass("secondaryNavListItemSelected");
//	    	$(".secondaryTabPanel").css("display","none");
//	    	$(".moresub").css("display","none");
//	    	$(".secondarySubMenuItem").css("display","block");
//	    	$(".secondaryNavMore").removeClass("secondaryNavListItemSelected");
//	    	$("#basicInfo").css("display","block");
//	    	$("#tabMore_stateHook").css("display","none");
//	    }
	});
	
	var SearchResultsForListView =  Backbone.View.extend({
		el: $('#company_results_rows'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new SearchResultsForItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	    	$("#page_tab tbody tr").empty();
	    	$("#companyCount").attr("value",companycount);
	    	
	    	if(status == "simple"){
	    	if(companycount <= 3){
	    		$("#companyResultCount").html("<b>公司&nbsp;("+companycount+")</b>");
	    	}else{
	    		$("#companyResultCount").html("<b>公司&nbsp;(1-3 of "+companycount+")</b>");
	    	}
	    	}
	        return this;
	    }
	});
	
	SearchResultsForModel.prototype.init = function(key,page,keystatus){ //main里的init
		keyword = key;
		pagenum = page;
		status = keystatus;
    	var mysearch = new SearchResultsForCollection();
    	var searchListView = new SearchResultsForListView({
    	        collection: mysearch   	        
    	});
    	mysearch.fetch({reset:true});
	}
}

/*
 * enter press when search(people)
 */
var SearchResultsForPeopleModel = function(){
	keyword = "";
	pagenum = "";
	status = "";
	var peoplecount = 0;
	var SearchResultsForPeople = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/globalsearch/people?searchString=" + keyword + "&pageNum=" + pagenum;
		}
	});
	
	var SearchResultsForPeopleCollection =  Backbone.Collection.extend({ 
		model: SearchResultsForPeople,
		url: function(){
			return "/ekb/globalsearch/people?searchString=" + keyword + "&pageNum=" + pagenum;
		},
		parse : function(response){
			peoplecount = response.data.total;
			
			return response.data.people;
		}
	})
	
	var recount = 0;
	var SearchResultsForPeopleItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#searchResultForPeopleList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
//		events: {
//		      "mouseover .searchA"   : "addCss",
//		      "mouseout .searchA"   : "removeCss",
//		      "click .searchA" : "leadtoCom"
//		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	        this.$el.addClass("people_key_search_rows");
	        this.$el.attr("value",recount);
	        
	        if(recount < 3 || status == "all"){
	        	this.$el.css("display","block");
	        }else{
	        	this.$el.css("display","none");
	        }
	        recount++;
	    	
	        return this;
	    }
//	    leadtoCom : function(){
//	    	global_comid = this.model.get("id");
//	    	/**
//	    	 * 得到公司概况信息
//	    	 */
//	    	$(".menu_tab").removeClass("menu_bg");
//			$("#homePage").addClass("menu_bg");
//			$(".mainGreyBox").css("display","none");
//			$("#firstpage").css("display","block");
//			
//			$("#tabAnalysis").click();
//	    }
	});
	
	var SearchResultsForPeopleListView =  Backbone.View.extend({
		el: $('#people_results_rows'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new SearchResultsForPeopleItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	    	$("#peoplepage_tab tbody tr").empty();
	    	$("#peopleCount").attr("value",peoplecount);
	    	
	    	if(status == "simple"){
	    	if(peoplecount <= 3){
	    		$("#peopleResultCount").html("<b>人员&nbsp;("+peoplecount+")</b>");
	    	}else{
	    		$("#peopleResultCount").html("<b>人员&nbsp;(1-3 of "+peoplecount+")</b>");
	    		
//	    		if(peoplecount <= 20){
//	    			$("#peoplepage_tab tbody tr").append("<td class='pagestyle' style='border:0px solid black;width:15px;text-align:center;'><a class='pagestyle'><b class='pagestyle'>共1页</b></a></td>");
//	    		}else{
//	    			var flag = peoplecount%20;
//	    			var pagecount = 0;
//	    			if(flag == 0){
//	    				pagecount = peoplecount/20;
//	    			}else{
//	    				pagecount = peoplecount/20+1;
//	    			}
//	    			for(var i = 1;i <= pagecount;i++){
//			    		if(i <= 1){
//			    			$("#peoplepage_tab tbody tr").append("<td class='pagestyle' style='border:0px solid black;width:15px;text-align:center;'><a class='pagestyle'><b class='pagestyle'>1</b></a></td>");
//			    		}else if(i <= 10){
//			    			$("#peoplepage_tab tbody tr").append("<td class='pagestyle' style='border: 1px solid rgb(204, 204, 204); width: 15px; text-align: center; color: rgb(0, 153, 204); background-color: rgb(255, 255, 255); background-position: initial initial; background-repeat: initial initial;' onmouseover=\"this.style.background='#0099cc';this.getElementsByTagName('a')[0].style.color='#fff'\" onmouseout=\"this.style.background='#fff';this.getElementsByTagName('a')[0].style.color='#0099cc';\"><a class='pagestyle' href=\"javascript:doPageSelection(document.forms.contactListBuildForm,'showNextPageForGlobalSearch',"+i+")\" style='text-decoration: none; color: rgb(0, 153, 204);'>"+i+"</a></td>");
//			    		}else{
//			    			$("#peoplepage_tab tbody tr").append("<td class='pagestyle' style='display:none;border: 1px solid rgb(204, 204, 204); width: 15px; text-align: center; color: rgb(0, 153, 204); background-color: rgb(255, 255, 255); background-position: initial initial; background-repeat: initial initial;' onmouseover=\"this.style.background='#0099cc';this.getElementsByTagName('a')[0].style.color='#fff'\" onmouseout=\"this.style.background='#fff';this.getElementsByTagName('a')[0].style.color='#0099cc';\"><a class='pagestyle' href=\"javascript:doPageSelection(document.forms.contactListBuildForm,'showNextPageForGlobalSearch',"+i+")\" style='text-decoration: none; color: rgb(0, 153, 204);'>"+i+"</a></td>");
//			    		}
//			    	}
//	    			if(peoplecount/20 > 10){
//	    				$("#peoplepage_tab tbody tr").append("<td class='pagestyle' style=\"border:1px solid #ccc;width:15px;text-align:center;color:#0099cc;\" onmouseover=\"this.style.background='#0099cc';this.getElementsByTagName('a')[0].style.color='#fff'\" onmouseout=\"this.style.background='#fff';this.getElementsByTagName('a')[0].style.color='#0099cc';\"><a class='pagestyle' href=\"javascript:doPageSelection(document.forms.contactListBuildForm,'showNextPageForGlobalSearch',11)\" style='text-decoration:none;color:#0099cc;'>Next</a></td>");
//	    			}
//	    		}
	    	}
	    	}
	    	
	        return this;
	    }
	});
	
	SearchResultsForPeopleModel.prototype.init = function(key,page,keystatus){ //main里的init
		keyword = key;
		pagenum = page;
		status = keystatus;
    	var mysearch = new SearchResultsForPeopleCollection();
    	var searchListView = new SearchResultsForPeopleListView({
    	        collection: mysearch   	        
    	});
    	mysearch.fetch({reset:true});
	}
}

var CompanyWatchListModel = function(){
	var comid = 0;
	var CompanyWatchList = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/watchList/"+comid+"/companies";
		}
	});
	
	var CompanyWatchListCollection =  Backbone.Collection.extend({ 
		model: CompanyWatchList,
		url: function(){
			return "/ekb/watchList/"+comid+"/companies";
		},
		parse : function(response){
			return response.data.companies;
		}
	})
	
	var CompanyWatchListItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#companyWatchList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.j_watchList_company = this.$(".j_watchList_company");
		},
		events: {
		      "click .j_watchList_company"   : "toCompany",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    },
	    toCompany : function () {
			var wcomid = this.model.get("companyId");
			
			$("#searchresult").empty();
			$("#searchbox").val("");
			$("#sideBar").hide();
			$(".menu_tab").removeClass("menu_bg");
			$(".outerGreyBox").css("display","none");
			$(".mainGreyBox").css("display","none");
			$(".companyPage").css("display","block");
			$("#firstpage").css("display","block");
			$("#basicInfo").css("display","block");
			$("#tabMore_stateHook").css("display","none");
			app.navigate('overview/'+wcomid, { trigger: true });
		},
	});
	
	var CompanyWatchListView =  Backbone.View.extend({
		el: $('#companyDataSet'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new CompanyWatchListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	CompanyWatchListModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var coms = new CompanyWatchListCollection();
    	var companyListView = new CompanyWatchListView({
    	        collection: coms   	        
    	});
    	coms.fetch({reset:true});
	}
}
/*高级查询公司显示结果*/
var AdvanceSearchCompanyWatchListModel = function(){
	var pageNum=1;
	var queryCondition="";
	var bPage=false;
	var bCallBack=false;
	var CompanyWatchList = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/buildList?vs=CR&q="+queryCondition;
		}
	});
	
	var CompanyWatchListCollection =  Backbone.Collection.extend({ 
		model: CompanyWatchList,
		url: function(){
			return "/ekb/buildList?vs=CR&q="+queryCondition;
		},
		parse : function(response){
			var dataSource=[];
			for(var i=1;i<=response.data.count;i++){
				dataSource.push(i);
			}
			for(var index=0;index<response.data.companies.length;index++){
				var numberOfEmployees=response.data.companies[index].numberOfEmployees;
				var revenue=response.data.companies[index].revenue;
				var location=response.data.companies[index].location;
				var licenseNum=response.data.companies[index].licenseNum;
				
				response.data.companies[index].numberOfEmployees=(numberOfEmployees==""?"0":numberOfEmployees);
				response.data.companies[index].revenue=(revenue==""?"0":revenue);
				response.data.companies[index].location=(location==""?"无":location);
				response.data.companies[index].licenseNum=(licenseNum==""?"不详":licenseNum);
				console.log(response.data.companies.length);
				if(response.data.companies.length == 0){
					alert('无查询结果！');
					$('#modify-criteria').trigger('click');
				}
			}

			$("#companyCount").html("(" + response.data.count + ")");

        	if(bPage){
        		jQuery('#advancesearch-company-page').pagination({
                    dataSource: dataSource,
                    pageSize: 10,
                    pageNumber: pageNum,
                    showGoInput: true,
                    showGoButton: true,
                    callback: function(data, pagination){
                    	if(bCallBack){
                    		showLoading();
                    		var advanceSearchCompanyWatchListModel = new AdvanceSearchCompanyWatchListModel().init(queryCondition,pagination.pageNumber,false,false);
                    	}
                    	bCallBack=true;
                    }
                });
        	}
        	hideLoading();

//        	for(var i=0;i<response.data.companies.length;i++){
//        		tbody+=""
//        	}
        	return response.data.companies;
		}
	})
	
	var CompanyWatchListItemView = Backbone.View.extend({
		tagName: 'div',
		tagClass: 'border',
		template: _.template($('#advanceSearchCompanyWatchList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var CompanyWatchListView =  Backbone.View.extend({
		el: $('#advancesearch-companyDataSet'),
		initialize:  function(){
			this.render();
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.collection.each( function( $model) {
    			var itemview = new CompanyWatchListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	        return this;
	    }
	});
	
	AdvanceSearchCompanyWatchListModel.prototype.init = function(json,page,changePage,pageCallBack){ //main里的init
		pageNum = page;
		queryCondition = json.replace(/"org_page_num":"[0-9]*"/g,'"org_page_num":"'+page+'"');
		bPage=changePage;
		bCallBack=pageCallBack;
		$('#advancesearch-companyDataSet').html('');
    	var coms = new CompanyWatchListCollection();
    	var companyListView = new CompanyWatchListView({
    	        collection: coms   	        
    	});
    	coms.fetch({reset:true});
	}
}
/*高级查询人员显示结果*/
var AdvanceSearchPeopleWatchListModel = function(){
	var pageNum=1;
	var queryCondition="";
	var bPage=false;
	var bCallBack=false;
	var PeopleWatchList = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/buildList?vs=PR&q="+queryCondition;
		}
	});
	
	var PeopleWatchListCollection =  Backbone.Collection.extend({ 
		model: PeopleWatchList,
		url: function(){
			return "/ekb/buildList?vs=PR&q="+queryCondition;
		},
		parse : function(response){
			var dataSource=[];
			for(var i=1;i<=response.data.count;i++){
				dataSource.push(i);
			}
			for(var index=0;index<response.data.employees.length;index++){
				var pef_key=response.data.employees[index].pef_key;
				var job_position=response.data.employees[index].job_position;
				var person_name=response.data.employees[index].person_name;
				var org_name=response.data.employees[index].org_name;
				
				response.data.employees[index].pef_key=(pef_key==""?"无数据":pef_key);
				response.data.employees[index].job_position=(job_position==""?"0":job_position);
				response.data.employees[index].person_name=(person_name==""?"不详":person_name);
				response.data.employees[index].org_name=(org_name==""?"无":org_name);
				if(response.data.employees.length==0){
					alert('无查询结果！');
					$('#modify-criteria').trigger('click');
				}
			}

			$("#peopleResultCount").html("(" + response.data.count + ")");

			if(bPage){
        		jQuery('#advancesearch-people-page').pagination({
                    dataSource: dataSource,
                    pageSize: 10,
                    pageNumber: pageNum,
                    showGoInput: true,
                    showGoButton: true,
                    callback: function(data, pagination){
                    	if(bCallBack){
                    		showLoading();
                    		var advanceSearchPeopleWatchListModel = new AdvanceSearchPeopleWatchListModel().init(queryCondition,pagination.pageNumber,false,false);
                    	}
                    	bCallBack=true;
                    }
                });
			}
			hideLoading();
			
			return response.data.employees;
		}
	})
	
	var PeopleWatchListItemView = Backbone.View.extend({
		tagName: 'div',
		tagClass: 'border',
		template: _.template($('#advanceSearchPeopleWatchList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.jGetEmployee = this.$el.find(".jGetEmployee");
	    	this.jGetCompany = this.$el.find(".jGetCompany");
		},
		events: {
		      "click .jGetEmployee"   : "leadToPerson",
		      "click .jGetCompany"   : "leadToCompany"
		},
		leadToPerson : function() {
			var conid = this.model.get("pef_key");
			$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").hide();
			$("#searchTab").show();
			$("#buildlist_form").hide();
			$("#results-view-container").hide();
			$("#peopleDetail").css("display","block");
			$(".j-back-to-search-result").show();
			var contactOverviewClass = new ContactOverviewClass().init(conid);
			var contactNewsClass = new ContactNewsListModel().init(conid);
			var contactEducationClass = new ContactEducationListModel().init(conid);
		},
		leadToCompany : function() {
			global_comid = this.model.get("org_key");
			$("#tabAnalysis").click();
			$(".back-to-com-search-result").show();
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");

	    	
	        return this;
	    }
	});
	
	var PeopleWatchListView =  Backbone.View.extend({
		el: $('#advancesearch-peopleDataSet'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.collection.each( function( $model) {
    			var itemview = new PeopleWatchListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	AdvanceSearchPeopleWatchListModel.prototype.init = function(json,page,changePage,pageCallBack){ //main里的init
		pageNum = page;
		queryCondition = json.replace(/"person_page_num":"[0-9]*"/g,'"person_page_num":"'+page+'"');
		bPage=changePage;
		bCallBack=pageCallBack;
		 $('#advancesearch-peopleDataSet').html('');
    	var coms = new PeopleWatchListCollection();
    	var PeopleListView = new PeopleWatchListView({
    	        collection: coms   	        
    	});
    	coms.fetch({reset:true});
	}
}
/*
 * people watch list
 */
var PeopleWatchListModel = function(){
	var comid = 0;
	var PeopleWatchList = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/watchList/"+comid+"/people";
		}
	});
	
	var PeopleWatchListCollection =  Backbone.Collection.extend({ 
		model: PeopleWatchList,
		url: function(){
			return "/ekb/watchList/"+comid+"/people";
		},
		parse : function(response){
			return response.data.executives;
		}
	})
	
	var PeopleWatchListItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#peopleWatchList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var PeopleWatchListView =  Backbone.View.extend({
		el: $('#peopleDataSet'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new PeopleWatchListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	PeopleWatchListModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var people = new PeopleWatchListCollection();
    	var peopleListView = new PeopleWatchListView({
    	        collection: people   	        
    	});
    	people.fetch({reset:true});
	}
}

/*
 * share holder list
 */
var HolderListModel = function(){
	var comid = 0;
	var ShareHoldersList = Backbone.Model.extend({  
		urlRoot: function(){
			return "/ekb/company/"+comid+"/shareholders";
		}
	});
	
	var ShareHoldersListCollection =  Backbone.Collection.extend({ 
		model: ShareHoldersList,
		url: function(){
			return "/ekb/company/"+comid+"/shareholders";
		},
		parse : function(response){
			return response.data.shareholders;
		}
	})
	
	var ShareHoldersListItemView = Backbone.View.extend({
		tagName: 'tr', 
		tagClass: 'border',
		template: _.template($('#shareHolderList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var ShareHoldersListView =  Backbone.View.extend({
		el: $('#shareHolderList>table>tbody'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	var tableTitle = "<tr class='rows' style='font-weight:bold;' >"+
						"<td class='table-cell-space'>姓名</td>"+
						"<td class='table-cell-space'>份额</td>"+
						"<td class='table-cell-space'>比例</td>"+
						"<td class='table-cell-space'>属性</td>"+
						"<td class='table-cell-space'>类</td>"+
						"</tr>";
	    	this.$el.append(tableTitle);
	    	this.collection.each( function( $model) {
    			var itemview = new ShareHoldersListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	HolderListModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var share = new ShareHoldersListCollection();
    	var shareListView = new ShareHoldersListView({
    	        collection: share   	        
    	});
    	share.fetch({reset:true});
	}
}

/*
 * all news list
 */
var AllNewsListModel = function(){
	var comid = 0;
	var pageNum = 0;
	var totalCount = 0;
	var AllNewsList = Backbone.Model.extend({  
		urlRoot: function(){
			return "http://192.168.30.47:8080/ekb/company/news?id="+comid+"&pageNum="+pageNum;
		}
	});
	
	var AllNewsListCollection =  Backbone.Collection.extend({ 
		model: AllNewsList,
		url: function(){
			return "http://192.168.30.47:8080/ekb/company/news?id="+comid+"&pageNum="+pageNum;
		},
		parse : function(response){
			totalCount = response.data.totalCount;			
			
			return response.data.results;
		}
	})
	
	var AllNewsListItemView = Backbone.View.extend({
		tagName: 'li', 
		tagClass: 'border',
		template: _.template($('#allnewsList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("padded_4px");
	    	
	        return this;
	    }
	});
	
	var AllNewsListView =  Backbone.View.extend({
		el: $('#newsList>ul'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new AllNewsListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	    	if(totalCount != 0){
	    		$("#newspagetable").css("display","block");
		    	if(pageNum == 1 || pageNum == "1"){
		    		/*数据分页*/
			    	var pagecount = 0;
					if(totalCount <= 20){
						pagecount = 1;
					}else{
						pagecount = Math.ceil(totalCount/20);
					}
			    	$("#newspagetable").paginate({
			    			count 		: pagecount,
			    			start 		: 1,
			    			display     : 10,
			    			border					: true,
			    			border_color			: '#BEF8B8',
			    			text_color  			: '#68BA64',
			    			background_color    	: '#E3F2E1',	
			    			border_hover_color		: '#68BA64',
			    			text_hover_color  		: 'black',
			    			background_hover_color	: '#CAE6C6', 
			    			rotate      : false,
			    			images		: false,
			    			mouse		: 'press'
			    		});
		    	}
		    	$("#newspagetable").css("padding-left","51px");
		    	
		    	$("#newspagetable .jPag-pages li").addClass("newpage");
		    	$("#newspagetable .jPag-pages li a,#newspagetable .jPag-pages li span").addClass("pagenum");
		    	$("#newspagetable .pagenum").unbind('click');
		    	$("#newspagetable .pagenum").click(function(event){
		    		var pagenum = $(event.srcElement || event.target).text();
		    		var NewsMan = new AllNewsListModel().init(comid,pagenum); //显示newss列表
		    	});
	    	}
	    	
	        return this;
	    }
	});
	
	AllNewsListModel.prototype.init = function(id,page){ //main里的init
		comid = id;
		pageNum = page;
		var newslist = new AllNewsListCollection();
    	var newsListView = new AllNewsListView({
    	        collection: newslist   	        
    	});
    	newslist.fetch({reset:true});
	}
}

/*
 * contact overview
 */
var ContactOverviewClass = function(){
	var contactid = 0;
	ContactOverviewClass.prototype.init = function(conid){
		contactid = conid;
		$(".detail").empty();
		
		$.ajax({
			url : "/ekb/contact/"+contactid+"/overview",
			type : "GET",
		    contentType : "application/json",
		    dataType: "json",
		    success: function(response) {
		    	var overviewData = response.data.personData;
		    	$(".emp-name").text(overviewData.fullName);
		    	$(".sub-title-12").html(overviewData.position+"<br>");
		    	$("#company_tooltip").text(overviewData.company.name);
		    	if(overviewData.phone != "" && overviewData.phone != null){
		    		$("#contactPhone").html("Phone:&nbsp;"+overviewData.phone);
		    	}
		    	if(overviewData.email != "" && overviewData.email != null){
		    		$("#contactEmail").html("Email:&nbsp;"+overviewData.email);
		    	}
		    	if(overviewData.department != "" && overviewData.department != null){
		    		$("#contactDepartment").html("Department:&nbsp;"+overviewData.department);
		    	}
		    	
		    	for(var i = 0;i < overviewData.otherCurEmployments.length;i++){
		    		$("#contactCurEmp").append("<div class='detail' style='float:left;'><div class='text-content'>"+"</div><a id='current-company-tooltip-0' name='FULL_732083' href='javascript:void(0)' class='bluefont company-hover'>"+overviewData.otherCurEmployments[i].name+"</a></div>");
		    	}
		    	$("#contactCurEmp").append("<div style='clear:both;height:0px;width:0px;'></div>");
		    	
		    	for(var i = 0;i < overviewData.pastEmployments.length;i++){
		    		$("#contactOtherEmp").append("<div class='detail'><div class='text-content'>Chairman of the Board</div><div class='comment'>Oct 10, 2008 - Aug 20, 2010</div><a id='past-company-tooltip-0' name='FULL_732181' href='javascript:void(0)' class='bluefont company-hover'>"+overviewData.pastEmployments[i].name+"</a><span class='text_box'></span><a class='bluefont' href=''></a><span class='text_box'></span></div>");
		    	}
		    	$("#contactOtherEmp").append("<div style='clear:both;height:0px;width:0px;'></div>");
		    	
		    	//设置当前联系人的全局变量
		    	global_employId = overviewData.employmentId;
		    	global_excutiveId = overviewData.executiveId;
		    	global_person_name = overviewData.fullName;
		    	global_person_phone = overviewData.phone;
		    	global_person_email = overviewData.email;
		    	global_person_workOrg = overviewData.company.id;
		    	global_person_workOrgName = overviewData.company.name;
		    	global_person_workOrgShortName = overviewData.company.shortName;
		    	global_person_position = overviewData.position;
		    	global_personKey = overviewData.personKey;
		    	
		    	//以下是腾讯微博的内容
//		    	if(result.data.qweibo != null){
//		    		var qweibo = result.data.qweibo.otherInfo.data;
//			    	var fo = result.data.qweibo;
//			    	$("#tengxunFloatLeft").text(qweibo.nick);
//			    	$("#tengxunFloatRight").text("@"+qweibo.name);
//			    	$("#tengxunFloatRight").attr("href","http://t.qq.com/"+qweibo.name);
//			    	$("#tengxuProfileImg").attr("src",qweibo.head+"/40");
//			    	$("#tengxunAbout").attr("title",qweibo.tweetinfo[0].text);
//			    	$("#tengxunAbout").text(qweibo.tweetinfo[0].text.substring(0,44)+"...");
//			    	$("#tengxunAddress").text(qweibo.tweetinfo[0].location);
//			    	$("#tengxunurl").attr("href",qweibo.homepage);
//			    	$("#tengxunurl").text(qweibo.homepage);
//			    	$("#tengxunCount").text(qweibo.tweetnum);
//			    	$("#tengxunCount").attr("href","http://t.qq.com/"+qweibo.name);
//			    	$("#tengxunMentionsCount").text(qweibo.exp);
//			    	$("#tengxunMentionsCount").attr("href","http://t.qq.com/" + qweibo.name + "/lists/memberships");
//			    	$("#qweiboFollowingCount").text(qweibo.idolnum);
//			    	$("#qweiboFollowingCount").attr("href","http://t.qq.com/"+qweibo.name+"/following");
//			    	
//			    	$("#qweiboFollowingPhotos").empty();
//			    	for(var i = 0;i < 3;i++){
//			    		var a = "<a style='margin-right:2px;' target='tengxun' title='" + fo.followingUsers.data.info[i].nick + 
//			    				"' href='http://t.qq.com/" + fo.followingUsers.data.info[i].name + 
//			    				"' class='bluefont_14px'>"+
//								"<img src='" + fo.followingUsers.data.info[i].head + "/30' width='25' height='25' alt='' /></a>"
//			    		$("#qweiboFollowingPhotos").append(a);
//			    	}
//			    	
//			    	$("#qweiboFollowersCount").text(qweibo.fansnum);
//			    	$("#qweiboFollowersCount").attr("href","http://weibo.qq.com/"+qweibo.name+"/followers");
//			    	
//			    	$("#qweiboFollowersPhotos").empty();
//			    	for(var i = 0;i < 3;i++){
//			    		var a = "<a style='margin-right:2px;' target='tengxun' title='" + fo.followers.data.info[i].nick + 
//			    				"' href='http://t.qq.com/" + fo.followers.data.info[i].name + 
//			    				"' class='bluefont_14px'>"+
//								"<img src='" + fo.followers.data.info[i].head + "/30' width='25' height='25' alt='' /></a>"
//			    		$("#qweiboFollowersPhotos").append(a);
//			    	}
//		    	}
//		    	
//		    	
//		    	//以下是新浪微博内容
//		    	if(result.data.weibo != null){
//		    		var weibo = result.data.weibo.otherInfo;
//			    	var weibofo = result.data.weibo;
//			    	$("#sinaFloatLeft").text(weibo.screen_name);
//			    	$("#sinaFloatRight").text("@"+weibo.name);
//			    	$("#sinaFloatRight").attr("href","http://weibo.com/"+weibo.idstr);
//			    	$("#sinaProfileImg").attr("src",weibo.profile_image_url);
//			    	$("#sinaAbout").attr("title",weibo.status.text);
//			    	$("#sinaAbout").text(weibo.status.text.substring(0,44)+"...");
//			    	//$("#sinaAddress").text(weibo.status.geo);
//			    	$("#sinaurl").attr("href",weibo.url);
//			    	$("#sinaurl").text(weibo.url);
//			    	$("#sinaCount").text(weibo.statuses_count);
//			    	$("#sinaCount").attr("href","http://weibo.com/"+weibo.idstr);
//			    	$("#sinaMentionsCount").text(weibo.favourites_count);
//			    	$("#sinaMentionsCount").attr("href","http://weibo.com/" + weibo.idstr + "/lists/memberships");
//			    	$("#sinaFollowingCount").text(weibofo.followingUsers.total_number);
//			    	$("#sinaFollowingCount").attr("href","http://weibo.com/"+weibo.idstr+"/following");
//			    	
//			    	$("#sinaFollowingPhotos").empty();
//			    	for(var i = 0;i < 3;i++){
//			    		var a = "<a style='margin-right:2px;' target='sina' title='" + weibofo.followingUsers.users[i].screen_name + 
//			    				"' href='http://weibo.com/" + weibofo.followingUsers.users[i].profile_url + 
//			    				"' class='bluefont_14px'>"+
//								"<img src='" + weibofo.followingUsers.users[i].profile_image_url + " width='25' height='25' alt='' /></a>"
//			    		$("#sinaFollowingPhotos").append(a);
//			    	}
//			    	
//			    	$("#sinaFollowersPhotos").empty();
//			    	$("#sinaFollowersCount").text(weibofo.followers.total_number);
//			    	$("#sinaFollowersCount").attr("href","http://weibo.com/"+weibo.idstr+"/followers");
//			    	
//			    	for(var i = 0;i < 3;i++){
//			    		var a = "<a style='margin-right:2px;' target='sina' title='" + weibofo.followers.users[i].screen_name + 
//			    				"' href='http://weibo.com/" + weibofo.followers.users[i].profile_url + 
//			    				"' class='bluefont_14px'>"+
//								"<img src='" + weibofo.followers.users[i].profile_image_url + " width='25' height='25' alt='' /></a>"
//			    		$("#sinaFollowersPhotos").append(a);
//			    	}
//			    }		    		    	
		    }
		});
	}
}

/*
 * contact news
 */
var ContactNewsListModel = function(){
	var conid = 0;
	var ContactNewsList = Backbone.Model.extend({  
		urlRoot: function(){
			return "/ekb/contact/"+conid+"/news";
		}
	});
	
	var ContactNewsListCollection =  Backbone.Collection.extend({ 
		model: ContactNewsList,
		url: function(){
			return "/ekb/contact/"+conid+"/news";
		},
		parse : function(response){
			return response.data;
		}
	})
	
	var ContactNewsListItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#contactNewsList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("firstNewsSection newsDivider");
	        this.$el.append("<div style='clear:both;height:0px;width:0px;'></div>");
	    	
	        return this;
	    }
	});
	
	var ContactNewsListView =  Backbone.View.extend({
		el: $('.newsMiddle'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new ContactNewsListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	ContactNewsListModel.prototype.init = function(id){ //main里的init
		conid = id;
    	var contactnewslist = new ContactNewsListCollection();
    	var contactnewsListView = new ContactNewsListView({
    	        collection: contactnewslist   	        
    	});
    	contactnewslist.fetch({reset:true});
	}
}

/*
 * contact education
 */
var ContactEducationListModel = function(){
	var conid = 0;
	var ContactEducationList = Backbone.Model.extend({  
		urlRoot: function(){
			return "/ekb/contact/"+conid+"/education";
		}
	});
	
	var ContactEducationListCollection =  Backbone.Collection.extend({ 
		model: ContactEducationList,
		url: function(){
			return "/ekb/contact/"+conid+"/education";
		},
		parse : function(response){
			return response.data.education;
		}
	})
	
	var ContactEducationListItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#contactEducationList-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
//		      "click .rootCom"   : "hideAllChild",
//		      "click .childCom" : "hideChild"
//		      "click .contact_name" : "toggleDetail",
//		      "click .toggle"   : "toggleDone",
//		      "click .destroy_contact" : "clear",
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("detail");
	        this.$el.css("float","left");
	        this.$el.css("margin-right","40px");
	        this.$el.append("<div style='clear:both;height:0px;width:0px;'></div>");
	    	
	        return this;
	    }
	});
	
	var ContactEducationListView =  Backbone.View.extend({
		el: $('#contactEducation'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
//		events: {			  
//			"click #clearCompleted" : "clearContactCompleted"
//	    },
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new ContactEducationListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	ContactEducationListModel.prototype.init = function(id){ //main里的init
		conid = id;
    	var contactedulist = new ContactEducationListCollection();
    	var contactedulistView = new ContactEducationListView({
    	        collection: contactedulist   	        
    	});
    	contactedulist.fetch({reset:true});
	}
}

/* 公示公告 */
var NoticeModel = function(){
	noticecount = 0;
	var comid = 0;
	var Notice = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/govannouncements";
		}
	});
	
	var NoticeCollection =  Backbone.Collection.extend({ 
		model: Notice,
		url: function(){
			return "/ekb/company/"+comid+"/govannouncements";
		},
		parse : function(response){
			noticecount = response.data.count;
			
			return response.data.announcements;
		}
	})
	
	var NoticeItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#notices-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var NoticeListView =  Backbone.View.extend({
		el: $('#noticesContent'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new NoticeItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	NoticeModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var mynotices = new NoticeCollection();
    	var noticesListView = new NoticeListView({
    	        collection: mynotices   	        
    	});
    	mynotices.fetch({reset:true});
	}
}

/* 资质 */
var QualificationsModel = function(){
	count = 0;
	var comid = 0;
	var Qualifications = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return "/ekb/company/"+comid+"/certifications";
		}
	});
	
	var QualificationsCollection =  Backbone.Collection.extend({ 
		model: Qualifications,
		url: function(){
			return "/ekb/company/"+comid+"/certifications";
		},
		parse : function(response){
			count = response.data.count;
			
			return response.data.certifications;
		}
	})
	
	var QualificationsItemView = Backbone.View.extend({
		tagName: 'div', 
		tagClass: 'border',
		template: _.template($('#qualifications-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
		events: {
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("rows");
	    	
	        return this;
	    }
	});
	
	var QualificationsListView =  Backbone.View.extend({
		el: $('.qualificationsContent'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new QualificationsItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	QualificationsModel.prototype.init = function(id){ //main里的init
		comid = id;
    	var mycol = new QualificationsCollection();
    	var myListView = new QualificationsListView({
    	        collection: mycol   	        
    	});
    	mycol.fetch({reset:true});
	}
}