if ($.fn.pagination){
	$.fn.pagination.defaults.beforePageText = 'Strona';
	$.fn.pagination.defaults.afterPageText = 'z {pages}';
	$.fn.pagination.defaults.displayMsg = 'Wyświetlono elementy od {from} do {to} z {total}';
}
if ($.fn.datagrid){
	$.fn.datagrid.defaults.loadMsg = 'Przetwarzanie, proszę czekać ...';
}
if ($.fn.treegrid && $.fn.datagrid){
	$.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager){
	$.messager.defaults.ok = 'Ok';
	$.messager.defaults.cancel = 'Cancel';
}
$.map(['validatebox','textbox','filebox','searchbox',
		'combo','combobox','combogrid','combotree',
		'datebox','datetimebox','numberbox',
		'spinner','numberspinner','timespinner','datetimespinner'], function(plugin){
	if ($.fn[plugin]){
		$.fn[plugin].defaults.missingMessage = 'To pole jest wymagane.';
	}
});
if ($.fn.validatebox){
	$.fn.validatebox.defaults.rules.email.message = 'Wprowadź poprawny adres email.';
	$.fn.validatebox.defaults.rules.url.message = 'Wprowadź poprawny adres URL.';
	$.fn.validatebox.defaults.rules.length.message = 'Wprowadź wartość z zakresu od {0} do {1}.';
	$.fn.validatebox.defaults.rules.remote.message = 'Proszę poprawić to pole.';
}
if ($.fn.calendar){
	$.fn.calendar.defaults.weeks = ['N','P','W','Ś','C','P','S'];
	$.fn.calendar.defaults.months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
}
if ($.fn.datebox){
	$.fn.datebox.defaults.currentText = 'Dzisiaj';
	$.fn.datebox.defaults.closeText = 'Zamknij';
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
if ($.fn.datetimebox && $.fn.datebox){
	$.extend($.fn.datetimebox.defaults,{
		currentText: $.fn.datebox.defaults.currentText,
		closeText: $.fn.datebox.defaults.closeText,
		okText: $.fn.datebox.defaults.okText
	});
}
