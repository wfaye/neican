$(function(){
	
	var getCountUrl = '/ekb/watchList/';
	var uid = null;
	var detail = null;
	
	/* DOM元素 */
	var $company = $(".home_company");
	var $person = $(".home_person");
	var $history = $(".home_history");
	
	var watchedCom = 0;
	var watchedPerson = 0;
	
	function init() {
		uid = getUrlParam('uid');
		detail = getUrlParam('detail');
		
		if (!uid) {
			alert("请先登录再进行操作！");
		} else if (detail) {
			$("#searchresult").empty();
			$("#searchbox").val("");
			$("#sideBar").hide();
			$(".menu_tab").removeClass("menu_bg");
			$(".outerGreyBox").css("display","none");
			$(".mainGreyBox").css("display","none");
			$(".detailInfoPage").css("display","block");
			$(".detailInfoPage .mainGreyBox").css("display","block");
		}
		
		getCount();
		var VisitHistoryMan = new VisitHistoryModel().init(uid);
		
		/**
		 * 跳转到关注列表
		 */
		$(".j_to_watchlist").click(function(e){
			e.preventDefault();
			
			$("#searchresult").empty();
			$("#searchbox").val("");
			$(".menu_tab").removeClass("menu_bg");
			$("#watchlistPage").addClass("menu_bg");
			$(".outerGreyBox").css("display","none");
			$(".mainGreyBox").css("display","none");
			$(".companyPage").css("display","block");
			$(".companyPage .mainGreyBox").css("display","none");
			$("#watchListTab").css("display","block");
			$("#sideBar").hide();
			var CompanyWatchListMan = new CompanyWatchListModel().init(uid); //显示watchlist company列表
	    	var PeopleWatchListMan = new PeopleWatchListModel().init(uid); //显示watchlist people列表
		});
	}
	
	/* 
	 * 获取各项的数目 
	 */
	function getCount(){
		$.get(getCountUrl+uid,function(res){
			if (res.no == 0) {
				watchedCom = res.data.following.companies&&res.data.following.companies.length;
				watchedPerson = res.data.following.people&&res.data.following.people.length;
			} else {
			}
			
			$company.html(watchedCom);
			$person.html(watchedPerson);
		},'json');
		
	}
	
	/**
	 * 获取url参数
	 */
	function getUrlParam(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);  
		if (r!=null) return unescape(r[2]); 
		
		return null;
	} 
	
	/**
	 * urls
	 */
	var getVisitHistoryUrl = "/ekb/auth/recentView/";

	/**
	 * 浏览记录模块
	 */
	var VisitHistoryModel = function(){
		var uid = 0;
		var historyCount = -1;
		
		var VisitHistory = Backbone.Model.extend({  //对应server里的数据
			urlRoot: function(){
				return getVisitHistoryUrl+uid;
			}
		});
		
		var VisitHistoryCollection =  Backbone.Collection.extend({ 
			model: VisitHistory,
			url: function(){
				return getVisitHistoryUrl+uid;
			},
			parse : function(models, xhr) {
			    if (xhr.status === 304) {
			    	console.log(this.models.slice());
			      return this.models.slice();
			    }

			    return models.data.viewInfo;
			  }
		});
		
		var VisitHistoryItemView = Backbone.View.extend({
			tagName: 'div', //每增加一个新数据增加一行
			tagClass: 'border',
			template: _.template($('#visitHistoryList-template').html()),  //生成template函数，还没涉及怎么画
			initialize:  function(){
		    	this.listenTo(this.model, 'destroy', this.collection);
		    	this.delete_opr = this.$(".deleteIcon");
			},
			events: {
			      "click .recentHistoryItem"   : "leadTorecentHistory",
			},
			leadTorecentHistory : function(e){    //点击开始修改
				e.preventDefault();
				
				if (this.model.get("type") == "company") {
					global_comid = this.model.get("key");
					$("#tabAnalysis").click();
				} else if (this.model.get("type") == "person") {
					var conid = this.model.get("key");
					$("#searchresult").empty();
					$("#searchbox").val("");
					$("#sideBar").hide();
					$(".menu_tab").removeClass("menu_bg");
					$(".outerGreyBox").css("display","none");
					$(".mainGreyBox").css("display","none");
					$(".companyPage").css("display","block");
					$("#peopleDetail").css("display","block");
					var contactOverviewClass = new ContactOverviewClass().init(conid);
					var contactNewsClass = new ContactNewsListModel().init(conid);
					var contactEducationClass = new ContactEducationListModel().init(conid);
				}
			},
		    render: function() {
		        this.$el.html( this.template(this.model.toJSON()));
		        this.$el.css("height","30px");
		        
		        return this;
		    }
		});
		
		var VisitHistoryListView =  Backbone.View.extend({
			el: $('#visitHistoryList'),
			initialize:  function(){
		    	this.listenTo(this.collection, 'reset', this.render);
			},
		    render: function() {
		    	this.$el.empty();
		    	this.collection.each( function( $model ) {
		            var itemview = new VisitHistoryItemView({model: $model}); 	
		            this.$el.append( itemview.render().el );
	        	}, this);
		    	
		        return this;
		    }
		});
		
		VisitHistoryModel.prototype.init = function(id){ 
			uid = id;
			
	    	var myhistory = new VisitHistoryCollection();
	    	var myhistoryListView = new VisitHistoryListView({
	    	        collection: myhistory   	        
	    	});
	    	myhistory.fetch({reset:true});
		}
	};
	
	init();
});