//ckeditor补充插件，用于把html的上传搞进去
$(document).ready(function() {
	$("input[id^='cke_'][id$='_textInput'][aria-required='true']").live("focus",function(){
		var xyzckeditoruploadid = $(this).attr("id");
		var xyzckeditoruploadidb = xyzckeditoruploadid+"_xyz";
		if($("#"+xyzckeditoruploadidb).length==0){
			$(this).after("<div id='"+xyzckeditoruploadidb+"' style='height:25px;width:80px;'></div>");
			xyzDropzone.create({
				xyzDropzone:xyzckeditoruploadidb,//容器div
				params:{"derictoryCode":"ckeditordirectory"},//上传时需要同时提交的参数键值对
				maxFiles:10,
				maxFilesize:"5120kb",//允许上传的单个文件大小（单位kb）
				btnText:'上传',
				success:function(result){
					$("#"+xyzckeditoruploadid).val(result.content.url);
				}
			});
		}
	});
});