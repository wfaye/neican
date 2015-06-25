$(function(){
	var uid = null;
	
	uid = getUrlParam("uid");
	
	var workHistoryMan = new WorkHistoryModel().init(uid);
	var educationHistoryMan = new EducationHistoryModel().init(uid);
	
	var profile = function(){
		/* 请求url */
		var profileUrl = "/ekb/auth/baseInfo/";
		var getPositionUrl = "/ekb/jobPositionList/";
		var getDepartment = "/ekb/departmentList";
		var workHistoryUrl = "/ekb/auth/workhistory/";
		var eduHistoryUrl = "/ekb/auth/edu/";
		var getDegree = "/ekb/degreeList";
		var getSchoolName = "/ekb/school/autocomplete";
			
		/* 页面元素  */
		/* 概况 */
		var $name = $("input[name='name']");
		var $gender = $("input[name='gender']");
		var $birthday = $("input[name='birthday']");
		var $department = $("select[name='department']");
		var $address = $("input[name='address']");
		var $personalPhone = $("input[name='personalPhone']");
		var $personalEmail = $("input[name='personalEmail']");
		var $workPhone = $("input[name='workPhone']");
		var $workEmail = $("input[name='workEmail']");
		var $fax = $("input[name='fax']");
		var $curOrg = $("input[name='curOrg']");
		var $curDep = $("input[name='curDep']");
		var $curTitle = $("input[name='curTitle']");
		/* 工作经历 */
		var $companyName = $("input[name='companyName']");
		var $department = $("select[name='department']");
		var $title = $("select[name='title']");
		var $workStartDate = $("input[name='workStartDate']");
		var $workEndDate = $("input[name='workEndDate']");
		var $workForm = $("#PrevEmploymentForm");
		var $work_err_msg = $(".work_err_msg");
		/* 用户信息 */
		var $userIdentifier = $("input[name='userIdentifier']");
		var $password = $("input[name='password']");
		/* 教育经历 */
		var $schoolName = $("input[name='schoolName']");
		var $degree = $("select[name='degree']");
		var $schoolStartDate = $("input[name='schoolStartDate']");
		var $schoolEndDate = $("input[name='schoolEndDate']");
		var $education_err_msg = $(".education_err_msg");
		
		/* 状态值 */
		var workHistoryStatus = 0;
		var eduHistoryStatus = 0;
		
		/* 相关数据 */
		var profileData = 
		{
			"data": 
				{
					"accountInfo": 
					{
						"password": "", 
						"accountId": ""
					}, 
					"contactInfo": 
					{
						"fax": "", 
						"name": "", 
						"officeEmail": "", 
						"gender": "", 
						"mobilePhone": "",
						"birthday": "", 
						"personalEmail": "", 
						"address": "",
						"officePhone": ""
					}
				}
		};
		var workHistoryData = {
			"orgName" : null,
			"department" : null,
			"title" : null,
			"workStartDate" : null,
			"workEndDate" : null
		};
		var position = null;
		var department = null;
		var departmentId = null;
		var contactInfo = null;
		var degree = null;
		
			
		/**
		 * 得到个人信息
		 */
		var _getProfile = function(){			
			$.get(profileUrl+uid,function(res){
				contactInfo = res.data.contactInfo;
				accountInfo = res.data.accountInfo;
				profileData.data.accountInfo = res.data.accountInfo;
				profileData.data.contactInfo.mobilePhone = res.data.contactInfo.mobilePhone?res.data.contactInfo.mobilePhone:profileData.data.contactInfo.mobilePhone;
				profileData.data.contactInfo.personalEmail = res.data.contactInfo.personalEmail?res.data.contactInfo.personalEmail:profileData.data.contactInfo.personalEmail;
				profileData.data.contactInfo.officePhone = res.data.contactInfo.officePhone?res.data.contactInfo.officePhone:profileData.data.contactInfo.officePhone;
				profileData.data.contactInfo.officeEmail = res.data.contactInfo.officeEmail?res.data.contactInfo.officeEmail:profileData.data.contactInfo.officeEmail;
				profileData.data.contactInfo.address = res.data.contactInfo.address?res.data.contactInfo.address:profileData.data.contactInfo.address;
				if(res.no === 0){
					$name.val(contactInfo.name);
					$fax.val(contactInfo.fax);
					$gender.each(function(){
						if ($(this).val() == contactInfo.gender) {
							$(this).attr("checked","checked");
						}
					});
					user_name = contactInfo.name ? contactInfo.name : contactInfo.personalEmail;
					$birthday.val(contactInfo.birthday);
					$address.val(contactInfo.address && contactInfo.address.address);
					$personalPhone.val(contactInfo.mobilePhone && contactInfo.mobilePhone.phoneNum);
					$personalEmail.val(contactInfo.personalEmail && contactInfo.personalEmail.email);
					$workEmail.val(contactInfo.officeEmail && contactInfo.officeEmail.email);
					$workPhone.val(contactInfo.officePhone && contactInfo.officePhone.phoneNum);
					$curOrg.val(contactInfo.currentWorkInfo && contactInfo.currentWorkInfo.orgName);
					$curDep.val(contactInfo.currentWorkInfo && contactInfo.currentWorkInfo.department);
					$curTitle.val(contactInfo.currentWorkInfo && contactInfo.currentWorkInfo.jobPosition);
					
					if(accountInfo){
						$userIdentifier.val(accountInfo.accountId);
						$password.val(accountInfo.password);
					}else{
					}
				}else{
					alert(res.errMsg);
				}
			},"json");
			
			/* 获取行业部门列表 */
			$.get(getDepartment,function(res){
				if(res.no === 0){
					$.each(res.data.departments,function(index,item){
						department = "<option value="+item.id+">"+item.deptName+"</option>";
						$department.append(department);
					});
					_getPositions();
				}else{
					alert(res.errMsg);
				}
			},"json");
			
			/* 获取学历列表 */
			$.get(getDegree,function(res){
				if(res.no === 0){
					$.each(res.data.degrees,function(index,item){
						degree = "<option value="+item.id+">"+item.degreeName+"</option>";
						$degree.append(degree);
					});
				}else{
					alert(res.errMsg);
				}
			},"json");
			
			/* 选择行业 */
			$department.change(function(){
				_getPositions();
			});
		};
		_getProfile();
		
		
		/**
		 * 提交个人信息
		 */
		$(".box").on("click",".j_primary_button_flat",function(e){
			e.preventDefault();
			
			var postData = _getProfileData(profileData);
			
			if(postData){
				$.ajax({
					url : profileUrl+uid,
					type : "POST",
					data : postData,
					dataType : "JSON",
					contentType : "application/json",
					success : function(res){
						if(res.no === 0){
							alert("保存成功~");
						}else{
							alert("出错啦~");
						}
					}
				});
			}
		});
		
		/**
		 * 添加工作经历
		 */
		$("#addWorkHistory").on("click",function(e){
			e.preventDefault();
			
			var postData = _getWorkData();
			
//			$("form[name='userEmploymentForm']").validate({
//	            remote: {  
//	                url: "/ekb/auth/simpleInfo/",     //后台处理程序  
//	                type: "post",               //数据发送方式  
//	                dataType: "json",           //接受数据格式     
//	                data: postData                    //要传递的数据  
//	            }  
//		    });

			
//			$("form[name='userEmploymentForm']").validate({     
//				 submitHandler: function(form) 
//				   {   console.log(111);   
//					 $.ajax({
//							url : profileUrl+uid,
//							type : "POST",
//							data : postData,
//							dataType : "JSON",
//							contentType : "application/json",
//							success : function(res){
//								if(res.no === 0){
//									var workHistoryMan = new WorkHistoryModel().init(1);
//								}else{
//									alert("出错啦~");
//								}
//							}
//						});   
//				   }  
//			});
			
			if(postData){
				$.ajax({
					url : workHistoryUrl+uid,
					type : "POST",
					data : postData,
					dataType : "JSON",
					contentType : "application/json",
					success : function(res){
						if(res.no === 0){
							alert("添加成功~");
							var workHistoryMan = new WorkHistoryModel().init(uid);
						}else{
							alert("出错啦~");
						}
					}
				});
			}
		});
		
		/**
		 * 添加教育经历
		 */
		$("#addEducationHistory").on("click",function(e){
			e.preventDefault();
			
			var postData = _getEducationData();
			
			if(postData){
				$.ajax({
					url : eduHistoryUrl+uid,
					type : "POST",
					data : postData,
					dataType : "JSON",
					contentType : "application/json",
					success : function(res){
						if(res.no === 0){
							alert("添加成功~");
							var eduHistoryMan = new EducationHistoryModel().init(uid);
						}else{
							alert("出错啦~");
						}
					}
				});
			}
		});
		
		/**
		 * 验证个人信息数据
		 */
		function _getProfileData(data){
			var postData = data;
			
			if(!$name.val()){
				alert("请填写您的名称");
			}else{
				postData.data.contactInfo.name = $name.val();
				postData.data.contactInfo.gender = $("input[name='gender']:checked").val();
				postData.data.contactInfo.birthday = $birthday.val();
				
				if ($fax.val()) {
					if (postData.data.contactInfo.fax) {
						postData.data.contactInfo.fax.phoneNum = $fax.val();
					} else {
						postData.data.contactInfo.fax = {};
						postData.data.contactInfo.fax.phoneNum = $fax.val();
						postData.data.contactInfo.fax.phoneId = "";
						postData.data.contactInfo.fax.isLogon = false;
					}
				} else {
					postData.data.contactInfo.address = "";
				}
				if ($address.val()) {
					if (postData.data.contactInfo.address) {
						postData.data.contactInfo.address.address = $address.val();
					} else {
						postData.data.contactInfo.address = {};
						postData.data.contactInfo.address.address = $address.val();
						postData.data.contactInfo.address.addressId = "";
					}
				} else {
					postData.data.contactInfo.address = "";
				}
				if ($personalPhone.val()) {
					if (postData.data.contactInfo.mobilePhone) {
						postData.data.contactInfo.mobilePhone.phoneNum = $personalPhone.val();
					} else {
						postData.data.contactInfo.mobilePhone = {};
						postData.data.contactInfo.mobilePhone.phoneNum = $personalPhone.val();
						postData.data.contactInfo.mobilePhone.phoneId = "";
						postData.data.contactInfo.mobilePhone.isLogon = false;
					}
				} else {
					postData.data.contactInfo.mobilePhone = "";
				}
				if ($personalEmail.val()) {
					if (postData.data.contactInfo.personalEmail) {
						postData.data.contactInfo.personalEmail.email = $personalEmail.val();
					} else {
						postData.data.contactInfo.personalEmail = {};
						postData.data.contactInfo.personalEmail.email = $personalEmail.val();
						postData.data.contactInfo.personalEmail.emailId = "";
						postData.data.contactInfo.personalEmail.isLogon = false;
					}
				} else {
					postData.data.contactInfo.personalEmail = "";
				}
				if ($workPhone.val()) {
					if (postData.data.contactInfo.officePhone) {
						postData.data.contactInfo.officePhone.phoneNum = $workPhone.val();
					} else {
						postData.data.contactInfo.officePhone = {};
						postData.data.contactInfo.officePhone.phoneNum = $workPhone.val();
						postData.data.contactInfo.officePhone.phoneId = "";
						postData.data.contactInfo.officePhone.isLogon = false;
					}
				} else {
					postData.data.contactInfo.officePhone = "";
				}
				if ($workEmail.val()) {
					if (postData.data.contactInfo.officeEmail) {
						postData.data.contactInfo.officeEmail.email = $workEmail.val();
					} else {
						postData.data.contactInfo.officeEmail = {};
						postData.data.contactInfo.officeEmail.email = $workEmail.val();
						postData.data.contactInfo.officeEmail.emailId = "";
						postData.data.contactInfo.officeEmail.isLogon = false;
					}
				} else {
					postData.data.contactInfo.officeEmail = "";
				}
				
				postData = JSON.stringify(postData);
				
				return postData;
			}
			
			return null;
		}
		
		/**
		 * 验证工作经历提交数据
		 */
		function _getWorkData(){
			var postData = null;
			
			var companyName = $companyName.val();
			var department = $department.find("option:selected").attr("value");
			var title = $title.find("option:selected").attr("value");
			var workStartDate = $workStartDate.val();
			var workEndDate = $workEndDate.val();
			
			if (!companyName) {
				$work_err_msg.html("*请填写任职公司名称~");
			} else if (!workStartDate) {
				$work_err_msg.html("*请填写任职开始时间~");
			} else if (!workEndDate) {
				$work_err_msg.html("*请填写任职结束时间~");
			} else if (workStartDate > workEndDate) {
				$work_err_msg.html("*任职开始时间不得晚于任职结束时间~");
			} else {
				$work_err_msg.html("");
				
				postData = {
					"data" : {
						"workInfo" : {
							"orgName" : $companyName.val(),
							"deptId" : $department.val(),
							"jobPositionId" : $title.val(),
							"startDate" : $workStartDate.val(),
							"endDate" : $workEndDate.val(),
							"isCurrent" : false
						}
					}
				};
				
				postData = JSON.stringify(postData);
				
				return postData;
			}
			
			return null;
		}
		
		/**
		 * 验证教育经历提交数据
		 */
		function _getEducationData(){
			var postData = null;
			
			var schoolId = $schoolName.attr("id");
			var degree = $degree.find("option:selected").attr("value");
			var schoolStartDate = $schoolStartDate.val();
			var schoolEndDate = $schoolEndDate.val();
			
			if (!schoolId) {
				$education_err_msg.html("*请填写学校名称~");
			} else if (!schoolStartDate) {
				$education_err_msg.html("*请填写开始时间~");
			} else if (!schoolEndDate) {
				$education_err_msg.html("*请填写结束时间~");
			} else if (schoolStartDate > schoolEndDate) {
				$education_err_msg.html("*开始时间不得晚于结束时间~");
			} else {
				$education_err_msg.html("");
				
				postData = {
					"data" : {
						"educationInfo" : {
							"startDate":schoolStartDate,
							"endDate":schoolEndDate,
							"schoolId":schoolId,
							"degreeId":degree
						}
					}
				};
				
				postData = JSON.stringify(postData);
				
				return postData;
			}
			
			return null;
		}
		
		/**
		 * 获取职位列表
		 */
		function _getPositions(){
			departmentId = $department.val();
			$title.empty();
			$.get(getPositionUrl+departmentId,function(res){
				if(res.no === 0){
					$.each(res.data.jobPositions,function(index,item){
						position = "<option value="+item.id+">"+item.jobPositionName+"</option>";
						$title.append(position);
					});
					
				}else{}
			},"json");
		}
		
		/**
		 * 获取学校名称
		 */
    	$("#schoolName").autocomplete({
    		  appendTo: "#schoolNameContainer",
    	      source: function( request, response) {
    	        $.ajax({
    	          url: getSchoolName,
    	          dataType: "json",
    	          data: {
    	        	 searchString: request.term
    	          },
    	          success: function( data ) {
    	            response($.map( data.data.schools, function( item ) {
                        return {
                        	schoolId: item.schoolId,
                            value: item.schoolName
                        }
                    }));
    	          }
    	        });
    	      },
    	      
    	      select: function( event, ui ) {
    	    	  $(this).attr("id",ui.item.schoolId);
    	      },
    	      open: function() {
    	        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    	      },
    	      close: function() {
    	        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    	      }
    	});
	};
	profile();
});

/**
 * URL
 */
var getWorkHistoryUrl = '/ekb/auth/workhistory/';
var getEducationHistoryUrl = '/ekb/auth/edu/';

/**
 * 工作经历模块
 */
var WorkHistoryModel = function(){
	var uid = 0;
	var historyCount = -1;
	
	var WorkHistory = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return getWorkHistoryUrl+uid;
		}
	});
	
	var WorkHistoryCollection =  Backbone.Collection.extend({ 
		model: WorkHistory,
		url: function(){
			return getWorkHistoryUrl+uid;
		},
		parse : function(models, xhr) {
		    if (xhr.status === 304) {
		    	console.log(this.models.slice());
		      return this.models.slice();
		    }
		    historyCount = models.data.count;

		    return models.data.jobPositions;
		  }
	});
	
	var WorkHistoryItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#workHistory-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.delete_opr = this.$(".deleteIcon");
		},
		events: {
		      "click .deleteIcon"   : "deleteWorkItem",
		},
		deleteWorkItem : function(event){    //点击开始修改
			$.ajax({
				url : "/ekb/auth/workhistory/"+this.model.get("workHistoryId"),
				type : "DELETE",
				dataType : "JSON",
				contentType : "application/json",
				success : function(res){
					if(res.no === 0){
						alert("删除成功~");
						var workHistoryMan = new WorkHistoryModel().init(uid);
					}else{
						alert("出错啦~");
					}
				}
			});
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("row");
	        this.$el.attr("name","0");
	        
	        return this;
	    }
	});
	
	var WorkHistoryListView =  Backbone.View.extend({
		el: $('#work_history_list'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model ) {
	            var itemview = new WorkHistoryItemView({model: $model}); 	
	            this.$el.append( itemview.render().el );
        	}, this);
	    	
	    	if (historyCount >= 5) {
	    		$("#addWorkHistory").addClass("disabled");
	    	} else {
	    		$("#addWorkHistory").removeClass("disabled");
	    	}
	    	
	        return this;
	    }
	});
	
	WorkHistoryModel.prototype.init = function(id){ 
		uid = id;
		
    	var myworkhistory = new WorkHistoryCollection();
    	var myworkhistoryListView = new WorkHistoryListView({
    	        collection: myworkhistory   	        
    	});
    	myworkhistory.fetch({reset:true});
	}
};

/**
 * 教育经历模块
 */
var EducationHistoryModel = function(){
	var uid = 0;
	var historyCount = -1;
	
	var EducationHistory = Backbone.Model.extend({  //对应server里的数据
		urlRoot: function(){
			return getEducationHistoryUrl+uid;
		}
	});
	
	var EducationHistoryCollection =  Backbone.Collection.extend({ 
		model: EducationHistory,
		url: function(){
			return getEducationHistoryUrl+uid;
		},
		parse : function(models, xhr) {
		    if (xhr.status === 304) {
		    	console.log(this.models.slice());
		      return this.models.slice();
		    }
		    historyCount = models.data.count;

		    return models.data.educations;
		  }
	});
	
	var EducationHistoryItemView = Backbone.View.extend({
		tagName: 'div', //每增加一个新数据增加一行
		tagClass: 'border',
		template: _.template($('#educationHistory-template').html()),  //生成template函数，还没涉及怎么画
		initialize:  function(){
	    	this.listenTo(this.model, 'destroy', this.collection);
	    	this.delete_opr = this.$(".deleteIcon");
		},
		events: {
		      "click .deleteIcon"   : "deleteWorkItem",
		},
		deleteWorkItem : function(event){    //点击开始修改
			$.ajax({
				url : "/ekb/auth/edu/"+this.model.get("eduId"),
				type : "DELETE",
				dataType : "JSON",
				contentType : "application/json",
				success : function(res){
					if(res.no === 0){
						alert("删除成功~");
						var educationHistoryMan = new EducationHistoryModel().init(uid);
					}else{
						alert("出错啦~");
					}
				}
			});
		},
	    render: function() {
	        this.$el.html( this.template(this.model.toJSON()));
	        this.$el.addClass("row");
	        this.$el.attr("name","0");
	        
	        return this;
	    }
	});
	
	var EducationHistoryListView =  Backbone.View.extend({
		el: $('#education_history_list'),
		initialize:  function(){
	    	this.listenTo(this.collection, 'reset', this.render);
		},
	    render: function() {
	    	this.$el.empty();
	    	this.collection.each( function( $model ) {
	            var itemview = new EducationHistoryItemView({model: $model}); 	
	            this.$el.append( itemview.render().el );
        	}, this);
	    	
	    	if (historyCount >= 5) {console.log(11);
    			$("#addEducationHistory").addClass("disabled");
	    	} else {
	    		$("#addEducationHistory").removeClass("disabled");
	    	}
	    	
	        return this;
	    }
	});
	
	EducationHistoryModel.prototype.init = function(id){ 
		uid = id;
		
    	var myhistory = new EducationHistoryCollection();
    	var myhistoryListView = new EducationHistoryListView({
    	        collection: myhistory   	        
    	});
    	myhistory.fetch({reset:true});
	}
};

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