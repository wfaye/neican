jQuery(document).ready(function(){
	jQuery("#findPassword")
		.on("click","#j_send_email",function(e){
			e.preventDefault();
			
			var email = jQuery("input[name='email_address']").val();
	
	        /* 正则检测邮箱地址正确性 */
	        if (!isEmail(email)) {
	            alertCustom("提示", "请输入正确的邮箱地址！");
	            return;
	        }
	        if (email == "") {
	            jQuery("input[name='email_address']").css("color", "red");
	        } else {
	            var mailregdata = {
	                "email": email
	            };
	            
	            jQuery.ajax({
	                url: "/ekb/auth/register",
	                type: "POST",
	                data: JSON.stringify(mailregdata),
	                dataType: "json",
	                contentType: "application/json",
	                success: function(res) {
	                    if (res.no == 0) {
	                    	jQuery("#panes").css("height","205px");
	                		jQuery(".one_page").hide();
	                		jQuery(".send_email_code").show();
	                    } else if (res.no == 1) {
	                        alertCustom("提示", "该邮箱不存在");
	                    }
	
	                },
	                error: function() {
	                    alertCustom("提示", "出错了~");
	                }
	            });
	        }
		})
		.on("click","#j_send_email_code",function(e){
			e.preventDefault();
			
			var phone = jQuery("input[name='phone']").val();
	        var emailCode = jQuery("input[name='email_code']").val();

	        /* 正则检测手机号正确性 */
	        if (!isMobile(phone)) {
	            alertCustom("提示", "请输入正确的手机号码！");
	            return;
	        }
	        
	        if (phone == "") {
	            jQuery("input[name='phone']").css("color", "red");
	        } else if (emailCode == "") {
	            jQuery("input[name='email_code']").css("color", "red");
	        } else {
	            var data = {
	                "phone": phone,
	                "emailCode": emailCode
	            };
	            jQuery.ajax({
	                url: "/ekb/auth/register",
	                type: "POST",
	                data: JSON.stringify(data),
	                dataType: "json",
	                contentType: "application/json",
	                success: function(res) {
	                    if (res.no == 0) {
	                    	jQuery("#panes").css("height","205px");
	                		jQuery(".one_page").hide();
	                		jQuery(".reset_password_by_email").show();
	                    } else if (res.no == 1) {
//	                        alertCustom("提示", "该邮箱已注册~");
	                    }

	                },
	                error: function() {
//	                    alertCustom("提示", "注册出错了~");
	                }
	            });
	        }
		})
		.on("click","#j_reset_password",function(e){
			e.preventDefault();
			
			var password = jQuery("input[name='password']").val();
	        var sure_password = jQuery("input[name='sure_password']").val();

	        if (password == "") {
	            jQuery("input[name='password']").css("color", "red");
	        } else if (sure_password == "") {
	            jQuery("input[name='sure_password']").css("color", "red");
	        } else if (password != sure_password) {
	            alertCustom("提示", "两次密码输入不一致！");
	            return;
	        }else {
	            var data = {
	                "password": password
	            };
	            
	            jQuery.ajax({
	                url: "/ekb/auth/register",
	                type: "POST",
	                data: JSON.stringify(data),
	                dataType: "json",
	                contentType: "application/json",
	                success: function(res) {
	                    if (res.no == 0) {
	                    	alertCustom("提示", "密码设置成功~");
	                    } else if (res.no == 1) {
//	                        alertCustom("提示", "该邮箱已注册~");
	                    }

	                },
	                error: function() {
//	                    alertCustom("提示", "注册出错了~");
	                }
	            });
	        }
		});
});
/* 正则检查email */
function isEmail(obj) {
    reg = /^.+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;
    if (!reg.test(obj)) {
        return false;
    } else {
        return true
    }
}

function isMobile(obj) {
    reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(obj)) {
        return false;
    } else {
        return true;
    }
}

function alertCustom(title, content) {
    try {
        jQuery("<div title=\"" + title + "\"><p  style=\"float:left;\"><span class=\"ui-icon ui-icon-alert\"  style=\"float:left;\"></span>" + content + "</p></div>").dialog({
            resizable: false,
            height: 150,
            modal: true,
            buttons: {
                "确定": function() {
                    jQuery(this).dialog("close");
                }
            }
        });
    } catch(e) {
        alert(content);
    }
}