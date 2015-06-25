var global_comid = "1";
$(function(){
	/*
	 * ��ť֮����л�
	 */
	$("#homePage").click(function(){
		$(".menu_tab").removeClass("menu_bg");
		$("#homePage").addClass("menu_bg");
//		$(".mainGreyBox").css("display","none");
//		$("#firstpage").css("display","block");
//		$("#tabAnalysis").click();
	});
	$("#searchPage").click(function(){
		$(".menu_tab").removeClass("menu_bg");
		$("#searchPage").addClass("menu_bg");
		$(".mainGreyBox").css("display","none");
		$("#searchTab").css("display","block");
		$("#maitoolTab").css("display","none");
	});
	$("#maitoolPage").click(function(){
		$(".menu_tab").removeClass("menu_bg");
		$("#searchPage").addClass("menu_bg");
		$(".mainGreyBox").css("display","none");
		$("#searchTab").css("display","none");
		$("#maitoolTab").css("display","block");
	});
	$("#watchlistPage").click(function(){
		$(".menu_tab").removeClass("menu_bg");
		$("#watchlistPage").addClass("menu_bg");
		$(".mainGreyBox").css("display","none");
		$("#watchListTab").css("display","block");
		$("#maitoolTab").css("display","none");
		var CompanyWatchListMan = new CompanyWatchListModel().init(global_comid); //��ʾwatchlist company�б�
    	var PeopleWatchListMan = new PeopleWatchListModel().init(global_comid); //��ʾwatchlist people�б�
	});
});