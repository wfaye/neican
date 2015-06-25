$(document).ready(function(){
	$(".reg_form reg_mobile").css("display","block");
	$(".reg_form reg_mail").css("display","none");
	$("#phone-register").click(function(){
		$(".reg_form reg_mobile").css("display","block");
		$(".reg_form reg_mail").css("display","none");
	});
	$("#mail-register").click(function(){
		$(".reg_form reg_mobile").css("display","none");
		$(".reg_form reg_mail").css("display","block");
	});
});