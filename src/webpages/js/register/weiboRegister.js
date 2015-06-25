$(function(){
	var userName = getUrlParam("screen_name");
	var uid = getUrlParam("uid");
	var token = getUrlParam("access_token");
	
	$("#UserName").val(userName);
	
	$("#autohomeregister")
		.on("click",".j_mobole_code_btn",function(e){
			e.preventDefault();
			sendPhoneVerifyCode();
		})
		.on("click",".j_register_submit",function(e){
			e.preventDefault();
			registerWithPhone();
		});
	
	/**
	 * 获取url参数
	 */
	function getUrlParam(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);  
		if (r!=null) return decodeURI(r[2], "UTF-8"); 
		
		return null;
	} 
	
	/*发送手机验证码*/
	function sendPhoneVerifyCode()
	{
		var phone = $("input[name='Mobile']").val();
		var user = $("input[name='UserName']").val();
		
		if(!phone){
			$("input[name='Mobile']").css("border-color","red");
		}else if(!user){
			$("input[name='UserName']").css("border-color","red");
		}else{
			var veridata = {"screen_name":user,"uid":uid,"access_token":token,"mobile":phone};
			$.ajax({
				url : "/ekb/auth/weibo/register",
				type : "POST",
				data: JSON.stringify(veridata),
				dataType : "json",
	    	    contentType : "application/json",
	    	    success : function(res){
	    	    	if(res.no == 0){
	    	    		alert("发送成功，请查收~");
	    	    	}else if(res.no == 1){
	    	    		alert(res.errMsg);
	    	    	}else{
	    	    	}
	    	    }
			});
		}
	}
	
	/*微博账号注册*/
	function registerWithPhone()
	{
		var phone_vericode = $("input[name='ValidCode']").val();
		
		if(!phone_vericode){
			$("input[name='ValidCode']").css("border-color","red");
		}else{
			var phoneregdata = {"activateCode":phone_vericode};
			$.ajax({
				url : "/ekb/auth/weibo/activate",
				type : "POST",
				data: JSON.stringify(phoneregdata),
				dataType : "json",
	    	    contentType : "application/json",
	    	    success: function(res) {
	    	    	if(res.no == 0){
	    	    		alert("注册成功!");
	    	    		window.location.href="/profile.html?uid="+res.data.uid;
	    	    	}else if(res.no == 1){
	    	    		alert("该手机号已注册~");
	    	    	}
	    	    },
	    	    error: function(){
	    	    	alert("注册出错啦~");
	    	    }
			});
		}
	}
});