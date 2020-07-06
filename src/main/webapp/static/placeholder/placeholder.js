var JPlaceHolder = {
	_check : function(){
		return 'placeholder' in document.createElement('input');
	},
	init : function(){
		if(!this._check()){
			this.fix();
		}
	},
	fix : function(){
		jQuery(':input[placeholder]').each(function(index, element) {
			var self = $(this), txt = self.attr('placeholder');
			self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
			var pos = self.position(), h = self.innerHeight(), paddingleft = self.css('padding-left');
			var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lineHeight:h+"px", paddingLeft:paddingleft, color:'#aaa',zIndex:2}).appendTo(self.parent());
			self.focusin(function(e) {
				holder.hide();
			}).focusout(function(e) {
				if(!self.val()){
					holder.show();
				}
			});
			holder.click(function(e) {
				holder.hide();
				self.focus();
			});
		});
	}
};
jQuery(function(){
    JPlaceHolder.init();    
});