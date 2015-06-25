function extend(B, A){
    function I(){};
    I.prototype = A.prototype;
    B.prototype = new I;
    B.prototype.constructor = B;
};

if (typeof($.isArray)!='function')
{
	$.isArray = function( obj ) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	}	
}


//==================================================================================
//Data Exchange with Server
function WS_GET(url){ return "GET " + url; };
function WS_PUT(url){ return "PUT " + url; };
function WS_POST(url){ return "POST " + url; };
function WS_DELETE(url){ return "DELETE " + url; };
var REQUEST_TIMEOUT = 60000;	
var SYNC_MODE = 1;
function requestWebService(cmdStr, pathParams, queryParams, callback, para, syncFlag)
{
	var asyncMode = true;
	if (syncFlag==SYNC_MODE){
		asyncMode = false;
	}

	timeout = REQUEST_TIMEOUT;
	
	var requestURLPos = cmdStr.indexOf(" ");
	if (requestURLPos == -1)
		return null;
	var requestURL = cmdStr.substr(requestURLPos+1);
	var requestType = cmdStr.substr(0, requestURLPos);
	if (pathParams){
		if ($.isArray(pathParams)){
			if (pathParams.length>0){
				for (var i=0; i<pathParams.length; i++){
					requestURL = requestURL.replace("$"+(i+1), pathParams[i]);
				}
			}
		}
		else
		{
			requestURL = requestURL.replace("$1",pathParams);
		}
	}
	
	if (requestURL.indexOf("?") == -1)
		requestURL += "?";
	else
		requestURL += '&';
	if (queryParams){
		requestURL += queryParams + '&';
	}
	
	requestURL += "RID=" + requestId;
	requestId++;

	var dataRequest = null;
	
	if (para)
	{
		if (typeof(para)==="string")
		{
			para = ""+para;
			var len = para.length;
			if (requestType == "GET")
			{
				requestURL +=  "&para=" + encodeURIComponent(para);
			}
			else
			{
				dataRequest = {"para":para}; 
			}
		}
		else
		{
			dataRequest = JSON.stringify(para);
		}
	}
	return $.ajax({
		url: requestURL,
		async: asyncMode,
		cache: false,
		type: requestType,
		data: dataRequest,
		dataType: "json",
		contentType: "application/json; charset=UTF-8", 
		beforeSend: function(XMLHttpRequest){
			$("#loading").show();
		},
		timeout: timeout,
		complete: ajax_completeHandler,
		success: function(json){
			parseResponse(json, callback);   	
		},
		error: ajax_errorHandler
	});
}
