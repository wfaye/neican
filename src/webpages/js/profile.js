$(function(){
	var profile = function(){
		/* 请求url */
		var profileUrl = "/ekb/auth/simpleInfo/";
		var getPositionUrl = "/ekb/jobPositionList/";
		var getDepartment = "/ekb/departmentList";
			
		/* 页面元素  */
		var $name = $("input[name='name']");
		var $companyName = $("input[name='companyName']");
		var $department = $("select[name='department']");
		var $selfDefDepartment = $("input[name='selfDefDepartment']");
		var $title = $("select[name='title']");
		var $selfDefTitle = $("input[name='selfDefTitle']");
		var $address = $("input[name='address']");
		var $phone = $("input[name='phone']");
		var $personalEmail = $("input[name='personalEmail']");
		var $userIdentifier = $("input[name='userIdentifier']");
		
		/*提示文字*/
		var strInputDepartment="请填写您所在的行业";
		var strInputTitle="请填写您的职位";
		/* 相关数据 */
		var profileData = {"data":{
				"contactInfo":
				{
					"mobilePhone":
						{
							"phoneId":"",
							"phoneNum":"",
							"isLogon":false
						},
					"officePhone":"",
					"personalEmail":{
						"emailId": "", 
						"email": "", 
						"isLogon": false
					},
					"officeEmail":"", 
					"address":{
						"addressId":"",
						"address":""
					}
				},
				"name":"",
				"workInfo":{
					"workHistoryId":"",
					"orgName":"",
					"jobPosition":"",
					"department":""
				}
		}};
		var position = null;
		var department = null;
		var departmentId = null;
		var uid = null;
		
		uid = getUrlParam("uid");
			
		/**
		 * 得到个人信息
		 */
		var _getProfile = function(){			
			$.get(profileUrl+uid,function(res){
				profileData.data.contactInfo.mobilePhone = res.data.contactInfo.mobilePhone?res.data.contactInfo.mobilePhone:profileData.data.contactInfo.mobilePhone;
				profileData.data.contactInfo.personalEmail = res.data.contactInfo.personalEmail?res.data.contactInfo.personalEmail:profileData.data.contactInfo.personalEmail;
				profileData.data.contactInfo.address = res.data.contactInfo.address?res.data.contactInfo.address:profileData.data.contactInfo.address;
				profileData.data.name = res.data.name?res.data.name:profileData.data.name;
				profileData.data.workInfo = res.data.workInfo?res.data.workInfo:profileData.data.workInfo;
				
				if(res.no === 0){
					$name.val(profileData.data.name);
					$companyName.val(profileData.data.workInfo.orgName);
					$department.find("option[value='"+(profileData.data.workInfo&&profileData.data.workInfo.jobPosition)+"']").attr("selected",true);
					$title.find("option[value='"+(profileData.data.workInfo&&profileData.data.workInfo.workHistoryId)+"']").attr("selected",true);
					$address.val(profileData.data.contactInfo.address&&profileData.data.contactInfo.address.address);
					$phone.val(profileData.data.contactInfo.mobilePhone&&profileData.data.contactInfo.mobilePhone.phoneNum);
					$personalEmail.val(profileData.data.contactInfo.personalEmail&&profileData.data.contactInfo.personalEmail.email);
					
					if(profileData.data.contactInfo.mobilePhone&&profileData.data.contactInfo.mobilePhone.phoneNum){
						$userIdentifier.val(profileData.data.contactInfo.mobilePhone.phoneNum);
					}else{
						$userIdentifier.val(profileData.data.contactInfo.personalEmail&&profileData.data.contactInfo.personalEmail.email);
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
					$department.find("option[value='"+(profileData.data.workInfo&&profileData.data.workInfo.department)+"']").attr("selected",true);
					_getPositions();
				}else{
					alert(res.errMsg);
				}
			},"json");
			
			/* 选择行业 */
			$department.change(function(){
				/*行业为“其他”的情况处理*/
				if($department.find("option:last").attr("selected")=="selected"){
					$selfDefDepartment.slideDown();
				}
				else{
					$selfDefDepartment.slideUp();
					$selfDefTitle.slideUp();
					$selfDefDepartment.val();
				}
				_getPositions();
			});
			/*自定义行业输入提示*/
			$selfDefDepartment.focus(function(){
				if($selfDefDepartment.val()==strInputDepartment){
					$selfDefDepartment.val("");
					$selfDefDepartment.css("color","black");
				}
			}).blur(function(){
				if($selfDefDepartment.val()==""){
					$selfDefDepartment.val(strInputDepartment);
					$selfDefDepartment.css("color","gray");
				}
			});
			/* 选择职位 */
			$title.change(function(){
				/*职位为“其他”的情况处理*/
				if($title.find("option:last").attr("selected")=="selected"){
					$selfDefTitle.slideDown();
				}
				else{
					$selfDefTitle.slideUp();
					$selfDefTitle.val();
				}
			});
			/*自定义职业输入提示*/
			$selfDefTitle.focus(function(){
				if($selfDefTitle.val()==strInputTitle){
					$selfDefTitle.val("");
					$selfDefTitle.css("color","black");
				}
			}).blur(function(){
				if($selfDefTitle.val()==""){
					$selfDefTitle.val(strInputTitle);
					$selfDefTitle.css("color","gray");
				}
			});
		};
		_getProfile();
		
		/**
		 * 提交个人信息
		 */
		$(".box").on("click",".j_primary_button_flat",function(e){
			e.preventDefault();
			
			var postData = _getData(profileData);
			
			if(postData){
				$.ajax({
					url : profileUrl+uid,
					type : "POST",
					data : postData,
					dataType : "JSON",
					contentType : "application/json",
					success : function(res){
						if(res.no === 0){
							$( "#user_choice" ).dialog({
							      resizable: false,
							      height:140,
							      modal: true,
							      buttons: {
							        "继续填写": function() {
							          $( this ).dialog( "close" );
							          window.location.href = "/mainpage.html?detail=1&uid="+uid;
							        },
							        "直接前往主页": function() {
							          $( this ).dialog( "close" );
							          window.location.href = "/mainpage.html?uid="+uid;
								    },
							        Cancel: function() {
							          $( this ).dialog( "close" );
							        }
							      }
							  });
							
						}else{
							alert("出错啦~");
						}
					}
				});
			}
		});
		
		/**
		 * 验证数据
		 */
		function _getData(data){
			var postData = data;
			
			if(!$name.val()){
				alert("请填写您的名称");
			}else if(!$companyName.val()){
				alert("请填写您所在的公司");
			}else{
				postData.data.name = $name.val();
				postData.data.workInfo.orgName = $companyName.val();
				postData.data.workInfo.department = $department.find("option:selected").attr("value");
				postData.data.workInfo.jobPosition = $title.find("option:selected").attr("value");
				
				if ($address.val()) {
					postData.data.contactInfo.address.address = $address.val();
				} else {
					postData.data.contactInfo.address = "";
				}
				if ($phone.val()) {
					postData.data.contactInfo.mobilePhone.phoneNum = $phone.val();
				} else {
					postData.data.contactInfo.mobilePhone = "";
				}
				if ($personalEmail.val()) {
					postData.data.contactInfo.personalEmail.email = $personalEmail.val();
				} else {
					postData.data.contactInfo.personalEmail = "";
				}
				
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
					
					$title.find("option[value='"+(profileData.data.workInfo&&profileData.data.workInfo.workHistoryId)+"']").attr("selected",true);
				}else{}
			},"json");
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
	};
	profile();
});