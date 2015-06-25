$(function(){
	$(".secondaryNavListItems").click(function(){
		var menuid = $(this).attr("id");
		$(".secondaryNavListItems").removeClass("secondaryNavListItemSelected");
		$(this).addClass("secondaryNavListItemSelected");
		$(".secondaryTabPanel").css("display","none");
		$(".moresub").css("display","none");
		$(".secondarySubMenuItem").css("display","block");
		$(".secondaryNavMore").removeClass("secondaryNavListItemSelected");
		
		switch(menuid){
			case "tabAnalysis" : 
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
				app.navigate('overview/'+global_comid, { trigger: true });
				break;
			case "tabPeople" : $("#peopleInfo").css("display","block");
				$("#tabMore_stateHook").css("display","none");
				app.navigate('people/'+global_comid, { trigger: true });
				break;
			case "tabBuzz" : $("#buzzInfo").css("display","block");
				$("#tabMore_stateHook").css("display","none");
				app.navigate('buzz/'+global_comid, { trigger: true });
				break;
			case "tabFamilyTree" : $("#familyTreeCont").css("display","block");
				$("#tabMore_stateHook").css("display","none");
				app.navigate('familytree/'+global_comid, { trigger: true });
				break;
			case "tabCompetitors" : $("#competitorInfo").css("display","block");
				$("#tabMore_stateHook").css("display","none");
				app.navigate('competitor/'+global_comid, { trigger: true });
				break;
			case "tabNews" : 
				$("#allNews").css("display","block");
				$("#tabMore_stateHook").css("display","none");
				$("#sourceInfo").css("display","block");
				$(".allNewsContent").show();
				app.navigate('news/'+global_comid, { trigger: true });
				break;
//			case "tabJobs" : $("#tabMore_stateHook").css("display","block");
//				$("#jobsCont").css("display","block");
//				$(".secondaryNavSubMenuState").text("Jobs");
//				$(this).css("display","none");
//				break;
			case "tabIndustry" : 
				break;
			case "connections_knew_people" : 
				$("#searchresult").empty();
				$("#searchbox").val("");
				$("#sideBar").hide();
				$(".outerGreyBox").css("display","none");
				$(".mainGreyBox").css("display","none");
				$("#connectionsPage").css("display","block");
				$("#peopleYouKnowPage").css("display","block");
				break;
		}
	});
	
	$("#tabNotice").click(function(){
		$("#tabMore_stateHook").css("display","block");
		$("#jobsCont").css("display","block");
		$(".secondaryNavSubMenuState").text("公示公告");
		$(this).css("display","none");
		$(".secondaryNavMore").addClass("secondaryNavListItemSelected");
		app.navigate('notice/'+global_comid, { trigger: true });
	});
//	$("#tabNews").click(function(){
//		$("#tabMore_stateHook").css("display","block");
//		$("#allNews").css("display","block");
//		$(".secondaryNavSubMenuState").text("所有新闻");
//		$(this).css("display","none");
//		$(".secondaryNavMore").addClass("secondaryNavListItemSelected");
//		app.navigate('news/'+global_comid, { trigger: true });
//	});
});