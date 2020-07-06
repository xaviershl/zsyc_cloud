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

function getCookie(cookieKey){
	var cookieValue = $.cookie(cookieKey);
	if(cookieValue==null){
		cookieValue = "";
	}
	return cookieValue;
}

function deleteCookie(cookieKey){
	$.cookie(cookieKey,null,
		{
			path : '/'
		}
	);
}

function getCookie(cookieKey){
	var cookieValue = $.cookie(cookieKey);
	if(cookieValue==null){
		cookieValue = "";
	}
	return cookieValue;
}

function addYuyueLoginCookie(apikey,days){
	if(days==0){
		$.cookie('LOGIN_KEY',apikey, 
			{
				path : '/'
			}
		);
	}else{
		$.cookie('LOGIN_KEY',apikey, 
			{
				expires : days,
				path : '/'
			}
		);
	}
}

function deleteYuyueLoginCookie(){
	$.cookie('LOGIN_KEY',null,
		{
			path : '/'
		}
	);
}

