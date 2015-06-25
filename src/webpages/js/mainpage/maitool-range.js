
jQuery(document).ready(function(){
	var uid = getUrlParam("uid");
	//获取系统默认群组
// 	$.ajax({
// 		url : "/ekb/sys/groups",
// 		type : "GET",
// 		success : function(data){
// 			data=JSON.parse(data).data
// 			$('.home_maitool_public').text(data.groups.length);
// 			if(data.groups.length>0){
// //				$('#maitool-public-range').append('<button style="text-align: left;float:left" groupid="'+0+'" class="btn btn-default btn-lg btn-block">'+'默认企业库'+'</button>');
// 				for(var i=0;i<data.groups.length;i++){
// 					$('#maitool-public-range').append('<button style="text-align: left;float:left" groupid="'+data.groups[i].groupId+'" class="btn btn-default btn-lg btn-block">'+data.groups[i].groupName+'</button>');
					
// 					$('#maitool-public-range button').click(function setMaitoolTextAndInfo(){
// 						jQuery('#maitool-selected-advance-company').text(":"+$(this).text());
// 						jQuery('#maitool-selected-advance-company').attr('groupid',$(this).attr('groupId'));
// 						jQuery('#maitool-range-choose').text(":"+$(this).text());
// 						jQuery('#maitool-range-choose').attr('groupid',$(this).attr('groupId'));
// 						$('#close-maitool-choose').trigger('click');
// 						group_id=$(this).attr('groupId');
// 						group_type="1";
// 						refreshAdvanceSearchData();
// 					});
// 					$('#public-maitool-range-table tbody').append('<tr><td class="name" groupid="'+data.groups[i].groupId+'"><a href="#">'+data.groups[i].groupName+'</a></td><td>'+data.groups[i].groupDesc+'</td><td></td></tr>');
// 				}
// 			}
// 		}	
// 	});
	//智能查询查询条件收起与展开
	$("#buildlist_form").on("click",".widgetBoxHeader",function(e){
		e.preventDefault();

		var $ele = $(this);

		if ($ele.hasClass("center-content-expanded")) {
			$ele.removeClass("center-content-expanded");
			$ele.addClass("center-content-hidden");
			$ele.parent().find(".innerWidgetBox").css("display","none");
		} else if ($ele.hasClass("center-content-hidden")) {
			$ele.removeClass("center-content-hidden");
			$ele.addClass("center-content-expanded");
			$ele.parent().find(".innerWidgetBox").css("display","block");
		}
	});

	//获取用户自定义群组
	// $.ajax({
	// 	url : "ekb/user/"+getUrlParam('uid')+"/groups",
	// 	type : "GET",
	// 	success : function(data){
	// 		data=JSON.parse(data).data
			var UserGroupMan = new UserGroupListModel().init(uid); 
// 			$('.home_maitool_custom').text(data.groups.length);
// 			if(data.groups.length>0){
// //				$('#maitool-range-choose').text(":"+data.groups[0].groupName);
// //				$('#maitool-range-choose').attr('title',data.groups[0].groupDesc+'('+$('#maitool-range-choose').attr('title')+')');
// //				$('#maitool-range-choose').attr('groupId',data.groups[0].groupId);
// 				for(var i=0;i<data.groups.length;i++){
// 					$('#maitool-user-range').append('<button type="button" style="text-align: left;float:left" '+'groupid="'+data.groups[i].groupId+'"'+' class="btn btn-default btn-lg btn-block">'+data.groups[i].groupName+'</button>');
// 					$('#custom-maitool-range-table tbody').append('<tr><td class="name" groupid="'+data.groups[i].groupId+'"><a href="#">'+data.groups[i].groupName+'</a></td><td>'+data.groups[i].groupDesc+'</td><td></td><td><button class="btn btn-danger"  style="float:right;margin-right:10px" name="delete-custom-maitool-group" groupid="'+data.groups[i].groupId+'">删除</button></td></tr>');
// 				}
// 			}
// 			$('#maitool-range-info').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#maitool-range-info-advance-company').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#maitool-range-choose-advance-company').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#mainpage-maitool-info').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#mainpage-focus-info').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#maitool-range-choose').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			//导出按钮提示
// 			$('#export_table').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#export_table_people').poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$(".j_export_wrap").poshytip({
// 				className: 'tip-violet',
// 				bgImageFrameSize: 9
// 			});
// 			$('#maitool-user-range button').click(function setMaitoolTextAndInfo(){
// 				$('#close-maitool-choose').trigger('click');
// 				jQuery('#maitool-selected-advance-company').text(":"+$(this).text());
// 				jQuery('#maitool-selected-advance-company').attr('groupid',$(this).attr('groupId'));
// 				jQuery('#maitool-range-choose').text(":"+$(this).text());
// 				jQuery('#maitool-range-choose').attr('groupid',$(this).attr('groupId'));
// 				group_id=$(this).attr('groupId');
// 				group_type="2";
// 				refreshAdvanceSearchData();
// 			});
			
	// 	}
	// });
	//获取公共企业库
	var CommonGroupListMan = new CommonGroupListModel().init();
	$('#public-maitool-range-table tbody ').on('click','.name',function(){
		var nameMaitool=$(this).text();
		//获取群组企业
		$.ajax({
			url : "/ekb/sysgroup/"+$(this).attr('groupid')+"/companies?pageNum=1",
			type : "GET",
			success : function(data){
				data=JSON.parse(data).data;
				$('#public-maitool-range-title').html("<a id='public-maitool-range-table-back' href='#'>公共企业库列表</a>&nbsp;&nbsp;→&nbsp;&nbsp;"+nameMaitool);
				$('#public-maitool-range-table').hide();
				$('#public-maitool-range-table-companies tbody tr').remove().show();
				$('#public-maitool-range-table-companies').show();
				
				$('#public-maitool-range-table-back').click(function(){
					$('#public-maitool-range-title').html("公共企业库列表");
					$('#public-maitool-range-table').show();
					$('#public-maitool-range-table-companies tbody tr').remove().show();
					$('#public-maitool-range-table-companies').hide();
				});
				if(data.companies.length>0){
					for(var i=0;i<data.companies.length;i++){
						$('#public-maitool-range-table-companies tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
								+data.companies[i].companyName+'</td><td class=" ">'
								+data.companies[i].inChargePerson+'</td><td class=" ">'
								+data.companies[i].province+data.companies[i].city+'</td><td class=" ">'
								+data.companies[i].address+'</td><td class=" ">'
								+data.companies[i].orgStatus+'</td><td class=" ">'
								+data.companies[i].licenseNum+'</td><td class=" ">'
								+data.companies[i].regType+'</td><td class=" ">'
								+data.companies[i].revenue+'</td><td class=" ">'
								+data.companies[i].numberOfEmployees+'</td></tr>');
					}
				}
			}
		
		});
	});
	$('#custom-maitool-range-table tbody ').on('click','.name',function(){
		var nameMaitool=$(this).text();
		//获取用户群组企业
		$.ajax({
			url : "/ekb/group/"+$(this).attr('groupid')+"/companies?pageNum=1",
			type : "GET",
			success : function(data){
				data=JSON.parse(data).data;
				$('#custom-maitool-range-title').html("<a id='custom-maitool-range-table-back' href='#'>自定义企业库列表</a>&nbsp;&nbsp;→&nbsp;&nbsp;"+nameMaitool);
				$('#custom-maitool-range-table').hide();
				$('#custom-maitool-range-table-companies tbody tr').remove().show();
				$('#custom-maitool-range-table-companies').show();
				
				$('#custom-maitool-range-table-back').click(function(){
					$('#custom-maitool-range-title').html('自定义企业库列表<a id="custom-maitool-range-title-add"  data-toggle="popover"  data-placement="bottom" title="请填写自定义企业库信息" data-content="<div style=\'width:220px\'>输入名称: <input id=\'custom-maitool-name-add\'></input></div><br><div style=\'width:220px\'>输入描述: <input id=\'custom-maitool-description-add\'></input></div><br><div><button class=\'btn btn-default\'  style=\'float:right;margin-right:px\' id=\'custom-maitool-cancel-add\' onclick=\'javascript:hideAddMaitool();\'>取消</button><button class=\'btn btn-danger\' style=\'float:right;margin-right:15px\' onclick=\'javascript:addMaitool();\'>创建</button></div>" href="#" style="float:right"><i class="fa fa-plus-circle"></i>添加企业库</a><script>$(function () { $("#custom-maitool-range-title-add").popover({html : true });});</script>');
					$('#custom-maitool-range-table').show();
					$('#custom-maitool-range-table-companies tbody tr').remove().show();
					$('#custom-maitool-range-table-companies').hide();
				});
				if(data.companies.length>0){
					for(var i=0;i<data.companies.length;i++){
						$('#custom-maitool-range-table-companies tbody').append('<tr rowspan="1" colspan="1" style="width: 1px;" class="odd"><td class=" ">'
								+data.companies[i].companyName+'</td><td class=" ">'
								+data.companies[i].inChargePerson+'</td><td class=" ">'
								+data.companies[i].province+data.companies[i].city+'</td><td class=" ">'
								+data.companies[i].address+'</td><td class=" ">'
								+data.companies[i].orgStatus+'</td><td class=" ">'
								+data.companies[i].licenseNum+'</td><td class=" ">'
								+data.companies[i].regType+'</td><td class=" ">'
								+data.companies[i].revenue+'</td><td class=" ">'
								+data.companies[i].numberOfEmployees+'</td></tr>');
					}
				}
			}
		
		});
	});
	

	$('#maitool-public-tab').click(function(){
		$('#public-maitool-range-title').parent().show();
		$('#custom-maitool-range-title').parent().hide();
	});
	$('#maitool-custom-tab').click(function(){
		$('#public-maitool-range-title').parent().hide();
		$('#custom-maitool-range-title').parent().show();
	});
	//将企业添加至脉拓圈
	$('#advancesearch-companyDataSet').on('click','button[name="add-maitool-company-advance-search"]',function(){
		if($(this).text()=='已选择'){
			$(this).html('<i class="fa fa-plus-circle"></i>&nbsp;&nbsp;企业库');
			$(this).removeClass('btn-danger');
			$(this).addClass('btn-default');
		}else{
			$(this).text('已选择');
			$(this).addClass('btn-danger');
			$(this).removeClass('btn-default');

		}
		
	});
	//选择全部企业
	$('#close-maitool-choose-all').click(function(){
		jQuery('#maitool-selected-advance-company').text(":"+$(this).text());
		jQuery('#maitool-selected-advance-company').attr('groupid',$(this).attr('groupId'));
		jQuery('#maitool-range-choose').text(":"+$(this).text());
		jQuery('#maitool-range-choose').attr('groupid',$(this).attr('groupId'));
		$('#close-maitool-choose').trigger('click');
		group_id="";
		group_type="0";
		refreshAdvanceSearchData();
	});
	$('#custom-maitool-range-table tbody').on('click','button[name="delete-custom-maitool-group"]',function(){
		var node=$(this).parent().parent();
		swal({
			title : "确认删除名称为： '"+node.find('a:eq(0)').text()+"'  的企业库么？",
			text : "",
			type : "warning",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			 confirmButtonText : "是的,删除!",
			cancelButtonText : "取消",
			closeOnConfirm : true,
			closeOnCancel : true
		}, function(isConfirm) {
			if(isConfirm){
				swal('删除中...');
				$.ajax({
					url : "/ekb/user/"+getUrlParam('uid')+"/groups/"+node.find('td:eq(0)').attr('groupid')+"",
					type : "DELETE",
					success : function(data){
						data=JSON.parse(data).data;
						swal('删除成功！');
						node.remove();
					}
				
				});
				$(this).parent().parent().remove();
				$('#maitool-user-range button[groupid="'+node.find('td:eq(0)').attr('groupid')+'"]').remove();
			}
		});
	});
	$('#maitool-public-tab').trigger('click');
	function getUrlParam(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r!=null) 
			return unescape(r[2]);
		return null; //返回参数值
	}
});
//添加企业库
function addMaitool(){
	var name=$('#custom-maitool-name-add').val();
	var description=$('#custom-maitool-description-add').val();
	var data = {
            "groupName": name,
            "groupDesc": description
        };
	jQuery.ajax({
		url : "/ekb/user/"+getUrlParam('uid')+"/groups",
		type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
		success : function(data){
			//获取用户自定义群组
			$.ajax({
				url : "ekb/user/"+getUrlParam('uid')+"/groups",
				type : "GET",
				success : function(data){
					data=JSON.parse(data).data
					if(data.groups.length>0){
//						$('#maitool-range-choose').text(":"+data.groups[0].groupName);
//						$('#maitool-range-choose').attr('title',data.groups[0].groupDesc+'('+$('#maitool-range-choose').attr('title')+')');
//						$('#maitool-range-choose').attr('groupId',data.groups[0].groupId);
						$('#maitool-user-range button').remove();
						$('#custom-maitool-range-table tbody tr').remove();
						for(var i=0;i<data.groups.length;i++){
							$('#maitool-user-range').append('<button type="button"  style="text-align: left;float:left" '+'groupid="'+data.groups[i].groupId+'"'+' class="btn btn-default btn-lg btn-block">'+data.groups[i].groupName+'</button>');
							$('#custom-maitool-range-table tbody').append('<tr><td class="name" groupid="'+data.groups[i].groupId+'"><a href="#">'+data.groups[i].groupName+'</a></td><td>'+data.groups[i].groupDesc+'</td><td></td><td><button class="btn btn-danger" style="float:right;margin-right:10px"  name="delete-custom-maitool-group" groupid="'+data.groups[i].groupId+'">删除</button></td></tr>');
						}
					}
				}
			});
			swal('添加成功~');
		}
	});

	$('#custom-maitool-range-title-add').popover('hide');
}
function hideAddMaitool(){
	$('#custom-maitool-range-title-add').popover('hide');
}
function refreshAdvanceSearchData(){
	var industryCompanyBelong=$('#company-industry-belong');
	var companyIdentifier=$('#certified_product');
	var companyType=$('#company-type');
	var companyStatus=$("#company-status");
	//获取行业下拉
	$.ajax({
		url : '/ekb/industries?q={"page_num":"1","org_group_id":"'+group_id+'","org_group_type":"'+group_type+'"}',
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			industryCompanyBelong.find('option').remove();
			// industryCompanyBelong.append('<option value="">请选择</option>');
			industryCompanyBelong.append('<option value="">全部</option>');
			for(var index=0;index<data.industries.length;index++){
				industryCompanyBelong.append('<option value="'+data.industries[index]+'">'+data.industries[index]+'</option>');
			}
			// industryCompanyBelong.append('<option value="9999">更多...</option>');
			industryCompanyBelong.unbind();
			industryCompanyBelong.change(function(){
				if($(this).val()==9999){
					addMoreIndustryCompanyBelong(2);
				}
			});
		}
	});
	//获取资质
	$.ajax({
		url : '/ekb/certifiedproduct?q={"page_num":"1","org_group_id":"'+group_id+'","org_group_type":"'+group_type+'"}',
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyIdentifier.find('option').remove();
			// companyIdentifier.append('<option value="">请选择</option>');
			companyIdentifier.append('<option value="">全部</option>');
			for(var index=0;index<data.certifications.length;index++){
				companyIdentifier.append('<option value="'+data.certifications[index]+'">'+data.certifications[index]+'</option>');
			}
			// companyIdentifier.append('<option value="9999">更多...</option>');
			companyIdentifier.unbind();
			companyIdentifier.change(function(){
				if($(this).val()==9999){
					addMoreCompanyIdentifier(2);
				}
			});
		}
	});
	//综合查询页获取公司类型org_type
	$.ajax({
		url : "/ekb/orgtypes?q={\"page_num\":\"1\",\"org_group_id\":\""+group_id+"\",\"org_group_type\":\""+group_type+"\"}",
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyType.find('option').remove();
			// companyType.append('<option value="">请选择</option>');
			companyType.append('<option value="">全部</option>');
			for(var index=0;index<data.orgtypes.length;index++){
				companyType.append('<option type_id="'+data.orgtypes[index]+'" value="'+data.orgtypes[index]+'">'+data.orgtypes[index]+'</option>');
			}
			// companyType.append('<option value="9999">更多...</option>');
			companyType.unbind();
			companyType.change(function(){
				if($(this).val()==9999){
					addMoreCompanyType(2);
				}
			});
		}
	});
	//综合查询页获取公司状态列表
	$.ajax({
		url : "/ekb/orgstatuses?q={\"page_num\":\"1\",\"org_group_id\":\""+group_id+"\",\"org_group_type\":\""+group_type+"\"}",
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyStatus.find('option').remove();
			// companyStatus.append('<option value="">请选择</option>');
			companyStatus.append('<option value="">全部</option>');
			for(var index=0;index<data.statuses.length;index++){
				companyStatus.append('<option value="'+data.statuses[index]+'">'+data.statuses[index]+'</option>');
			}
			// companyStatus.append('<option value="9999">更多...</option>');
			companyStatus.unbind();
			companyStatus.change(function(){
				if($(this).val()==9999){
					addMoreCompanyStatus(2);
				}
			});
		}
	});
}
function addMoreIndustryCompanyBelong(pageNum){
	var industryCompanyBelong=$('#company-industry-belong');
	var companyIdentifier=$('#certified_product');
	//获取行业下拉
	$.ajax({
		url : '/ekb/industries?q={"page_num":"'+pageNum+'","org_group_id":"'+group_id+'","org_group_type":"'+group_type+'"}',
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			industryCompanyBelong.find('option:last').remove();
			for(var index=0;index<data.industries.length;index++){
				industryCompanyBelong.append('<option value="'+data.industries[index].industryId+'">'+data.industries[index].industryName+'</option>');
			}
			// industryCompanyBelong.append('<option  value="9999">更多...</option>');
			industryCompanyBelong.unbind();
			industryCompanyBelong.change(function(){
				if($(this).val()==9999){
					addMoreIndustryCompanyBelong(pageNum+1);
				}
			});
		}
	});
}
function addMoreCompanyIdentifier(pageNum){
	var industryCompanyBelong=$('#company-industry-belong');
	var companyIdentifier=$('#certified_product');
	//获取资质
	$.ajax({
		url : '/ekb/certifiedproduct?q={"page_num":"'+pageNum+'","org_group_id":"'+group_id+'","org_group_type":"'+group_type+'"}',
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyIdentifier.find('option:last').remove();
			for(var index=0;index<data.certifications.length;index++){
				companyIdentifier.append('<option value="'+data.certifications[index]+'">'+data.certifications[index]+'</option>');
			}
			// companyIdentifier.append('<option value="9999">更多...</option>');
			companyIdentifier.unbind();
			companyIdentifier.change(function(){
				if($(this).val()==9999){
					addMoreCompanyIdentifier(pageNum+1);
				}
			});
		}
	});
}
function addMoreCompanyType(pageNum){
	var companyType=$('#company-type');
	//综合查询页获取公司类型org_type
	$.ajax({
		url : "/ekb/orgtypes?q={\"page_num\":\""+pageNum+"\",\"org_group_id\":\""+group_id+"\",\"org_group_type\":\""+group_type+"\"}",
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyType.find('option:last').remove();
			for(var index=0;index<data.orgtypes.length;index++){
				companyType.append('<option type_id="'+data.orgtypes[index].typeId+'" value="'+data.orgtypes[index].typeId+'">'+data.orgtypes[index].orgType+'</option>');
			}
			// companyType.append('<option value="9999">更多...</option>');
			companyType.unbind();
			companyType.change(function(){
				if($(this).val()==9999){
					addMoreCompanyType(pageNum+1);
				}
			});
		}
	});
}
function addMoreCompanyStatus(pageNum){
	var companyStatus=$("#company-status");
	//综合查询页获取公司状态列表
	$.ajax({
		url : "/ekb/orgstatuses?q={\"page_num\":\""+pageNum+"\",\"org_group_id\":\""+group_id+"\",\"org_group_type\":\""+group_type+"\"}",
		type : "GET",
		success : function(data){
			data=JSON.parse(data).data;
			var count=data.count;
			companyStatus.find('option:last').remove();
			for(var index=0;index<data.statuses.length;index++){
				companyStatus.append('<option value="'+data.statuses[index].status_id+'">'+data.statuses[index].status+'</option>');
			}
			// companyStatus.append('<option value="9999">更多...</option>');
			companyStatus.unbind();
			companyStatus.change(function(){
				if($(this).val()==9999){
					addMoreCompanyStatus(pageNum+1);
				}
			});
		}
	});
}

var UserGroupListModel = function(){
	var uid;

	var UserGroupList = Backbone.Model.extend({  
		urlRoot: function(){
			return "/ekb/user/"+uid+"/groups";
		}
	});
	
	var UserGroupListCollection =  Backbone.Collection.extend({ 
		model: UserGroupList,
		url: function(){
			return "/ekb/user/"+uid+"/groups";
		},
		parse : function(response){
			return response.data.groups;
		}
	})
	
	var UserGroupListItemView = Backbone.View.extend({
		tagName: 'option', 
		tagClass: 'border',
		template: _.template($('#user-group-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.attr("value",this.model.get("groupId"));
	        this.$el.attr("lib-type",2);
	        
	        return this;
	    }
	});
	
	var UserGroupListView =  Backbone.View.extend({
		el: $('#search_main .search_range .user-define-group'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model) {
    			var itemview = new UserGroupListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	UserGroupListModel.prototype.init = function(id){ 
		uid = id;

    	var list = new UserGroupListCollection();
    	var listView = new UserGroupListView({
    	        collection: list   	        
    	});
    	list.fetch({reset:true});
	}
}

var CommonGroupListModel = function(){
	var CommonGroupList = Backbone.Model.extend({  
		urlRoot: function(){
			return "/ekb/sys/groups";
		}
	});
	
	var CommonGroupListCollection =  Backbone.Collection.extend({ 
		model: CommonGroupList,
		url: function(){
			return "/ekb/sys/groups";
		},
		parse : function(response){
			return response.data.groups;
		}
	})
	
	var CommonGroupListItemView = Backbone.View.extend({
		tagName: 'option', 
		tagClass: 'border',
		template: _.template($('#common-group-template').html()),
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.attr("value",this.model.get("groupId"));
	        this.$el.attr("lib-type",1);
	        
	        return this;
	    }
	});
	
	var CommonGroupListView =  Backbone.View.extend({
		el: $('#search_main .search_range .common-company-group'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();

	    	this.collection.each( function($model) {
    			var itemview = new CommonGroupListItemView({model : $model}); 		            
	            this.$el.append(itemview.render().el);  
        	}, this);
	    	
	        return this;
	    }
	});
	
	CommonGroupListModel.prototype.init = function(){ 
    	var list = new CommonGroupListCollection();
    	var listView = new CommonGroupListView({
    	        collection: list   	        
    	});
    	list.fetch({reset:true});
	}
}