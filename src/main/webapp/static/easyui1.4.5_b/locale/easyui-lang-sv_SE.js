if ($.fn.pagination) {
    $.fn.pagination.defaults.beforePageText = 'Sida';
    $.fn.pagination.defaults.afterPageText = 'av {pages}';
    $.fn.pagination.defaults.displayMsg = 'Visar {from} till {to} av {total} poster';
}
if ($.fn.datagrid) {
    $.fn.datagrid.defaults.loadMsg = 'Bearbetar, vänligen vänta ...';
}
if ($.fn.treegrid && $.fn.datagrid) {
    $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager) {
    $.messager.defaults.ok = 'Ok';
    $.messager.defaults.cancel = 'Avbryt';
}
$.map(['validatebox','textbox','filebox','searchbox',
        'combo','combobox','combogrid','combotree',
        'datebox','datetimebox','numberbox',
        'spinner','numberspinner','timespinner','datetimespinner'], function(plugin){
    if ($.fn[plugin]){
        $.fn[plugin].defaults.missingMessage = 'Detta fält är obligatoriskt.';
    }
});
if ($.fn.validatebox) {
    $.fn.validatebox.defaults.rules.email.message = 'Vänligen ange en korrekt e-post adress.';
    $.fn.validatebox.defaults.rules.url.message = 'Vänligen ange en korrekt URL.';
    $.fn.validatebox.defaults.rules.length.message = 'Vänligen ange ett nummer mellan {0} och {1}.';
    $.fn.validatebox.defaults.rules.remote.message = 'Vänligen åtgärda detta fält.';
}
if ($.fn.calendar) {
    $.fn.calendar.defaults.weeks = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];
    $.fn.calendar.defaults.months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
}
if ($.fn.datebox) {
    $.fn.datebox.defaults.currentText = 'I dag';
    $.fn.datebox.defaults.closeText = 'Stäng';
    $.fn.datebox.defaults.okText = 'Ok';
	$.fn.datebox.defaults.formatter = function(date){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
	};
	$.fn.datebox.defaults.parser = function(s){
		if (!s) return new Date();
		var ss = s.split('-');
		var y = parseInt(ss[0],10);
		var m = parseInt(ss[1],10);
		var d = parseInt(ss[2],10);
		if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
			return new Date(y,m-1,d);
		} else {
			return new Date();
		}
	};
}
if ($.fn.datetimebox && $.fn.datebox) {
    $.extend($.fn.datetimebox.defaults, {
        currentText: $.fn.datebox.defaults.currentText,
        closeText: $.fn.datebox.defaults.closeText,
        okText: $.fn.datebox.defaults.okText
    });
}
