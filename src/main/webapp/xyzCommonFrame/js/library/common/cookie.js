function getLoginCookie(){
	var cookieValue = $.cookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc');
	if(cookieValue==null){
		cookieValue = "";
	}
	return cookieValue;
}

function getCookie(key){
	var cookieValue = $.cookie(key);
	if(cookieValue==null){
		cookieValue = "";
	}
	return cookieValue;
}

function addCookie(cookieKey,cookieValue,days){
    if(days==0){
        $.cookie(cookieKey,cookieValue,
            {
                path : '/'
            }
        );
    }else{
        $.cookie(cookieKey,cookieValue,
            {
                expires : days,
                path : '/'
            }
        );
    }
}

function deleteLoginCookie(){
	$.cookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc',null,
		{
			path : '/'
		}
	);
}

function setLoginCookie(zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc){
	$.cookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc',zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc);
}

function addLoginCookie(zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc,days){
	if(days==0){
		$.cookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc',zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc, 
			{
				path : '/'
			}
		);
	}else{
		$.cookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc',zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc, 
			{
				expires : days,
				path : '/'
			}
		);
	}
}

function addI18nCookie(iiiiiiiiiiiiiiiiiiiiii, days){
	if(days==0){
		$.cookie('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii',iiiiiiiiiiiiiiiiiiiiii, 
			{
				path : '/'
			}
		);
	}else{
		$.cookie('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii',iiiiiiiiiiiiiiiiiiiiii, 
			{
				expires : days,
				path : '/'
			}
		);
	}
}

function getI18nCookie(){
	var cookieValue = $.cookie('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
	if(cookieValue==null){
		cookieValue = "";
	}
	return cookieValue;
}

function deleteI18nCookie(){
	$.cookie('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii',null,
		{
			path : '/'
		}
	);
}