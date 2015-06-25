var app=null;
/*用户信息*/
var user_name = "";
/*企业的全局信息*/
var global_comid = "1";
var global_short_name = "";
var global_english_name = "";
var global_english_name_abbr = "";
/*个人的全局信息*/
var global_employId = "-1";
var global_excutiveId = "";
var global_person_name = "";
var global_person_phone = "";
var global_person_email = "";
var global_person_workOrg = -1;
var global_person_workOrgName = "";
var global_person_workOrgShortName = "";
var global_person_position = "";
var global_personKey = -1;
$(function(){
	var uid = null;
	uid = getUrlParam('uid');
	
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

	/*展示用户名*/
	user_name = $.cookie('neican_username'); 
	$(".user_welcome .user_name").html(user_name ? user_name : '<a href="login.html">请登录</a>');

	
	/*
	 * 得到watchlist
	 */
	$.ajax({
		url : "/ekb/watchList/"+uid,
		type : "GET",
		contentType : "application/json",
	    dataType: "json",
	    success: function(result) {
	    	var companies_list = result.data.following.companies;
	    	var persons_list = result.data.following.people;
	    	
	    	for(var i = 0;i < companies_list.length;i++){
	    		if(global_comid == companies_list[i]){
	    			$("#addToWatchList").css("display","none");
	    			$("#removeToWatchList").css("display","block");
	    		}
	    	}
	    	for(var i = 0;i < persons_list.length;i++){
	    		if((global_employId+"_"+global_excutiveId) == persons_list[i]){
	    			$("#add_person_focus").css("display","none");
	    			$("#remove_person_focus").css("display","block");
	    		}
	    	}
	    }
	});
	
	/*
	 * 企业关注和取消关注
	 */
	$("#addToWatchList").click(function(){
		var name = $("#company_name").text();
		var data = {"id":global_comid,"name":name,"shortName":global_short_name,"englishName":global_english_name,"englishNameAbbr":global_english_name_abbr};
		var dataJson = JSON.stringify(data);
		$.ajax({
			url : "/ekb/watchList/"+uid+"/company/"+global_comid,
			type : "POST",
			success : function(result){
				$("#addToWatchList").css("display","none");
    			$("#removeToWatchList").css("display","block");
				$.ajax({
					url : "http://192.168.30.47:8080/ekb/watchList/company",
					data:dataJson,
					dataType:"json",
					contentType:"application/json",
					type : "POST",
					success : function(result){
		    			alert("完成!");
					},
					error: function(){
						alert("已存在!");
					}
				});
			},
			error: function(){
				alert("关注失败!");
			}
		});
	});
	$("#removeToWatchList").click(function(){
		$.ajax({
			url : "/ekb/watchList/"+uid+"/company/"+global_comid,
			type : "DELETE",
			success : function(result){
				$("#addToWatchList").css("display","block");
    			$("#removeToWatchList").css("display","none");
			}
		});
	});
	
	/*
	 * 个人关注和取消关注
	 */
	$("#add_person_focus").click(function(){
		var data = {"id":global_employId,"personKey":global_personKey,"name":global_person_name,"phone":global_person_phone,"email":global_person_email,"workOrg":global_person_workOrg,"workOrgName":global_person_workOrgName,"workOrgShortName":global_person_workOrgShortName,"position":global_person_position};
		var dataJson = JSON.stringify(data);
		
		$.ajax({
			url : "/ekb/watchList/"+uid+"/people/"+global_employId,
			type : "POST",
			success : function(result){
				$("#add_person_focus").css("display","none");
    			$("#remove_person_focus").css("display","block");
    			$.ajax({
					url : "http://192.168.30.47:8080/ekb/watchList/people",
					data:dataJson,
					dataType:"json",
					contentType:"application/json",
					type : "POST",
					success : function(result){
		    			alert("完成!");
					},
					error: function(){
						alert("已存在!");
					}
				});
			},
			error: function(){
				alert("关注失败!");
			}
		});
	});
	$("#remove_person_focus").click(function(){
		$.ajax({
			url : "/ekb/watchList/"+uid+"/people/"+global_employId,
			type : "DELETE",
			success : function(result){
				$("#add_person_focus").css("display","block");
    			$("#remove_person_focus").css("display","none");
    			alert("取消关注成功!");
			},
			error: function(){
				alert("取消关注失败!");
			}
		});
	});
	
	
	/*加载更多人员信息*/
	$("#peopleLoadMore").click(function(){
		var people = $(".peoplelist");
		var hidecount = 0;
		for(var i = 0;i < people.length;i++){
    		if(people.eq(i).css("display") == "none"){
    			if(hidecount < 10){
    				people.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
	});
	
	/*加载更多post动态信息*/
	$("#postBuzzLoadMore").click(function(){
		var postbuzzlist = $(".postbuzzlist");
		var hidecount = 0;
		for(var i = 0;i < postbuzzlist.length;i++){
    		if(postbuzzlist.eq(i).css("display") == "none"){
    			if(hidecount < 5){
    				postbuzzlist.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
	});
	
	/*加载更多mentions动态信息*/
	$("#mentionsBuzzLoadMore").click(function(){
		var menbuzzs = $(".menbuzzs");
		var hidecount = 0;
		for(var i = 0;i < menbuzzs.length;i++){
    		if(menbuzzs.eq(i).css("display") == "none"){
    			if(hidecount < 5){
    				menbuzzs.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
	});
	
	/*
	 * 显示更多关键字搜索结果
	 */
	$("#moreCompanySearchResult").click(function(){
		var com = $(".com_key_search_rows");
		var comcount = $("#companyCount").attr("value");
		var hidecount = 0;
		for(var i = 0;i < com.length;i++){
    		if(com.eq(i).css("display") == "none"){
    			if(hidecount < 20){
    				com.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
		$("#people_results").css("display","none");
		$("#commore").css("display","none");
		$(".backToSearchResult").css("display","block");
		$("#pagetable").css("display","block");
		$("#allcomresult").css("display","none");
		$("#companyResultCount").html("<b>公司</b>");
		
		var pagecount = 0;
		if(comcount <= 20){
			pagecount = 1;
		}else{
			pagecount = Math.ceil(comcount/20);
		}
		$("#pagetable").paginate({
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
	});
	$("#allcomresult").click(function(){
		var com = $(".com_key_search_rows");
		var comcount = $("#companyCount").attr("value");
		var hidecount = 0;
		for(var i = 0;i < com.length;i++){
    		if(com.eq(i).css("display") == "none"){
    			if(hidecount < 20){
    				com.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
		$("#people_results").css("display","none");
		$("#commore").css("display","none");
		$(".backToSearchResult").css("display","block");
		$("#pagetable").css("display","block");
		$("#allcomresult").css("display","none");
		$("#companyResultCount").html("<b>公司</b>");
		
		var pagecount = 0;
		if(comcount <= 20){
			pagecount = 1;
		}else{
			pagecount = Math.ceil(comcount/20);
		}
		$("#pagetable").paginate({
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
	});
	$("#morePeopleSearchResult").click(function(){
		var com = $(".people_key_search_rows");
		var comcount = $("#peopleCount").attr("value");
		var hidecount = 0;
		for(var i = 0;i < com.length;i++){
    		if(com.eq(i).css("display") == "none"){
    			if(hidecount < 20){
    				com.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
		$("#company_results").css("display","none");
		$("#peomore").css("display","none");
		$(".backToSearchResult").css("display","block");
		$("#peoplepagetable").css("display","block");
		$("#allpeopleresult").css("display","none");
		$("#peopleResultCount").html("<b>人员</b>");
		
		var pagecount = 0;
		if(comcount <= 20){
			pagecount = 1;
		}else{
			pagecount = Math.ceil(comcount/20);
		}
		$("#peoplepagetable").paginate({
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
	});
	$("#allpeopleresult").click(function(){
		var com = $(".people_key_search_rows");
		var comcount = $("#peopleCount").attr("value");
		var hidecount = 0;
		for(var i = 0;i < com.length;i++){
    		if(com.eq(i).css("display") == "none"){
    			if(hidecount < 20){
    				com.eq(i).css("display","block");
    				hidecount++;
    			}
    		}
    	}
		$("#company_results").css("display","none");
		$("#peomore").css("display","none");
		$(".backToSearchResult").css("display","block");
		$("#peoplepagetable").css("display","block");
		$("#allpeopleresult").css("display","none");
		$("#peopleResultCount").html("<b>人员</b>");
		
		var pagecount = 0;
		if(comcount <= 20){
			pagecount = 1;
		}else{
			pagecount = Math.ceil(comcount/20);
		}
		$("#peoplepagetable").paginate({
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
	});
	$(".backToSearchResult").click(function(){
		var pagenum = 1;
		var text = $("#searchbox").attr("value");
		$("#people_results").css("display","block");
		$("#commore").css("display","block");
		$("#pagetable").css("display","none");
		$("#peoplepagetable").css("display","none");
		$("#company_results").css("display","block");
		$("#peomore").css("display","block");
		$(".backToSearchResult").css("display","none");
		$("#allcomresult").css("display","block");
		$("#allpeopleresult").css("display","block");
		var SearchResultsForMan = new SearchResultsForModel().init(text,pagenum); 
		var SearchResultsForPeopleMan = new SearchResultsForPeopleModel().init(text,pagenum); 
	});
	
	/*
	 * post和mentions buzz之间的切换
	 */
	$(".buzzTab").click(function(){
		$(".buzzTab").removeClass("current");
		$(this).addClass("current");
		$(".buzzTabSection").css("display","none");
		
		switch ($(this).attr("data-oid")) {
			case '0' : 
				$("#postsTabSection").css("display","block");
				$("#socialProfileSection").css("display","block");
				break;
			case '1' : 
				$("#jobsTabSection").css("display","block");
				$("#socialProfileSection").css("display","none");
				break;
			case '2' :
				$("#socialProfileSection").css("display","none");
				$("#noticeTabSection").css("display","block");
				break;
		}
	});
	
	
	/*
	 * 搜索框
	 */
	$("#searchbox").keyup(function(e){
		var curKey = e.which; 
		var text = $(this).val();
		var pagenum = 1;
		$(".head18darkgrey").text("搜索'"+text+"'的结果");
		if(curKey == 13){
			$(".menu_tab").removeClass("menu_bg");
			$(".mainGreyBox").css("display","none");
			$("#aboutSearchResult").css("display","block");
			$(".global_acResults").hide();
			$("#people_results").css("display","block");
			$("#commore").css("display","block");
			$("#pagetable").css("display","none");
			$("#peoplepagetable").css("display","none");
			$("#company_results").css("display","block");
			$("#peomore").css("display","block");
			var SearchResultsForMan = new SearchResultsForModel().init(text,pagenum,"simple"); 
			var SearchResultsForPeopleMan = new SearchResultsForPeopleModel().init(text,pagenum,"simple"); 
			
			return false;
        }else{
    		$("#searchresult").empty();
    		var SearchMan = new SearchModel().init(text); //显示search列表
    		$(".global_acResults").show();
        }
	});
	
	/*
	 * 搜索菜单的显示与隐藏
	 */
	$('html').click(function(e){
		  if(e.target.id == 'searchbox' && ($(".searchResultItem").children().length != 0)) {
		        $(".global_acResults").show();
		  } else {
		        $(".global_acResults").hide();
		  }
	});


	/*
	 * 退出
	 */
	 $(".headMenu .logout").click(function(e){
	 	e.preventDefault();

	 	var url = "/ekb/auth/logout";

	 	$.ajax({
	 		url : url,
			type : "GET",
			success : function(){
				window.location.href = "login.html";
			},
			error: function(){
				alert("系统繁忙!");
			}
	 	});    
	 });
	
	/*
	 * 大按钮之间的切换
	 */
	$("#homePage").click(function(){
		location.reload();
//		$("#searchresult").empty();
//		$("#searchbox").val("");
//		$("#sideBar").show();
//		$(".menu_tab").removeClass("menu_bg");
//		$("#homePage").addClass("menu_bg");
//		$(".outerGreyBox").css("display","none");
//		$(".mainGreyBox").css("display","none");
//		$(".homePage").css("display","block");
//		$(".homePage .mainGreyBox").css("display","block");
	});
	$("#searchPage").click(function(){
		$("#searchresult").empty();
		$("#searchbox").val("");
		$(".menu_tab").removeClass("menu_bg");
		$("#searchPage").addClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$(".companyPage").css("display","block");
		$(".mainGreyBox").css("display","none");
		$("#maitoolTab").css("display","none");
		$("#searchTab .main-content").hide();
		$("#searchTab").css("display","block");
		$("#buildlist_form").show();
		$("#sideBar").hide();
	});
	$("#maitoolPage").click(function(){
		$("#searchresult").empty();
		$("#searchbox").val("");
		$(".menu_tab").removeClass("menu_bg");
		$("#maitoolPage").addClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$(".companyPage").css("display","block");
		$(".mainGreyBox").css("display","none");
		$("#searchTab .main-content").hide();
		$("#searchTab").show();
		$("#sideBar").hide();
		$("#maitoolTab").css("display","block");
	});
	$("#watchlistPage").click(function(){
		$("#searchresult").empty();
		$("#searchbox").val("");
		$(".menu_tab").removeClass("menu_bg");
		$("#watchlistPage").addClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$(".companyPage").css("display","block");
		$(".companyPage .mainGreyBox").css("display","none");
		$("#searchTab .main-content").hide();
		$("#searchTab").show();
		$("#watchListTab").css("display","block");
		$("#maitoolTab").css("display","none");
		$("#sideBar").hide();
		var CompanyWatchListMan = new CompanyWatchListModel().init(uid); //显示watchlist company列表
    	var PeopleWatchListMan = new PeopleWatchListModel().init(uid); //显示watchlist people列表
	});
	
	/**
	 * 首页标题到关注的链接
	 */
	$(".j_to_watchList").click(function(e){
		e.preventDefault();
		
		$("#searchresult").empty();
		$("#searchbox").val("");
		$(".menu_tab").removeClass("menu_bg");
		$("#watchlistPage").addClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$(".companyPage").css("display","block");
		$(".companyPage .mainGreyBox").css("display","none");
		$("#maitoolTab").css("display","none");
		$("#watchListTab").css("display","block");
		$("#sideBar").hide();
		var CompanyWatchListMan = new CompanyWatchListModel().init(uid); //显示watchlist company列表
    	var PeopleWatchListMan = new PeopleWatchListModel().init(uid); //显示watchlist people列表
	});
	/**
	 * 首页标题到脉拓圈的链接
	 */
	$(".j_to_maitool").click(function(e){
		
	});
	/**
	 * 首页标题到脉拓圈的链接
	 */
	$(".j_to_profile").click(function(e){
		$('.top_menu .detailProfile').trigger('click');
	});
	//关联tab
	$("#connections").click(function(){
		$("#searchresult").empty();
		$("#searchbox").val("");
		$(".menu_tab").removeClass("menu_bg");
		$("#connections").addClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$("#connectionsPage .mainGreyBox").css("display","block");
		$("#maitoolTab").css("display","none");
		$("#connectionsPage").css("display","block");
		$("#sideBar").hide();
		var CompanyWatchListMan = new CompanyWatchListModel().init(uid); //显示watchlist company列表
    	var PeopleWatchListMan = new PeopleWatchListModel().init(uid); //显示watchlist people列表
	});
	
	/*
	 * 跳转到个人详情页
	 */
	$(".detailProfile").click(function(e){
		e.preventDefault();
		
		$("#searchresult").empty();
		$("#searchbox").val("");
		$("#sideBar").hide();
		$(".menu_tab").removeClass("menu_bg");
		$(".outerGreyBox").css("display","none");
		$(".mainGreyBox").css("display","none");
		$(".detailInfoPage").css("display","block");
		$("#maitoolTab").css("display","none");
		$(".detailInfoPage .mainGreyBox").css("display","block");
	});
	//跳转到脉拓圈
	$('.fistpage-maitool-public').click(function(){
		$('#maitoolPage').trigger('click');
		$('#maitool-public-tab').trigger('click');
	});
	$('.fistpage-maitool-private').click(function(){
		$('#maitoolPage').trigger('click');
		$('#maitool-custom-tab').trigger('click');
		
	});
	/*
	 * build list中company和people之间的切换
	 */
	$("#company-tab").click(function(){
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$(".secondaryNavListItems").removeClass("searchselected");
		$(this).addClass("secondaryNavListItemSelected");
		$(this).addClass("searchselected");
		$(".company-bucket").css("display","block");
		$(".people-bucket").css("display","none");
	});
	$("#contact-tab").click(function(){
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$(".secondaryNavListItems").removeClass("searchselected");
		$(this).addClass("secondaryNavListItemSelected");
		$(this).addClass("searchselected");
		$(".company-bucket").css("display","none");
		$(".people-bucket").css("display","block");
	});
	
	/*
	 * build a list中画search result的表格
	 */
// 	$(".primary_button_flat").click(function(){
// 		var type = $(".searchselected").attr("tabvalue");
// 		$("#advanceSearch-peopleResults").addClass("secondaryNavListItemSelected");
// //		iv.lists.formController.doSubmitForm(type);
// 		$("#results-view-container").css("display","block");
// 		$(".form-container").css("display","none");
// 	});
	$("#modify-criteria").click(function(){
		$("#results-view-container").css("display","none");
		$(".form-container").css("display","block");
		$("#people-bucket").css("display","none");
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$("#company-tab").addClass("secondaryNavListItemSelected");
	});
	
	/*
	 * 高级搜索条件选择操作
	 */
	$("select[name='lRgn']").change(function(){
		// iv.lists.formController.setLocationSelectionMenus();
		setLocationSelectionMenus();
	});
	$("select[name='iSect']").change(function(){
		iv.lists.formController.setSubIndustryBasedOnParams();
		iv.lists.formController.createSubIndustryMenu();
	});
	
	/*
	 * 人脉条件过滤
	 */
	$("input[class='filter chkbx job']").click(function(){
		
		var category = 1;
		var filterjson = {"sales":true,"marketing":true,"finance":true,"hr":true,"research":true,"operations":true,"it":true,"otherFunction":true,"personalFirstDegree":true,"personalSecondDegree":true,"personalTeam":true,"coWorkers":true,"prevCoWorkers":true,"previousTeamCoWorker":true,"refAccounts":true,"education":true,"sort":2,"unConnected":true};
		$("input[class='filter chkbx job']").each(function(){
	        if($(this).attr("checked") == "checked"){
	        	console.log("name---"+$(this).attr("name"));
	        	var attname = $(this).attr("name");
	        	filterjson[attname] = true;
	        }
	    })
		filterjson = JSON.stringify(filterjson);
		console.log("filterjson===="+filterjson);
		var People1Man = new Category1PeopleModel().init(global_comid,category,filterjson); //显示人脉列表
	});
	$("input[class='filter chkbx func']").click(function(){
		var category = $(this).attr("id");
		console.log("funcid===="+category);
	});
	$("input[class='toBeLoggedHook']").click(function(){
		var category = $(this).attr("id");
		console.log("toBeLoggedHookid===="+category);
	});
	
	/**
	 * 根据天数选择smartagent的显示数据
	 */
	$("#daysMenu #activityDaysOption").on("click","li",function(){
		var searchDays = $(this).attr("id");
		$("#activityDays").text($(this).find("div").text());
		var SmartAgentMan = new SmartAgentModel().init(global_comid,searchDays,1);
	});
	
	/**
	 * 商情雷达到所有新闻页的跳转
	 */
	$(".j_show_more_agents_news").click(function(){
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$("#tabNews").addClass("secondaryNavListItemSelected");
		$(".secondaryTabPanel").css("display","none");
		$(".moresub").css("display","none");
		$(".secondarySubMenuItem").css("display","block");
		$(".secondaryNavMore").removeClass("secondaryNavListItemSelected");
		
		$("#allNews").css("display","block");
		$("#tabMore_stateHook").css("display","none");
		$("#sourceInfo").css("display","block");
		$(".allNewsContent").show();
		app.navigate('news/'+global_comid, { trigger: true });
	});
	
	/**
	 * 概况页动态到所有动态的跳转
	 */
	$(".j_to_buzz").click(function(e){
		e.preventDefault();
		
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$("#tabBuzz").addClass("secondaryNavListItemSelected");
		$(".secondaryTabPanel").css("display","none");
		$(".moresub").css("display","none");
		$(".secondarySubMenuItem").css("display","block");
		$(".secondaryNavMore").removeClass("secondaryNavListItemSelected");
		$("#buzzInfo").css("display","block");
		$("#tabMore_stateHook").css("display","none");
		app.navigate('buzz/'+global_comid, { trigger: true });
	});
	//缺陷文档65：公司人脉页，进入人员主页后，点击公司链接应该回到该公司主页
	$("#company_tooltip").click(function(){
		$("#tabAnalysis").click();
	});
	
	//点击人脉详情页的返回查询结果
	$(".j-back-to-search-result").click(function (e) {
		e.preventDefault();

		$("#searchPage").click();
		$("#peopleDetail").hide();
		$("#buildlist_form").show();
		$("#buildlist_form .form-container").hide();
		$("#results-view-container").show();
		$("#advanceSearch-peopleResults").addClass("secondaryNavListItemSelected");
	});

	//点击公司详情页的返回查询结果
	$(".j-back-to-com-search-result").click(function (e) {
		e.preventDefault();

		$("#searchPage").click();
		$("#buildlist_form").show();
		$("#buildlist_form .form-container").hide();
		$("#results-view-container").show();
		$("#advanceSearch-peopleResults").addClass("secondaryNavListItemSelected");
	});

	var NeicanMainApp = Backbone.Router.extend({ //做总控
	    routes: { //大按钮
	        '': '', //默认情况
	        'overview/:comid': 'doOverview',
	        'people/:comid': 'doPeople',
	        'buzz/:comid': 'doBuzz',
	        'familytree/:comid': 'doFamilyTree',
	        'competitor/:comid': 'doCompetitor',
	        'jobs/:comid': 'doJobs',
	        'news/:comid': 'doNews',
	        'watchlist': 'doWatchlist'
	    },
	    doOverview: function(comid){
	    	if (!comid)
	    		comid = "1";
	    	var companyOverview = new CompanyOverviewClass().init(comid);
	    	var SmartAgentMan = new SmartAgentModel().init(comid,0,1);  //显示smart agent列表
	    	var buzzMentionedMan = new BuzzMentionsModel().init(comid,"include","qweibo"); //显示post buzz列表
	    	var qualificationsMan = new QualificationsModel().init(comid);
	    },
	    doPeople: function(comid){
//	    	var catogary = "1";
//	    	var filterjson = {"clevel":true,"seniorExec":true,"vp":true,"director":true,"manager":true,"other":true,"board":true,"sales":true,"marketing":true,"finance":true,"hr":true,"research":true,"operations":true,"it":true,"otherFunction":true,"personalFirstDegree":true,"personalSecondDegree":true,"personalTeam":true,"coWorkers":true,"prevCoWorkers":true,"previousTeamCoWorker":true,"refAccounts":true,"education":true,"sort":2,"unConnected":true};
//	    	filterjson = JSON.stringify(filterjson);
//	    	var People1Man = new Category1PeopleModel().init(comid,catogary,filterjson); //显示人脉列表
	    	var PositionMan = new PositionModel().init(comid);
	    	var People1Man = new NewPeopleModel().init(comid,""); //显示人脉列表
	    },
	    doBuzz: function(comid){
	    	var socialMediaMan = new SocialProfileClass().init(comid);
	    	var JobsMan = new JobsModel().init(comid); //显示jobs列表
	    	var NoticeMan = new NoticeModel().init(comid); //显示公示公告
	    	var buzzPostMan = new BuzzPostModel().init(comid,"include","qweibo"); //显示post buzz列表
	    },
	    doFamilyTree: function(comid){
	    	var ShareHoldersListMan = new HolderListModel().init(comid); //显示股东列表
	    	var FamilyTreeMan = new FamilyTreeModel().init(comid); //显示关联公司
	    },
	    doCompetitor: function(comid){
	    	var CompetitorsMan = new CompetitorsListModel().init(comid); //显示竞争对手
	    },
	    doJobs: function(comid){
	    	var JobsMan = new JobsModel().init(comid); //显示jobs列表
	    },
	    doNews: function(comid){
//	    	var NewsMan = new AllNewsListModel().init(comid,"1"); //显示newss列表
	    	var SmartAgentMan = new SmartAgentModel().init(comid,0,1);  //显示smart agent列表
	    },
	    doWatchlist: function(){
	    	var CompanyWatchListMan = new CompanyWatchListModel().init(comid); //显示watchlist company列表
	    	var PeopleWatchListMan = new PeopleWatchListModel().init(comid); //显示watchlist people列表
	    },
	    doManage: function() {	
	    }
	});

	app = new NeicanMainApp();
//	Backbone.history.start({pushstate:true}); 
	Backbone.history.start(); 
	
});

function clickSearchResult(id){
	global_comid = id;
//	$(".menu_tab").removeClass("menu_bg");
//	$("#homePage").addClass("menu_bg");
//	$(".mainGreyBox").css("display","none");
//	$("#firstpage").css("display","block");
//	$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
//	$("#tabAnalysis").addClass("secondaryNavListItemSelected");
//	$(".secondaryTabPanel").css("display","none");
//	$(".moresub").css("display","none");
//	$(".secondarySubMenuItem").css("display","block");
//	$(".secondaryNavMore").removeClass("secondaryNavListItemSelected");
//	$("#basicInfo").css("display","block");
//	$("#tabMore_stateHook").css("display","none");
	$(".menu_tab").removeClass("menu_bg");
	$(".mainGreyBox").hide();
	$(".companyPage").show();
	$("#sideBar").hide();
	$("#firstpage").show();
	
	$("#tabAnalysis").click();	
//	var companyOverview = new CompanyOverviewClass().init(global_comid);
//	var SmartAgentMan = new SmartAgentModel().init(global_comid);  //显示smart agent列表
//	var buzzPostMan = new BuzzPostModel().init(global_comid,"include","qweibo"); //显示post buzz列表
}

function clickSearchPeopleResult(id){
	var conid = id;
	console.log(conid);
	$(".menu_tab").removeClass("menu_bg");
	$(".mainGreyBox").css("display","none");
	$("#peopleDetail").css("display","block");
	var contactOverviewClass = new ContactOverviewClass().init(conid);
	var contactNewsClass = new ContactNewsListModel().init(conid);
	var contactEducationClass = new ContactEducationListModel().init(conid);
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
/*省市联动*/
var list1 = new Array;
var list2 = new Array;
list1[list1.length] = "北京市";
list1[list1.length] = "天津市";
list1[list1.length] = "河北省";
list1[list1.length] = "山西省";
list1[list1.length] = "内蒙古";
list1[list1.length] = "辽宁省";
list1[list1.length] = "吉林省";
list1[list1.length] = "黑龙江省";
list1[list1.length] = "上海市";
list1[list1.length] = "江苏省";
list1[list1.length] = "浙江省";
list1[list1.length] = "安徽省";
list1[list1.length] = "福建省";
list1[list1.length] = "江西省";
list1[list1.length] = "山东省";
list1[list1.length] = "河南省";
list1[list1.length] = "湖北省";
list1[list1.length] = "湖南省";
list1[list1.length] = "广东省";
list1[list1.length] = "广西自治区";
list1[list1.length] = "海南省";
list1[list1.length] = "重庆市";
list1[list1.length] = "四川省";
list1[list1.length] = "贵州省";
list1[list1.length] = "云南省";
list1[list1.length] = "西藏自治区";
list1[list1.length] = "陕西省";
list1[list1.length] = "甘肃省";
list1[list1.length] = "青海省";
list1[list1.length] = "宁夏回族自治区";
list1[list1.length] = "新疆维吾尔自治区";
list1[list1.length] = "香港特别行政区";
list1[list1.length] = "澳门特别行政区";
list1[list1.length] = "台湾省";
list1[list1.length] = "其它";

list2[list2.length] = new Array("北京", "东城区", "西城区", "崇文区", "宣武区",
		"朝阳区", "丰台区", "石景山区", " 海淀区（中关村）", "门头沟区", "房山区", "通州区",
		"顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云县", "延庆县", " 其他");
list2[list2.length] = new Array("和平区", "河东区", "河西区", "南开区", "红桥区",
		"塘沽区", "汉沽区", "大港区", "西青区", "津南区", "武清区", "蓟县", "宁河县",
		"静海县", "其他");
list2[list2.length] = new Array("石家庄市", "张家口市", "承德市", "秦皇岛市",
		"唐山市", "廊坊市", "衡水市", "沧州市", "邢台市", "邯郸市", "保定市", "其他");
list2[list2.length] = new Array("太原市", "朔州市", "大同市", "长治市", "晋城市",
		"忻州市", "晋中市", "临汾市", "吕梁市", "运城市", "其他");
list2[list2.length] = new Array("呼和浩特市", "包头市", "赤峰市", "呼伦贝尔市",
		"鄂尔多斯市", "乌兰察布市", "巴彦淖尔市", "兴安盟", "阿拉善盟", "锡林郭勒盟", "其他");
list2[list2.length] = new Array("沈阳市", "朝阳市", "阜新市", "铁岭市", "抚顺市",
		"丹东市", "本溪市", "辽阳市", "鞍山市", "大连市", "营口市", "盘锦市", "锦州市",
		"葫芦岛市", "其他");
list2[list2.length] = new Array("长春市", "白城市", "吉林市", "四平市", "辽源市",
		"通化市", "白山市", "延边朝鲜族自治州", "其他");
list2[list2.length] = new Array("哈尔滨市", "七台河市", "黑河市", "大庆市",
		"齐齐哈尔市", "伊春市", "佳木斯市", "双鸭山市", "鸡西市", "大兴安岭地区(加格达奇)",
		"牡丹江", "鹤岗市", "绥化市　", "其他");
list2[list2.length] = new Array("黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区",
		"普陀区", "闸北区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区",
		"金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明县", "其他");
list2[list2.length] = new Array("南京市", "徐州市", "连云港市", "宿迁市", "淮安市",
		"盐城市", "扬州市", "泰州市", "南通市", "镇江市", "常州市", "无锡市", "苏州市",
		"其他");
list2[list2.length] = new Array("杭州市", "湖州市", "嘉兴市", "舟山市", "宁波市",
		"绍兴市", "衢州市", "金华市", "台州市", "温州市", "丽水市", "其他");
list2[list2.length] = new Array("合肥市", "宿州市", "淮北市", "亳州市", "阜阳市",
		"蚌埠市", "淮南市", "滁州市", "马鞍山市", "芜湖市", "铜陵市", "安庆市", "黄山市",
		"六安市", "巢湖市", "池州市", "宣城市", "其他");
list2[list2.length] = new Array("福州市", "南平市", "莆田市", "三明市", "泉州市",
		"厦门市", "漳州市", "龙岩市", "宁德市", "其他");
list2[list2.length] = new Array("南昌市", "九江市", "景德镇市", "鹰潭市", "新余市",
		"萍乡市", "赣州市", "上饶市", "抚州市", "宜春市", "吉安市", "其他");
list2[list2.length] = new Array("济南市", "聊城市", "德州市", "东营市", "淄博市",
		"潍坊市", "烟台市", "威海市", "青岛市", "日照市", "临沂市", "枣庄市", "济宁市",
		"泰安市", "莱芜市", "滨州市", "菏泽市", "其他");
list2[list2.length] = new Array("郑州市", "三门峡市", "洛阳市", "焦作市", "新乡市",
		"鹤壁市", "安阳市", "濮阳市", "开封市", "商丘市", "许昌市", "漯河市", "平顶山市",
		"南阳市", "信阳市", "周口市", "驻马店市", "其他");
list2[list2.length] = new Array("武汉市", "十堰市", "襄樊市", "荆门市", "孝感市",
		"黄冈市", "鄂州市", "黄石市", "咸宁市", "荆州市", "宜昌市", "随州市",
		"恩施土家族苗族自治州", "仙桃市", "天门市", "潜江市", "神农架林区", "其他");
list2[list2.length] = new Array("长沙市", "张家界市", "常德市", "益阳市", "岳阳市",
		"株洲市", "湘潭市", "衡阳市", "郴州市", "永州市", "邵阳市", "怀化市", "娄底市",
		"湘西土家族苗族自治州", "其他");
list2[list2.length] = new Array("广州市", "清远市市", "韶关市", "河源市", "梅州市",
		"潮州市", "汕头市", "揭阳市", "汕尾市", " 惠州市", "东莞市", "深圳市", "珠海市",
		"中山市", "江门市", "佛山市", "肇庆市", "云浮市", "阳江市", "茂名市", "湛江市",
		" 其他");
list2[list2.length] = new Array("南宁市", "桂林市", "柳州市", "梧州市", "贵港市",
		"玉林市", "钦州市", "北海市", "防城港市", "崇左市", "百色市", "河池市", "来宾市",
		"贺州市", "其他");
list2[list2.length] = new Array("海口市", "三亚市", "其他");
list2[list2.length] = new Array("渝中区", "大渡口区", "江北区", "沙坪坝区",
		"九龙坡区", "南岸区", "北碚区", "万盛区", "双桥区", "渝北区", "巴南区", "万州区",
		"涪陵区", "黔江区", "长寿区", "合川市", "永川市", "江津市", "南川市", "綦江县",
		"潼南县", "铜梁县", "大足县", "璧山县", "垫江县", "武隆县", "丰都县", "城口县",
		"开县", "巫溪县", "巫山县", "奉节县", "云阳县", "忠县", "石柱土家族自治县",
		"彭水苗族土家族自治县", "酉阳土家族苗族自治县", "秀山土家族苗族自治县", "其他");
list2[list2.length] = new Array("成都市", "广元市", "绵阳市", "德阳市", "南充市",
		"广安市", "遂宁市", "内江市", "乐山市", "自贡市", "泸州市", "宜宾市", "攀枝花市",
		"巴中市", "资阳市", "眉山市", "雅安", "阿坝藏族羌族自治州", "甘孜藏族自治州",
		"凉山彝族自治州县", "其他");
list2[list2.length] = new Array("贵阳市", "六盘水市", "遵义市", "安顺市",
		"毕节地区", "铜仁地区", "黔东南苗族侗族自治州", "黔南布依族苗族自治州", "黔西南布依族苗族自治州",
		"其他");
list2[list2.length] = new Array("昆明市", "曲靖市", "玉溪市", "保山市", "昭通市",
		"丽江市", "普洱市", "临沧市", "宁德市", "德宏傣族景颇族自治州", "怒江傈僳族自治州",
		"楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "大理白族自治州", "迪庆藏族自治州",
		"西双版纳傣族自治州", "其他");
list2[list2.length] = new Array("拉萨市", "那曲地区", "昌都地区", "林芝地区",
		"山南地区", "日喀则地区", "阿里地区", "其他");
list2[list2.length] = new Array("西安市", "延安市", "铜川市", "渭南市", "咸阳市",
		"宝鸡市", "汉中市", "安康市", "商洛市", "其他");
list2[list2.length] = new Array("兰州市 ", "嘉峪关市", "金昌市", "白银市",
		"天水市", "武威市", "酒泉市", "张掖市", "庆阳市", "平凉市", "定西市", "陇南市",
		"临夏回族自治州", "甘南藏族自治州", "其他");
list2[list2.length] = new Array("西宁市", "海东地区", "海北藏族自治州",
		"黄南藏族自治州", "玉树藏族自治州", "海南藏族自治州", "果洛藏族自治州", "海西蒙古族藏族自治州",
		"其他");
list2[list2.length] = new Array("银川市", "石嘴山市", "吴忠市", "固原市", "中卫市",
		"其他");
list2[list2.length] = new Array("乌鲁木齐市", "克拉玛依市", "喀什地区", "阿克苏地区",
		"和田地区", "吐鲁番地区", "哈密地区", "塔城地区", "阿勒泰地区", "克孜勒苏柯尔克孜自治州",
		"博尔塔拉蒙古自治州", "昌吉回族自治州伊犁哈萨克自治州", "巴音郭楞蒙古自治州", "河子市", "阿拉尔市",
		"五家渠市", "图木舒克市", "其他");
list2[list2.length] = new Array("香港", "其他");
list2[list2.length] = new Array("澳门", "其他");
list2[list2.length] = new Array("台湾", "其他");
function indexof(
		obj,
		value) {
	var k = 0;
	for (; k < obj.length; k++) {
		if (obj[k] == value)
			return k;
	}
	return k;
}
function selectprovince(
		obj) {
	ddlCity.options.length = 0;//clear
	var index = indexof(
			list1,
			obj.value);
	var list2element = list2[index];
	for ( var i = 0; i < list2element.length; i++) {
		var option = document
				.createElement("option");
		option
				.appendChild(document
						.createTextNode(list2element[i]));
		option.value = list2element[i];
		ddlCity
				.appendChild(option);
	}
}

function setLocationSelectionMenus () {
        var locationBucket = $("#buildlist_form #location-bucket");
        var locationValue = $(locationBucket).find(".lRgn").val();
        $(locationBucket).find(".location-menu-item").hide();
        $(locationBucket).find(".edit-del-geo-link").hide();
        switch (locationValue) {
            case "ALL":
                $(locationBucket).find(".new-geo-link").show();
                break;
            case "citystate":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#city-menu").show();
                break;
            case "country":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#country-menu").show();
                break;
            case "zipcode":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#zip-code-menu").show();
                break;
            case "areacode":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#area-code-menu").show();
                break;
            case "region":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#region-menu").show();
                break;
            case "newGeographicTerritory":
                $(locationBucket).find(".new-geo-link").show();
                iv.lists.formController.addNewGeography();
                break;
            default:
                $(locationBucket).find(".new-geo-link").hide();
                $(locationBucket).find(".edit-del-geo-link").show();
                break;
        }
    }
