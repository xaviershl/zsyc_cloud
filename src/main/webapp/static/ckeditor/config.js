/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	 config.language = 'zh-cn';
	 //config.font_names 加入中文字体的选择
	 config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;雅黑/雅黑;'+ config.font_names ;
	// config.uiColor 配置UI颜色，默认是灰黑色
//	 config.uiColor = '#E0ECFF';
	 config.toolbarCanCollapse = true;
	 config.skin = 'office2013';
	 config.toolbar = 'Full';
	 config.forcePasteAsPlainText = false;
	 config.pasteFromWordKeepsStructure = false;
	 config.pasteFromWordRemoveStyle = false;
	 config.pasteFromWordRemoveFontStyles = false;
	 config.editingBlock = true;  //是否对编辑区域进行渲染
	 config.baseFloatZIndex = 10000;
	 
	 config.startupFocus = true;
	 
	 config.toolbar_Full =
	 [
	         { name: 'document', items : [ 'Source','-','NewPage','DocProps','Preview','Print','-','Templates' ] },
	         { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
	         { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
	         { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
	         'HiddenField' ] },
	         '/',
	         { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
	         { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
	         '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
	         { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
	         { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
	         '/',
	         { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
	         { name: 'colors', items : [ 'TextColor','BGColor' ] },
	         { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-' ] }
	 ];
	  
	 config.toolbar_Basic =
	 [
	         /*['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','-','About']*/
	         ['Preview','Bold', 'Italic','Underline','Strike','JustifyLeft','JustifyRight','JustifyBlock', '-','SpecialChar', 'PasteText', 'PasteFromWord','Outdent','Indent', '-','ImageButton','Link', 'Unlink','RemoveFormat'],
	         ['Styles','Format','Font','FontSize','TextColor','BGColor','Maximize']
	 ];

//	 工具栏的定义英汉对照说明：
//	 Source = 源码模式
//	 -
//	 Save = 保存(提交表单)
//	 NewPage = 新建
//	 Preview = 预览
//	 - = 分割线
//	 Templates = 模板
//	 Cut = 剪切
//	 Copy = 复制
//	 Paste = 粘贴
//	 PasteText = 粘贴为无格式文本
//	 PasteFromWord = 从 MS WORD 粘贴
//	 -
//	 Print = 打印
//	 SpellChecker = 拼写检查
//	 Scayt = 即时拼写检查
//	 Undo = 撤销
//	 Redo = 重做
//	 -
//	 Find = 查找
//	 Replace = 替换
//	 -
//	 SelectAll = 全选
//	 RemoveFormat = 清除格式
//	 Form = 表单
//	 Checkbox = 复选框
//	 Radio = 单选框
//	 TextField = 单行文本
//	 Textarea = 多行文本
//	 Select = 列表/菜单
//	 Button = 按钮
//	 ImageButton = 图片按钮
//	 HiddenField = 隐藏域
//	 /
//	 Bold = 加粗
//	 Italic = 倾斜
//	 Underline = 下划线
//	 Strike = 删除线
//	 -
//	 Subscript = 下标
//	 Superscript = 上标
//	 NumberedList = 编号列表
//	 BulletedList = 项目列表
//	 -
//	 Outdent = 减少缩进量
//	 Indent = 增加缩进量
//	 Blockquote = 块引用
//	 CreateDiv = 创建DIV容器
//	 JustifyLeft = 左对齐
//	 JustifyCenter = 居中
//	 JustifyRight = 右对齐
//	 JustifyBlock = 两端对齐
//	 BidiLtr = 文字方向从左到右
//	 BidiRtl = 文字方向从右到左
//	 Link = 插入/编辑超链接(上传文件)
//	 Unlink = 取消超链接
//	 Anchor = 插入/编辑锚点链接
//	 Image = 图像(上传)
//	 Flash = 动画(上传)
//	 Table = 表格
//	 HorizontalRule = 插入水平线
//	 Smiley = 插入表情
//	 SpecialChar = 插入特殊符号
//	 PageBreak = 插入分页符
//	 /
//	 Styles = 样式快捷方式
//	 Format = 文本格式
//	 Font = 字体
//	 FontSize = 文字大小
//	 TextColor = 文字颜色
//	 BGColor = 背景颜色
//	 Maximize = 全屏编辑模式
//	 ShowBlocks = 显示区块
//	 -
//	 About = 显示关于


	 
};
