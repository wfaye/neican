jQuery(document).ready(function() {
    /* 发送注册请求 */
    jQuery("#email_reg").click(function() {
        var email = jQuery("input[name='email_address']").val();
        var epassword = jQuery("input[name='email_password']").val();

        /* 正则检测邮箱地址正确性 */
        if (!isEmail(email)) {
            alertCustom("提示", "请输入正确的邮箱地址！");
            return;
        }
        /* 检测密码是否由字母数字组成 */
        if (!isInputRight(epassword)) {
            alertCustom("提示", "请输入6~12位由字母或数字组成的密码！");
            return;
        }
        if (email == "") {
            jQuery("input[name='email_address']").css("color", "red");
        } else if (epassword == "") {
            jQuery("input[name='email_password']").css("color", "red");
        } else {
            var mailtype = email.split("@")[1];
            var mailregdata = {
                "email": email,
                "password": epassword
            };
            jQuery.ajax({
                url: "/ekb/auth/register",
                type: "POST",
                data: JSON.stringify(mailregdata),
                dataType: "json",
                contentType: "application/json",
                success: function(res) {
                    if (res.no == 0) {
                        alertCustom("提示", "申请成功，请前往您的邮箱激活~！");
                        window.location.href = "after_register.html?mailtype=" + mailtype;
                    } else if (res.no == 1) {
                        alertCustom("提示", "该邮箱已注册~");
                    }

                },
                error: function() {
                    alertCustom("提示", "注册出错了~");
                }
            });
        }
    });

    jQuery("#phone_reg").click(function() {
        // var phone =
        // jQuery("input[name='phone_number']").val();
        var phone_vericode = jQuery("input[name='phone_veri_number']").val();
        var ppassword = jQuery("input[name='phone_password']").val();

        if (phone_vericode == "") {
            jQuery("input[name='phone_veri']").css("color", "red");
        } else if (ppassword == "") {
            jQuery("input[name='phone_password']").css("color", "red");
        } else {
            var phoneregdata = {
                "password": ppassword,
                "activateCode": phone_vericode
            };
            jQuery.ajax({
                url: "/ekb/auth/activate",
                type: "POST",
                data: JSON.stringify(phoneregdata),
                dataType: "json",
                contentType: "application/json",
                success: function(res) {
                    if (res.no == 0) {
                        alertCustom("提示", "注册成功!");
                        window.location.href = "/profile.html?uid=" + res.data.uid;
                    } else if (res.no == 1) {
                        alertCustom("提示", "该手机号已注册~");
                    }
                   
                },
                error: function() {
                    alertCustom("提示", "注册出错啦~");
                }
            });
        }
    });

    jQuery("#phone_veri").click(function() {
        var phone = jQuery("input[name='phone_number']").val();
        /* 正则检测手机号码正确性 */
        if (!isMobile(phone)) {
            alertCustom("提示", "请输入正确的手机号码！");
            return;
        }
        jQuery("input[name='phone_veri']").css("color", "white");
        if (phone == "") {
            jQuery("input[name='phone_number']").css("color", "red");
        } else {
            if (jQuery("#phone_veri").val().indexOf("重发") < 0) {
                var veridata = {
                    "mobile": phone
                };
                jQuery("input[name='phone_veri']").css("background", "gray");
                jQuery("#phone_veri").val("59s后重发");

                var counter = setInterval(function() {
                    var nextCount = jQuery("#phone_veri").val().substr(0, 2) - 1;
                    if (nextCount >= 0) {
                        if (nextCount < 10) {
                            jQuery("#phone_veri").val("0" + nextCount + "s后重发");
                        } else {
                            jQuery("#phone_veri").val(nextCount + "s后重发");
                        }
                    } else {
                        clearInterval(counter);
                        jQuery("input[name='phone_veri']").css("background", "#4b8df9");
                        jQuery("#phone_veri").val("发送手机验证码");
                    }
                },
                1000);
                jQuery.ajax({
                    url: "/ekb/auth/register",
                    type: "POST",
                    data: JSON.stringify(veridata),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(res) {
                        if (res.no == 0) {

                            alertCustom("提示", "发送成功，请查收~");
                        } else if (res.no == 1) {
                            alertCustom("提示", res.errMsg);
                        } else {}
                    }
                });
            } else {
                alertCustom("提示", "请稍后重发~！")
            }
        }
        // var ppassword =
        // jQuery("input[name='phone_password']").val();
    });

    /* 发送登录请求 */
    jQuery("#login_submit").click(function() {
        var username = jQuery("input[name='username']").val();
        var login_password = jQuery("input[name='password']").val();
        var data;
        /* 正则检测手机号码正确性 */
        if (jQuery("p[id='type_username']").text().indexOf("手 机：") >= 0) {
            if (!isMobile(username)) {
                alertCustom("提示", "请输入正确的手机号码！");
                return;
            }
        }
        /* 正则检测邮箱地址正确性 */
        if (jQuery("p[id='type_username']").text().indexOf("邮 箱：") >= 0) {
            if (!isEmail(username)) {
                alertCustom("提示", "请输入正确的邮箱地址！");
                return;
            }
        }
        /* 检测密码是否由字母数字组成 */
        if (!isInputRight(login_password)) {
            alertCustom("提示", "请输入6~12位由字母或数字组成的密码！");
            return;
        }
        if (username.indexOf("@") > 0) {
            data = {
                "email": username,
                "password": login_password
            };
        } else {
            data = {
                "mobile": username,
                "password": login_password
            };
        }
        alertCustom("提示", "登录中...");
        jQuery.ajax({
            url: "/ekb/auth/login",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(res) {
                if (res.no == 0) {
                    if (res.data.isFirstTime == 1) {
                        window.location.href = "/profile.html?uid=" + res.data.uid;
                    } else {
                        window.location.href = "/mainpage.html?uid=" + res.data.uid;
                    }
                    $.cookie("neican_username",res.data.name);
                } else if (res.no == 1) {
                    alertCustom("提示", res.errMsg);
                } else {}
            }
        });
    });

    /* 点击激活链接到指定邮箱 */
    jQuery("#activate_link").click(function() {
        var url = window.location.href;
        var len = url.length; // 获取url的长度
        var offset = url.indexOf("?"); // 设置参数字符串开始的位置
        var para = url.substr(offset, len) // 取出参数字符串
        // 这里会获得类似“id=1”这样的字符串
        var mailtype = para.split("=")[1]; // 对获得的参数字符串按照“=”进行分割
        /* 类似 gmail.com 的地址前面不可以加 mail. */
        var mailadd = gotoEmail(mailtype);
        window.open(mailadd);
    });
    /* 用户名提示文字 */
    jQuery("input[id=input_name]").parent().on('focus','input[id=input_name]',
    function() {
        if ($(this).val() == "请输入手机号码" || $(this).val() == "请输入邮箱地址") {
            $(this).val("");
        }
        $(this).css({
            "color": "#000"
        })
    }).on('blur','input[id=input_name]',
    function() {

        if ($("p[id=type_username]").text().trim().replace(" ", "").indexOf("手机") >= 0) {
            if ($(this).val() == "") {
                $(this).val("请输入手机号码");
            } else if (!isMobile($(this).val())) {
                $(this).val("请输入手机号码");
                alertCustom("提示", "请输入正确的手机号码！");
            }
        }
        if ($("p[id=type_username]").text().trim().replace(" ", "").indexOf("邮箱") >= 0) {
            if ($(this).val() == "") {
                $(this).val("请输入邮箱地址");
            } else if (!isEmail($(this).val())) {
                $(this).val("请输入邮箱地址");
                alertCustom("提示", "请输入正确的邮箱地址！");
            }
        }
        $(this).css({
            "color": "#999"
        });
    });
    /* 注册界面用户名格式正确与否判断 */
    jQuery("input[name='email_address']").parent().on('blur',"input[name='email_address']",
    function() {
        if (!isEmail(jQuery(this).val()) && jQuery(this).val() != "") {
            jQuery(this).val("");
            alertCustom("提示", "请输入正确的邮箱地址！");
        }
    });
    jQuery("input[name='phone_number']").parent().on('blur',"input[name='phone_number']",
    function() {
        if (!isMobile(jQuery(this).val()) && jQuery(this).val() != "") {
            jQuery(this).val("");
            alertCustom("提示", "请输入正确的手机号码！");
        }
    });
    jQuery("input[name='phone_password'],input[name='email_password']").parent().on('blur',"input[name='phone_password'],input[name='email_password']",
    function() {
        if (!isInputRight(jQuery(this).val()) && jQuery(this).val() != "") {
            jQuery(this).val("");
            alertCustom("提示", "请输入6~12位由字母或数字组成的密码！");
        }
    });
    
    /*密码输入提示*/
    jQuery("input[name=password]").parent().on('focus',"input[name=password]",
    function() {
        if ($(this).val() == "请输入密码") {
            $("p[id=type_password]").html("密 码：<input type=\"password\" style=\"color:black;\" name=\"password\" value=\"\" \/>");
            $("input[name=password]").focus()
        }
    }).on('blur',"input[name=password]",
    function() {
        if ($(this).val() == "") {
            $("p[id=type_password]").html("密 码：<input type=\"text\" name=\"password\" value=\"请输入密码\" style=\"color:#999;\"\/>");
        } else if (!isInputRight($(this).val()) && $(this).val() != "请输入密码") {
            $("p[id=type_password]").html("密 码：<input type=\"text\" name=\"password\" value=\"请输入密码\" style=\"color:#999;\"\/>");
            alertCustom("提示", "请输入6~12位由字母或数字组成的密码！");
        }
    });
    /* 切换登录按钮 */
    jQuery("input[id=input_email]").click(function() {
        $(this).css({
            "background-color": "rgba(85,102,255,1)"
        });
        $("input[id=input_tel]").css({
            "background-color": "rgba(85,102,255,0.4)"
        });
        $("p[id=type_username]").slideUp("fast");
        $("p[id=type_username]").html("邮 箱：<input type=\"text\" id=\"input_name\" name=\"username\" value=\"请输入邮箱地址\" style=\"color:#999;\"\/>");
        $("input[id=input_name]").val("请输入邮箱地址");
        $("p[id=type_username]").slideDown("fast");
    });
    jQuery("input[id=input_tel]").click(function() {
        $(this).css({
            "background-color": "rgba(85,102,255,1)"
        });
        $("input[id=input_email]").css({
            "background-color": "rgba(85,102,255,0.4)"
        });
        $("p[id=type_username]").slideUp("fast");
        $("p[id=type_username]").html("手 机：<input type=\"text\" id=\"input_name\" name=\"username\" value=\"请输入手机号码\" style=\"color:#999;\"\/>");
        $("p[id=type_username]").slideDown("fast");
    });
    /* 切换登录按钮hover */
    jQuery("input[class=login_button]").hover(function() {
        $(this).css({
            "background": "rgba(119,0,176,0.5)"
        });
    },
    function() {
        $(this).css({
            "background": "#70b"
        });
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
/* 正则检查字符 */
function isInputRight(obj) {
    reg = /^[a-z,A-Z,0-9]{6,12}$/;
    if (!reg.test(obj)) {
        return false;
    } else {
        return true;
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
// /*qq登陆跳转*/
// QC.Login({
// btnId:"qqLoginBtn", //插入按钮的节点id
// scope:"all",
// //按钮尺寸，可用值[A_XL| A_L| A_M| A_S| B_M| B_S| C_S]，可选，默认B_S
// size: "A_L"
// });
/* 用于自定义提示框 */
function alertCustom(title, content) {
    try {
//        jQuery("<div title=\"" + title + "\"><p  style=\"float:left;\"><span class=\"ui-icon ui-icon-alert\"  style=\"float:left;\"></span>" + content + "</p></div>").dialog({
//            resizable: false,
//            height: 150,
//            modal: true,
//            buttons: {
//                "确定": function() {
//                    jQuery(this).dialog("close");
//                }
//            }
//        });
    	swal(content);
    } catch(e) {
    	swal(content);
    }
}
//功能：根据用户输入的Email跳转到相应的电子邮箱首页
function gotoEmail($t) {
    $t = $t.toLowerCase();
    if ($t == '163.com') {
        return 'http://mail.163.com';
    } else if ($t == 'vip.163.com') {
        return 'http://vip.163.com';
    } else if ($t == '126.com') {
        return 'http://mail.126.com';
    } else if ($t == 'qq.com' || $t == 'vip.qq.com' || $t == 'foxmail.com') {
        return 'http://mail.qq.com';
    } else if ($t == 'gmail.com') {
        return 'http://mail.google.com';
    } else if ($t == 'sohu.com') {
        return 'http://mail.sohu.com';
    } else if ($t == 'tom.com') {
        return 'http://mail.tom.com';
    } else if ($t == 'vip.sina.com') {
        return 'http://vip.sina.com';
    } else if ($t == 'sina.com.cn' || $t == 'sina.com') {
        return 'http://mail.sina.com.cn';
    } else if ($t == 'tom.com') {
        return 'http://mail.tom.com';
    } else if ($t == 'yahoo.com.cn' || $t == 'yahoo.cn') {
        return 'http://mail.cn.yahoo.com';
    } else if ($t == 'tom.com') {
        return 'http://mail.tom.com';
    } else if ($t == 'yeah.net') {
        return 'http://www.yeah.net';
    } else if ($t == '21cn.com') {
        return 'http://mail.21cn.com';
    } else if ($t == 'hotmail.com') {
        return 'http://www.hotmail.com';
    } else if ($t == 'sogou.com') {
        return 'http://mail.sogou.com';
    } else if ($t == '188.com') {
        return 'http://www.188.com';
    } else if ($t == '139.com') {
        return 'http://mail.10086.cn';
    } else if ($t == '189.cn') {
        return 'http://webmail15.189.cn/webmail';
    } else if ($t == 'wo.com.cn') {
        return 'http://mail.wo.com.cn/smsmail';
    } else if ($t == '139.com') {
        return 'http://mail.10086.cn';
    } else if($t == 'surewaysolutions.com'){
    	return 'https://surewaysolutions.com/owa';
    } else {
        return 'http://' + $t;
    }
}