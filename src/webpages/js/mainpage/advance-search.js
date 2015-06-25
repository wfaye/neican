var group_id="";
var group_type="0";
var showComPageCount = 0;  //作为点击公司tab标志，首次点击时发送查询请求，之后不发送
jQuery(document).ready(function(){
	var hiringIndustry=$("#hiring-industry");
	var personIndustry=$("#person-industry");
	var companyProvince=$("#company-province");
	var companyCity = $("#company-city");
	var personProvince=$("#person-province");
	var companyStatus=$("#company-detail-bucket #company-status");
	var companyType=$('#company-type');
	var companyAutoComplete=$('#company-type-autocomplete');
	var positionHiring=$('#hiring-position');
	var positionAutoComplete=$('#position-autocomplete');
	var personPosition=$('#person-position');
	var personPositionAutoComplete=$('#person-position-autocomplete');
	var companyColleage=$('#company-colleage');
	var colleageAutoComplete=$('#company-colleage-autocomplete');
	var searchCompany=$('.company-bucket .j-search');
	var searchPeople=$('.people-bucket #search');
	var clearCompany=$('.company-bucket #clear');
	var clearPeople=$('.people-bucket #clear');
	var industryCompanyBelong=$('#company-industry-belong');
	var companyIdentifier=$('#certified_product');
	var hiringDepartment = $("#hiring-department");
	var hiringPosition = $("#hiring-position");

	//行业和资质获取
	refreshAdvanceSearchData();
	//获取省市级联菜单
	$.ajax({
		url : "/ekb/provinces",
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyProvince.append('<option value="">请选择</option>');
			companyProvince.append('<option value="">全部</option>');
			personProvince.append('<option value="">请选择</option>');
			personProvince.append('<option value="">全部</option>');
			for(var index=0;index<count;index++){
				companyProvince.append('<option value="'+data.provinces[index].province_id+'">'+data.provinces[index].province_name+'</option>');
				personProvince.append('<option value="'+data.provinces[index].province_id+'">'+data.provinces[index].province_name+'</option>');
			}
			setCity(companyProvince);
			setCity(personProvince);
		}
	});
	companyProvince.change(function(){
		$('#'+companyProvince.attr('id').replace('province','city')+' option').remove();
		if(companyProvince.val()=='1'||companyProvince.val()=='2'
			||companyProvince.val()=='3'||companyProvince.val()=='4'){
			$('#'+companyProvince.attr('id').replace('province','city')).append('<option value="'+companyProvince.val()+'">'+companyProvince.find('option:selected').text()+'</option>');
			setTown($('#'+companyProvince.attr('id').replace('province','city')));

			return;
		}
		setCity($(this));
	});
	companyCity.change(function(){
		$('#'+companyCity.attr('id').replace('city','town')+' option').remove();
		
		setTown($(this));
	});
	personProvince.change(function(){
		$('#'+personProvince.attr('id').replace('province','city')+' option').remove();
		if(personProvince.val()=='1'||personProvince.val()=='2'
			||personProvince.val()=='3'||personProvince.val()=='4'){
			$('#'+personProvince.attr('id').replace('province','city')).append('<option value="'+personProvince.val()+'">'+personProvince.find('option:selected').text()+'</option>');
			return;
		}
		setCity($(this));
	});
	function setCity(sender){
		if(sender.val()!=""&& sender.val()!=undefined){
			$.ajax({
				url : "/ekb/"+sender.val()+"/cities",
				type : "GET",
				success : function(data){
					data=JSON.parse(data).data;
					var count=data.count;
					$('#'+sender.attr('id').replace('province','city')).append('<option value="">请选择</option>');
					$('#'+sender.attr('id').replace('province','city')).append('<option value="">全部</option>');
					for(var index=0;index<count;index++){
						$('#'+sender.attr('id').replace('province','city')).append('<option value="'+data.cities[index].city_id+'">'+data.cities[index].city_name+'</option>');
					}
				}
			});
		}
	}
	function setTown(sender){
		if(sender.val()!=""&& sender.val()!=undefined){
			$.ajax({
				url : "/ekb/"+sender.val()+"/districts",
				type : "GET",
				success : function(data){
					data=JSON.parse(data).data;
					var count=data.count;
					$('#'+sender.attr('id').replace('city','town')).append('<option value="">请选择</option>');
					$('#'+sender.attr('id').replace('city','town')).append('<option value="">全部</option>');
					for(var index=0;index<count;index++){
						$('#'+sender.attr('id').replace('city','town')).append('<option value="'+data.districts[index].district_id+'">'+data.districts[index].district_name+'</option>');
					}
				}
			});
		}
	}
	//获取部门列表
	group_type = $('.company-bucket .search_range').find('option:selected').attr('lib-type');
	group_id = $('.company-bucket .search_range').find('option:selected').val();
	var queryString = '{"page_num":"1","org_group_id":"' + group_id + '","org_group_type":"' + group_type + '"}';
	$.ajax({
		url : "/ekb/departments?q=" + queryString,
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			for(var index=0;index<data.depts.length;index++){
				hiringDepartment.append('<option value="'+data.depts[index]+'">'+data.depts[index]+'</option>');
			}
			// setPosition(hiringIndustry);
			// setPosition(hiringDepartment);
		}
	});
	//获取职位列表
	$.ajax({
		url : "/ekb/jobtypes?q=" + queryString,
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			for(var index=0;index<data.jobTypes.length;index++){
				hiringPosition.append('<option value="' + data.jobTypes[index] + '">' + data.jobTypes[index] + '</option>');
			}
		}
	});
//	hiringIndustry.change(function(){
//		$('#'+hiringIndustry.attr('id').replace('industry','position')+' option').remove();
//		setPosition($(this));
//	});
//	personIndustry.change(function(){
//		$('#'+personIndustry.attr('id').replace('industry','position')+' option').remove();
//		setPosition($(this));
//	});
	function setPosition(sender){
		$.ajax({
			url : "/ekb/jobPositionList/"+sender.val(),
			type : "GET",
			success : function(data){
				data=JSON.parse(data).data;
				var count=data.count;
				for(var index=0;index<count;index++){
					$('#'+sender.attr('id').replace('department','position')).append('<option value="'+data.jobPositions[index].id+'">'+data.jobPositions[index].jobPositionName+'</option>');
				}
			}
		});
	}
	
	//综合查询职位autocomplete
	positionHiring.keyup(function(){
		$("#"+positionAutoComplete.attr('id')+' li').remove();
		$.ajax({
		url : "/ekb/hposition/autocomplete?searchString="+positionHiring.val(),
		type : "GET",
		success : function(data){
			if(positionHiring.val()==""){
				positionAutoComplete.hide();
				return;
			}
			data=JSON.parse(data).data;
			var count=data.count;
			var string="";
			$("#"+positionAutoComplete.attr('id')+' li').remove();
			for(var index=0;index<count;index++){
				positionAutoComplete.append('<li><a h_id="'+data.hiring_positions[index].h_id+'" href="javascript:void(0);;">'+data.hiring_positions[index].hiring_position+'</a></li>');
			}
			positionAutoComplete.show();
		}
		});
	});
	positionHiring.change(function(){
		if(positionHiring.val()==''){
			positionHiring.attr('h_id','');
		}
	});
	$('body').click(function(){
		$("#"+positionAutoComplete.attr('id')+' li').remove();
		positionAutoComplete.hide();
	});
	positionAutoComplete.on('click','li a',function(){
			positionHiring.val($(this).text());
			positionHiring.attr('h_id',$(this).attr('h_id'));
	});
	//综合查询职位person-autocomplete
	personPosition.keyup(function(){
		$("#"+personPositionAutoComplete.attr('id')+' li').remove();
		$.ajax({
		url : "/ekb/hposition/autocomplete?searchString="+personPosition.val(),
		type : "GET",
		success : function(data){
			if(personPosition.val()==""){
				personPositionAutoComplete.hide();
				return;
			}
			data=JSON.parse(data).data;
			var count=data.count;
			var string="";
			$("#"+personPositionAutoComplete.attr('id')+' li').remove();
			for(var index=0;index<count;index++){
				personPositionAutoComplete.append('<li><a h_id="'+data.hiring_positions[index].h_id+'" href="javascript:void(0);;">'+data.hiring_positions[index].hiring_position+'</a></li>');
			}
			personPositionAutoComplete.show();
		}
		});
	});
	personPosition.change(function(){
		if(personPosition.val()==''){
			personPosition.attr('h_id','');
		}
	});
	$('body').click(function(){
		$("#"+personPositionAutoComplete.attr('id')+' li').remove();
		personPositionAutoComplete.hide();
	});
	personPositionAutoComplete.on('click','li a',function(){
			personPosition.val($(this).text());
			personPosition.attr('h_id',$(this).attr('h_id'));
	});
	
//	//综合查询页获取公司类型org_type_autocomplete
//	companyType.keyup(function(){
//		$("#"+companyAutoComplete.attr('id')+' li').remove();
//		$.ajax({
//		url : "/ekb/orgtype/autocomplete?searchString="+companyType.val(),
//		type : "GET",
//		success : function(data){
//			if(companyType.val()==""){
//				companyAutoComplete.hide();
//				return;
//			}
//			data=JSON.parse(data).data;
//			var count=data.count;
//			var string="";
//			$("#"+companyAutoComplete.attr('id')+' li').remove();
//			for(var index=0;index<count;index++){
//				companyAutoComplete.append('<li style="margin-right:5px"><a type_id="'+data.types[index].typeId+'" href="javascript:void(0);;">'+data.types[index].orgType+'</a></li>');
//			}
//			companyAutoComplete.show();
//		}
//		});
//	});
	
//	companyType.change(function(){
//		if(companyType.val()==''){
//			companyType.attr('type_id','');
//			companyType.attr('type_id','');
//		}
//	});
	//综合查询点击返回查询页面
	$('#menu_box #searchPage').click(function(){
		$('#modify-criteria').trigger('click');
	});
	$('body').click(function(){
		$("#"+companyAutoComplete.attr('id')+' li').remove();
		companyAutoComplete.hide();
	});
	companyAutoComplete.on('click','li a',function(){
			companyType.val($(this).text());
			companyType.attr('type_id',$(this).attr('type_id'));
	});
	
	//同事autocomplete
	companyColleage.keyup(function(){
		$("#"+colleageAutoComplete.attr('id')+' li').remove();
		$.ajax({
		url : "/ekb/colleague/autocomplete?searchString="+companyColleage.val(),
		type : "GET",
		success : function(data){
			if(companyColleage.val()==""){
				colleageAutoComplete.hide();
				return;
			}
			data=JSON.parse(data).data;
			var count=data.count;
			var string="";
			$("#"+colleageAutoComplete.attr('id')+' li').remove();
			for(var index=0;index<count;index++){
				colleageAutoComplete.append('<li><a employmentId="'+data.colleagues[index].employmentId+'" companyId="'+data.colleagues[index].companyId+'" href="javascript:void(0);;">'+data.colleagues[index].fullName+"  " +data.colleagues[index].companyName+'</a></li>');
			}
			colleageAutoComplete.show();
		}
		});
	});
	companyColleage.change(function(){
		if(companyColleage.val()==''){
			companyColleage.attr('employmentId','');
			companyColleage.attr('companyId','');
		}
	});
	$('body').click(function(){
		$("#"+colleageAutoComplete.attr('id')+' li').remove();
		colleageAutoComplete.hide();
	});
	colleageAutoComplete.on('click','li a',function(){
			companyColleage.val($(this).text());
			companyColleage.attr('employmentId',$(this).attr('employmentId'));
			companyColleage.attr('companyId',$(this).attr('companyId'));
	});

	/*高级搜索结果页面切换*/
	$('#advanceSearch-companyResults').click(function(){
		if (showComPageCount == 0) {
			showCompanyResult();
		}
		
		$('#advanceSearch-companyPanel').css('display',"block");
		$('#advanceSearch-peoplePanel').css('display',"none");
		$('.export-company-table').show();
		$('.export-people-table').hide();
		showComPageCount++;
	});
	$('#advanceSearch-peopleResults').click(function(){
		hideCompanySearch();
		// showPeopleResult();
		$('#advanceSearch-companyPanel').css('display',"none");
		$('#advanceSearch-peoplePanel').css('display',"block");
		$('.export-company-table').hide();
		$('.export-people-table').show();
	});
	//清除公司搜索条件
	clearCompany.click(function(){
		// $('#company-base-bucket input[name="company-name"]').val('');
		// $('#company-detail-bucket input[name="company-incharge-person"]').val('');
		// $('#company-detail-bucket select[name="company-type"]').attr('type_id','');
		// $('#company-detail-bucket select[name="company-type"]').val('');
		// $('#company-detail-bucket #company-status').val('');
		// $('#company-base-bucket input[name="commercial-registration"]').val('');
		$('#location-bucket #company-province').val('');
		$('#location-bucket #company-city').val('');
		$('#location-bucket #company-city').text('');
		$('#location-bucket #company-town').val('');
		$('#location-bucket #company-town').text('');
		// $('#company-base-bucket input[name="code"]').val('');
		// $('#company-hiring-bucket input[name="hiring-position"]').attr('h_id','');
		// $('#company-hiring-bucket input[name="hiring-position"]').val('');
		// $('#company-relation-bucket input[name="company-relation"]').val('');
		// $('#company-mate-bucket input[name="company-colleage"]').attr('employmentId','');
		// $('#company-mate-bucket input[name="company-colleage"]').val('');
		// $('#company-news-bucket input[name="company-news"]').val('');
		// $('#org_size_min').val("");
		// $('#org_size_max').val("");
		// $('#registered_capital_min').val("");
		// $('#registered_capital_max').val("");
		// $('#company-industry-belong').val("");
		// $('#certified_product').val("");
		$("#search_main")[0].reset();
		$("#city-menu").hide();
	});
	//清除人员搜索条件
	clearPeople.click(function(){
		$('#people-base-bucket input[name="company-name"]').val('');
		$('#people-base-bucket input[name="person-name"]').val('');
		$('#people-position-bucket input[name="person-position"]').attr('employmentId','');
		$('#people-position-bucket input[name="person-position"]').val('');
		$('#people-base-bucket #person-province').val('');
		$('#people-base-bucket #person-city').val('');
		$('#people-base-bucket #person-city').text('');
		$('#people-base-bucket input[name="code"]').val('');
		$('#people-contact-bucket input[name="person-tel"]').val('');
		$('#people-contact-bucket input[name="person-email"]').val('');
		$('#people-contact-bucket input[name="person-weibo"]').val('');
		$('#people-contact-bucket input[name="person-qq"]').val('');
		$('#people-news-bucket input[name="people-news"]').val('');
	});
	//查询结果公司tab操作
	function showCompanyResult () {
		var queryCondition = "";

		$('.export-people-table').hide();
		$('.export-company-table').show();

		showLoading();

		if(jQuery('#advancesearch-company-page').html()!=''){
    		jQuery('#advancesearch-company-page').pagination('destroy');
		}

		$('#advancesearch-companyDataSet').html('');
		
		queryCondition = getSearchCompanyQuery(1);

		var advanceSearchCompanyWatchListModel = new AdvanceSearchCompanyWatchListModel().init(queryCondition,"1",true,false);
		hidePeosonSearch();
		$('.DTTT_container').css('display','none');
	}
	
	//查询结果人员tab操作
	function showPeopleResult () {  
		$('.export-company-table').hide();
		$('.export-people-table').show();

		showLoading();

		if(jQuery('#advancesearch-people-page').html()!=''){
    		jQuery('#advancesearch-people-page').pagination('destroy');
		}
		
		$('#advancesearch-peopleDataSet').html('');

		var queryCondition = getSearchPeopleQuery(1);
		
		var advanceSearchPeopleWatchListModel = new AdvanceSearchPeopleWatchListModel().init(queryCondition,"1",true,false);
		hideCompanySearch();
		$('.DTTT_container').css('display','none');
	}

	//公司查询搜索按钮操作
	searchCompany.click(function(){
		var locationType = $("select[name='lRgn']").val();
		var zipcode = $('#location-bucket input[name="code"]').val();

		if (locationType == "zipcode" && !isInputRight(zipcode)) {
			alert("邮编无效，请重新输入！");
			return;
		} else {
			$('#location-bucket input[name="code"]').val("");
		}
		showComPageCount = 0;

		var type = $(".searchselected").attr("tabvalue");
		$("#advanceSearch-peopleResults").addClass("secondaryNavListItemSelected");
		$("#results-view-container").css("display","block");
		$(".form-container").css("display","none");

		$("#peopleResultCount").html("");
		$("#companyCount").html("");

		if(jQuery('#advancesearch-company-page').html()!=''){
    		jQuery('#advancesearch-company-page').pagination('destroy');
		}
		$('#advancesearch-companyDataSet').html('');

		showPeopleResult();
	});
	
	//人员查询搜索按钮操作
	searchPeople.click(function(){
		$('#export_table').css('display','none');
		$('#export_table_people').css('display','block');
		if($('#people-base-bucket input[name="company-name"]').val()==''&&
				$('#people-base-bucket input[name="person-name"]').val()==''&&
				($('#people-base-bucket #person-province').val()==''||$('#people-base-bucket #person-province').val()==null)&&
				($('#people-base-bucket #person-city').val()==''||$('#people-base-bucket #person-city').val()==null)&&
				$('#people-base-bucket input[name="code"]').val()==''&&
				($('#people-position-bucket input[name="person-position"]').attr('employmentId')==''||$('#people-position-bucket input[name="person-position"]').attr('employmentId')==undefined)&&
				$('#people-contact-bucket input[name="person-tel"]').val()==''&&
				$('#people-contact-bucket input[name="person-email"]').val()==''&&
				$('#people-contact-bucket input[name="person-weibo"]').val()==''&&
				$('#people-contact-bucket input[name="person-qq"]').val()==''){
					alert('请填写至少一项查询条件！');
					$('#modify-criteria').trigger('click');
					return;
				}
		showLoading();
		if(jQuery('#advancesearch-people-page').html()!=''){
    		jQuery('#advancesearch-people-page').pagination('destroy');
		}
		var province=$('#people-base-bucket #person-province').find('option:selected').text();
		var city=$('#people-base-bucket #person-city').find('option:selected').text();
		
		if(province=='北京'||province=='上海'
			||province=='重庆'||province=='天津'||province=='请选择'||province=='全部'){
			province='';
		}
		if(city=='请选择'||city=='全部'){
			city='';
		}

		$('#advancesearch-peopleDataSet').html('');
		var queryCondition='{"org_name":"'+$('#people-base-bucket input[name="company-name"]').val()
		+'","person_name":"'+$('#people-base-bucket input[name="person-name"]').val()
		+'","hiring_position":"'+$('#people-position-bucket input[name="person-position"]').attr('employmentId')
		+'","org_province":"'+province
		+'","org_city":"'+$('#people-base-bucket #person-city').find('option:selected').text()
		+'","org_zipcode":"'+$('#people-base-bucket input[name="code"]').val()
		+'","mobile":"'+$('#people-contact-bucket input[name="person-tel"]').val()
		+'","email":"'+$('#people-contact-bucket input[name="person-email"]').val()
		+'","sina_weibo":"'+$('#people-contact-bucket input[name="person-weibo"]').val()
		+'","qq_weibo":"'+$('#people-contact-bucket input[name="person-qq"]').val()
		+'","page_num":"'+1
		+'","org_group_id":"'+group_id
		+'","org_group_type":"'+group_type
		+'"}';
		queryCondition=queryCondition.replace(/undefined/g,"").replace(/null/g, "");
		var advanceSearchPeopleWatchListModel = new AdvanceSearchPeopleWatchListModel().init(queryCondition,"1",true,false);
		hideCompanySearch();
		$('.DTTT_container').css('display','none');
	});
	
	
	//"{"org_name":"平安","in_charge_person":"","org_reg_type":"undefined","org_status":"-1","license_num":"","org_reg_address":"","province":"1","city":"null","zipcode":"","job_position":"undefined","family_org_key":"","colleague_person_key":"1","user_person_key":"37"}"
});

//导出企业数据
function setCompanyExportTable(){
		showLoading();
		
		var queryCondition = getSearchCompanyQuery(0);

		$.ajax({
			url : "/ekb/buildList?vs=CR&q="+queryCondition,
			dataType:"json",
			contentType:"application/json",
			type : "GET",
			success : function(result){
				var companies=result.data.companies;
				$('#advancesearch-companyDataTable tbody tr').remove();
				var tableTem=$('#advancesearch-companyDataTable').prop('outerHTML');
				$('#company-page-table').html('');
				$('#company-page-table').append(tableTem);
				for(var i=0;i<companies.length;i++){
					$('#advancesearch-companyDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
							+companies[i].companyName+'</td><td class=" ">'
							+companies[i].address+'</td><td class=" ">'
							+companies[i].orgStatus+'</td><td class=" ">'
							+companies[i].regType+'</td><td class=" ">'
							+companies[i].industry+'</td><td class=" ">'
							+companies[i].numberOfEmployees+'</td><td class=" ">'
							+companies[i].revenue+'</td></tr>');
				}
				var now= new Date();
				var year=now.getFullYear();
				var month=now.getMonth()+1;
				var day=now.getDate();
				$('#advancesearch-companyDataTable').dataTable({
	    	        "bJQueryUI": false,
	    	        'bPaginate': false, //是否分页
	    	        "bRetrieve": true, //是否允许从新生成表格
	    	        "bInfo": false, //显示表格的相关信息
	    	        "bDestroy": true,
	    	        "bServerSide": false,
	    	        "bProcessing": true, //当处理大量数据时，显示进度，进度条等
	    	        "bFilter": false, //搜索框
	    	        "bLengthChange": false, //动态指定分页后每页显示的记录数
	    	        "bSort": false, //排序
	    	        "bStateSave": false, //缓存
	    	        "sAjaxDataProp": "data",
	    	        "sDom": 'T<"clear">lfrtip',
	    	        "oTableTools": {
	    	        	"aButtons": [
   	        	                  {
   	        	                      "sExtends": "xls",
   	        	                      "sFileName": "脉拓导出_"+year+month+day+".xls"}
	    	        	            ],
	    	        	 "sSwfPath": "http://cdn.bootcss.com/datatables-tabletools/2.1.5/swf/copy_csv_xls_pdf.swf"
	    	        }
	    		});
				hideLoading();
				// $('#ToolTables_advancesearch-companyDataTable_0').trigger('select');
				$('#people-page-table').css('display','none');
				$('#company-page-table').css('display','block');
				$('.DTTT_container').css('display','block');
				$('.export-company-table').css('display','none');
			}
		});
}
function setCompanyExportTableOld(){
	swal({
		title : "导出文件包括员工信息吗？",
		text : "",
		type : "warning",
		showCancelButton : true,
		confirmButtonColor : "#DD6B55",
		confirmButtonText : "是的,包括员工信息!",
		cancelButtonText : "不需要,谢谢!",
		closeOnConfirm : false,
		closeOnCancel : false
	}, function(isConfirm) {
		showLoading();
		var province=$('#company-base-bucket #company-province').find('option:selected').text();
		var city=$('#company-base-bucket #company-city').find('option:selected').text();
		
		if(province=='北京'||province=='上海'
			||province=='重庆'||province=='天津'||province=='请选择'||province=='全部'){
			province='';
		}
		if(city=='请选择'||city=='全部'){
			city='';
		}
		var in_employee_flag=0;
		if(isConfirm){
			in_employee_flag=1;
		}
		var queryCondition='{"org_name":"'+$('#company-base-bucket input[name="company-name"]').val()
				+'","in_charge_person":"'+$('#company-detail-bucket input[name="company-incharge-person"]').val()
				+'","org_reg_type":"'+$('#company-detail-bucket select[name="company-type"]').val()
				+'","org_status":"'+$('#company-detail-bucket #company-status').val()
				+'","license_num":"'+$('#company-base-bucket input[name="commercial-registration"]').val()
				+'","org_reg_address":"'+""
				+'","province":"'+province
				+'","city":"'+city
				+'","zipcode":"'+$('#company-base-bucket input[name="code"]').val()
				+'","job_position":"'+$('#company-hiring-bucket input[name="hiring-position"]').attr('h_id')
				+'","family_org_key":"'+$('#company-relation-bucket input[name="company-relation"]').val()
				+'","colleague_person_key":"'+$('#company-mate-bucket input[name="company-colleage"]').attr('employmentId')
				+'","user_person_key":"'+""
				+'","org_size_min":"'+$('#org_size_min').val()
				+'","org_size_max":"'+$('#org_size_max').val()
				+'","registered_capital_min":"'+$('#registered_capital_min').val() * 10000
				+'","registered_capital_max":"'+$('#registered_capital_max').val() * 10000
				+'","industry_class":"'+$('#company-industry-belong').val()
				+'","certified_product":"'+$('#certified_product').val()
				+'","in_employee_flag":"'+in_employee_flag
				+'","page_num":"'+0
				+'","org_group_id":"'+group_id
				+'","org_group_type":"'+group_type
				+'"}';
		queryCondition=queryCondition.replace(/undefined/g,"").replace(/null/g, "");
		$.ajax({
			url : "/ekb/buildList?vs=CR&q="+queryCondition,
			dataType:"json",
			contentType:"application/json",
			type : "GET",
			success : function(result){
				var companies=result.data.companies;
				$('#advancesearch-companyDataTable tbody tr').remove();
				var tableTem=$('#advancesearch-companyDataTable').prop('outerHTML');
				$('#company-page-table').html('');
				$('#company-page-table').append(tableTem);
				for(var i=0;i<companies.length;i++){
					
					if(companies[i].hasOwnProperty('employees')){
						if(companies[i]['employees'].length==0){
							$('#advancesearch-companyDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
									+companies[i].companyName+'</td><td class=" ">'
									+companies[i].inChargePerson+'</td><td class=" ">'
									+companies[i].province+companies[i].city+'</td><td class=" ">'
									+companies[i].address+'</td><td class=" ">'
									+companies[i].orgStatus+'</td><td class=" ">'
									+companies[i].licenseNum+'</td><td class=" ">'
									+companies[i].regType+'</td><td class=" ">'
									+companies[i].revenue+'</td><td class=" ">'
									+companies[i].numberOfEmployees+'</td><td class=" ">'
									+""+'</td><td class=" ">'
									+""+'</td><td class=" ">'
									+""+'</td><td class=" ">'
									+""+'</td><td class=" ">'
									+""+'</td></tr>');
						}else {
							var preEmployee=companies[i].employees[0].person_name;
							$('#advancesearch-companyDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
									+companies[i].companyName+'</td><td class=" ">'
									+companies[i].inChargePerson+'</td><td class=" ">'
									+companies[i].province+companies[i].city+'</td><td class=" ">'
									+companies[i].address+'</td><td class=" ">'
									+companies[i].orgStatus+'</td><td class=" ">'
									+companies[i].licenseNum+'</td><td class=" ">'
									+companies[i].regType+'</td><td class=" ">'
									+companies[i].revenue+'</td><td class=" ">'
									+companies[i].numberOfEmployees+'</td><td class=" ">'
									+companies[i].employees[0].person_name+'</td><td class="job_position">'
									+companies[i].employees[0].job_position+'</td><td class="dept_name">'
									+companies[i].employees[0].dept_name+'</td><td class=" ">'
									+companies[i].employees[0].mobile+'</td><td class=" ">'
									+companies[i].employees[0].email+'</td></tr>');
							for(var j=1;j<companies[i]['employees'].length;j++){
									if(companies[i].employees[j].person_name!=""&&companies[i].employees[j].person_name==preEmployee){
										$('#advancesearch-companyDataTable tbody .job_position:last').text($('#advancesearch-companyDataTable tbody .job_position:last').text()+"/"+companies[i].employees[j].job_position);
										$('#advancesearch-companyDataTable tbody .dept_name:last').text($('#advancesearch-companyDataTable tbody .dept_name:last').text()+"/"+companies[i].employees[j].dept_name);
										continue;
									}
								
								$('#advancesearch-companyDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
										+companies[i].companyName+'</td><td class=" ">'
										+companies[i].inChargePerson+'</td><td class=" ">'
										+companies[i].province+companies[i].city+'</td><td class=" ">'
										+companies[i].address+'</td><td class=" ">'
										+companies[i].orgStatus+'</td><td class=" ">'
										+companies[i].licenseNum+'</td><td class=" ">'
										+companies[i].regType+'</td><td class=" ">'
										+companies[i].revenue+'</td><td class=" ">'
										+companies[i].numberOfEmployees+'</td><td class=" ">'
										+companies[i].employees[j].person_name+'</td><td class="job_position">'
										+companies[i].employees[j].job_position+'</td><td class="dept_name">'
										+companies[i].employees[j].dept_name+'</td><td class=" ">'
										+companies[i].employees[j].mobile+'</td><td class=" ">'
										+companies[i].employees[j].email+'</td></tr>');
								preEmployee=companies[i].employees[j].person_name;
							}
						}
					}else {
						$('#advancesearch-companyDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
								+companies[i].companyName+'</td><td class=" ">'
								+companies[i].inChargePerson+'</td><td class=" ">'
								+companies[i].province+companies[i].city+'</td><td class=" ">'
								+companies[i].address+'</td><td class=" ">'
								+companies[i].orgStatus+'</td><td class=" ">'
								+companies[i].licenseNum+'</td><td class=" ">'
								+companies[i].regType+'</td><td class=" ">'
								+companies[i].revenue+'</td><td class=" ">'
								+companies[i].numberOfEmployees+'</td><td class=" ">'
								+""+'</td><td class=" ">'
								+""+'</td><td class=" ">'
								+""+'</td><td class=" ">'
								+""+'</td><td class=" ">'
								+""+'</td></tr>');
					}
					
				}
				var now= new Date();
				var year=now.getFullYear();
				var month=now.getMonth()+1;
				var day=now.getDate();
				$('#advancesearch-companyDataTable').dataTable({
	    	        "bJQueryUI": false,
	    	        'bPaginate': false, //是否分页
	    	        "bRetrieve": true, //是否允许从新生成表格
	    	        "bInfo": false, //显示表格的相关信息
	    	        "bDestroy": true,
	    	        "bServerSide": false,
	    	        "bProcessing": true, //当处理大量数据时，显示进度，进度条等
	    	        "bFilter": false, //搜索框
	    	        "bLengthChange": false, //动态指定分页后每页显示的记录数
	    	        "bSort": false, //排序
	    	        "bStateSave": false, //缓存
	    	        "sAjaxDataProp": "data",
	    	        "sDom": 'T<"clear">lfrtip',
	    	        "oTableTools": {
	    	        	"aButtons": [
   	        	                  {
   	        	                      "sExtends": "xls",
   	        	                      "sFileName": "脉拓导出_"+year+month+day+".xls"}
	    	        	            ],
	    	        	 "sSwfPath": "http://cdn.bootcss.com/datatables-tabletools/2.1.5/swf/copy_csv_xls_pdf.swf"
	    	        }
	    		});
				hideLoading();
				$('#ToolTables_advancesearch-companyDataTable_0').trigger('select');
				$('#people-page-table').css('display','none');
				$('#company-page-table').css('display','block');
				$('.DTTT_container').css('display','block');
				$('#export_table').css('display','none');
			}
		});
	});

}
function setPeopleExportTable(people){
	showLoading();
	
	var queryCondition = getSearchPeopleQuery(0);
	$.ajax({
		url : "/ekb/buildList?vs=PR&q="+queryCondition,
		dataType:"json",
		contentType:"application/json",
		type : "GET",
		success : function(result){
			var persons=result.data.employees;
			$('#advancesearch-peopleDataTable tbody tr').remove();
			var tableTem=$('#advancesearch-peopleDataTable').prop('outerHTML');
			$('#people-page-table').html('');
			$('#people-page-table').append(tableTem);
			for(var i=0;i<persons.length;i++){
				$('#advancesearch-peopleDataTable tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
						+persons[i].person_name+'</td><td class=" ">'
						+persons[i].org_name+'</td><td class=" ">'
						+persons[i].dept_name+'</td><td class=" ">'
						+persons[i].job_position+'</td><td class=" ">'
						+persons[i].mobile+'</td><td class=" ">'
						+persons[i].email+'</td></tr>');
			}
			var now= new Date();
			var year=now.getFullYear();
			var month=now.getMonth()+1;
			var day=now.getDate();
			$('#advancesearch-peopleDataTable').dataTable({
    	        "bJQueryUI": false,
    	        'bPaginate': false, //是否分页
    	        "bRetrieve": true, //是否允许从新生成表格
    	        "bInfo": false, //显示表格的相关信息
    	        "bDestroy": true,
    	        "bServerSide": false,
    	        "bProcessing": true, //当处理大量数据时，显示进度，进度条等
    	        "bFilter": false, //搜索框
    	        "bLengthChange": false, //动态指定分页后每页显示的记录数
    	        "bSort": false, //排序
    	        "bStateSave": false, //缓存
    	        "sAjaxDataProp": "data",
    	        "sDom": 'T<"clear">lfrtip',
    	        "oTableTools": {
    	        	"aButtons": 
    	        	[
		                 {
			                  "sExtends": "xls",
			                  "sFileName": "脉拓导出_"+year+month+day+".xls"
	              		}
 	        	    ],
    	        	 "sSwfPath": "http://cdn.bootcss.com/datatables-tabletools/2.1.5/swf/copy_csv_xls_pdf.swf"
    	        }
    		});
			hideLoading();
			$('#company-page-table').css('display','none');
			$('#people-page-table').css('display','block');
			$('.DTTT_container').css('display','block');
			$('.export-people-table').css('display','none');
		}
	});

}
function showLoading(){
	
	swal({
		  title:"加载中,请稍候...",
		  confirmButtonText: "取消",
		  closeOnConfirm: true,
		  imageUrl:"/image/loadingClock.gif"
		}, function(){
		});
//	$('#backgound-loading').css('display','block');
//	$('#progressBar-loading').css('display','block');
}
function hideLoading(){
	jQuery('.sweet-alert .confirm').trigger('click');
//	$('#backgound-loading').css('display','none');
//	$('#progressBar-loading').css('display','none');
}
function hidePeosonSearch(){
	jQuery('#advanceSearch-companyPanel').css('display','block');
	jQuery('#advancesearch-peoplePanel').css('display','none');
}
function hideCompanySearch(){
	jQuery('#advanceSearch-companyPanel').css('display','none');
	jQuery('#advancesearch-peoplePanel').css('display','block');
}
function setCompanyLink(id){
	global_comid = id;
	$("#tabAnalysis").click();
	$(".back-to-com-search-result").show();
}

//构造查询公司的查询条件
function getSearchCompanyQuery (page) {
	var org_group_type = $('.company-bucket .search_range').find('option:selected').attr('lib-type');
	var org_group_id = $('.company-bucket .search_range').find('option:selected').val();
	var province=$('#location-bucket #company-province').find('option:selected').text();
	var city=$('#location-bucket #company-city').find('option:selected').text();
	var district=$('#location-bucket #company-town').find('option:selected').text();
	var locationType = $("select[name='lRgn']").val();
	var maxCapital = $('#registered_capital_max').val()?($('#registered_capital_max').val() * 10000):"";
	var minCapital = $('#registered_capital_min').val()?($('#registered_capital_min').val() * 10000):"";
	var uid=GetQueryString('uid');

	if(province=='北京'||province=='上海'
		||province=='重庆'||province=='天津'||province=='请选择'||province=='全部'){
		province='';
	}
	if(city=='请选择'||city=='全部'){
		city='';
	}
	if(district=='请选择'||district=='全部'){
		district='';
	}

	if (locationType != "citystate") {
		province = "";
		city = "";
		district = "";
	}

	var queryCondition='{"org_reg_type_str":"'+$('#company-business-bucket select[name="company-type"]').val()
			+'","org_status_str":"'+$('#company-business-bucket #company-status').val()
			+'","org_reg_address":"'+""
			+'","province":"'+province
			+'","city":"'+city
			+'","district":"'+district
			+'","zipcode":"'+$('#location-bucket input[name="code"]').val()
			+'","job_position_type_str":"'+$('#company-mate-bucket select[name="hiring-position"]').val()
			+'","org_size_min":"'+$('#org_size_min').val()
			+'","org_size_max":"'+$('#org_size_max').val()
			+'","registered_capital_min":"'+minCapital
			+'","registered_capital_max":"'+maxCapital
			+'","industry_class_str":"'+$('#company-industry-belong').val()
			+'","certified_product":"'+$('#certified_product').val()
			+'","person_page_num":"'+0
			+'","org_page_num":"'+page
			+'","org_group_id":"'+org_group_id
			+'","org_group_type":"'+org_group_type
			+'","org_department_str":"'+$('#company-mate-bucket select[name="hiring-department"]').val()
			+'"}';

	queryCondition=queryCondition.replace(/undefined/g,"").replace(/null/g, "");

	return queryCondition;
}
//构造查询人员的查询条件
function getSearchPeopleQuery (page) {
	var org_group_type = $('.company-bucket .search_range').find('option:selected').attr('lib-type');
	var org_group_id = $('.company-bucket .search_range').find('option:selected').val();
	var province=$('#location-bucket #company-province').find('option:selected').text();
	var city=$('#location-bucket #company-city').find('option:selected').text();
	var district=$('#location-bucket #company-town').find('option:selected').text();
	var zipcode = $('#location-bucket input[name="code"]').val();
	var uid=GetQueryString('uid');
	var maxCapital = $('#registered_capital_max').val()?($('#registered_capital_max').val() * 10000):"";
	var minCapital = $('#registered_capital_min').val()?($('#registered_capital_min').val() * 10000):"";
	var locationType = $("select[name='lRgn']").val();
	var status = $('#company-business-bucket #company-status').val();
	var type = $('#company-business-bucket select[name="company-type"]').val();
	var department = $('#company-mate-bucket select[name="hiring-department"]').val();
	var position = $('#company-mate-bucket select[name="hiring-position"]').val();
	var keyWord = $('#certified_product').val();

	//在查询页上方显示查询条件
	$(".search-range-result").html($('.company-bucket .search_range').find('option:selected').text());
	$(".search-location").html($("select[name='lRgn']").find('option:selected').text());
	$(".search-register-address").html(province + "-" + city + "-" + district);
	$(".search-code").html(zipcode);
	$(".search-employee-range").html($('#org_size_min').val() + "~" + $('#org_size_max').val() + "人");
	$(".search-capital").html(minCapital + "~" + maxCapital + "万");
	$(".search-industry").html($('#company-industry-belong').val());
	$(".search-status").html(status);
	$(".search-type").html(type);
	$(".search-department").html(department);
	$(".search-position").html(position);
	$(".search-certified").html(keyWord);

	if(province=='北京'||province=='上海'
		||province=='重庆'||province=='天津'||province=='请选择'||province=='全部'){
		province='';
	}
	if(city=='请选择'||city=='全部'){
		city='';
	}
	if(district=='请选择'||district=='全部'){
		district='';
	}

	var queryCondition='{"org_reg_type_str":"'+type
			+'","org_status_str":"'+status
			+'","org_reg_address":"'+""
			+'","province":"'+province
			+'","city":"'+city
			+'","district":"'+district
			+'","zipcode":"'+zipcode
			+'","job_position_type_str":"'+position
			+'","org_size_min":"'+$('#org_size_min').val()
			+'","org_size_max":"'+$('#org_size_max').val()
			+'","registered_capital_min":"'+minCapital
			+'","registered_capital_max":"'+maxCapital
			+'","industry_class_str":"'+$('#company-industry-belong').val()
			+'","certified_product":"'+keyWord
			+'","person_page_num":"'+page
			+'","org_page_num":"'+0
			+'","org_group_id":"'+org_group_id
			+'","org_group_type":"'+org_group_type
			+'","org_department_str":"'+department
			+'"}';

	queryCondition=queryCondition.replace(/undefined/g,"").replace(/null/g, "");

	return queryCondition;
}

function GetQueryString(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
   var r = window.location.search.substr(1).match(reg);
   if (r!=null) return (r[2]); return null;
}

/* 正则检查字符 */
function isInputRight(obj) {
    var reg= /^[0-9][0-9]{5}$/
    if (!reg.test(obj)) {
        return false;
    } else {
        return true;
    }
}