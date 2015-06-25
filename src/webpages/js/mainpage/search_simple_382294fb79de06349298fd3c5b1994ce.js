var i = 0;
function isEmpty(value) {
	var pattern = /(^\s*$)/;
	var result = pattern.test(value);
	return result;
}
function isEmptyString(value) {
	if (value == null) {
		return true;
	}
	value = value.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
	if (value == "") {
		return true;
	} else {
		return false;
	}
}
function isAlphaNumber(value) {
	var pattern = /(^\w+$)/;
	var result = pattern.test(value);
	return result;
}
function isNumber(value) {
	var pattern = /(^\d+$)/;
	var result = pattern.test(value);
	return result;
}
function isDecimalNumber(value) {
	var pattern = /(^\d+$)|(^\d*\.\d{1,2}$)/;
	var result = pattern.test(value);
	return result;
}
function isValidPrice(value) {
	var pattern = /(^\d{0,5}$)|(^\d{0,5}\.\d{1,2}$)/;
	var result = pattern.test(value);
	return result;
}
function isChecked(frmObj) {
	if (!frmObj.length) {
		if (frmObj.checked) {
			return true;
		}
	} else {
		for (i = 0; i < frmObj.length; i++) {
			if (frmObj[i].checked) {
				return true;
			}
		}
	}
	return false;
}
function doReselect(frmElement, value) {
	for (i = 0; i < frmElement.length; i++) {
		if (frmElement.options[i].value == value) {
			frmElement.options[i].selected = true;
			return true;
		}
	}
	return false;
}
function doReselectText(frmElement, text) {
	for (i = 0; i < frmElement.length; i++) {
		if (frmElement.options[i].text == text) {
			frmElement.options[i].selected = true;
			return true;
		}
	}
	return false;
}
function doSelectAll(frmObj) {
	for ( var i = 0; i < frmObj.length; i++) {
		if (frmObj.elements[i].type == "checkbox") {
			frmObj.elements[i].checked = true;
		}
	}
}
function doSelectAllItems(frmElement) {
	for ( var i = 0; i < frmElement.length; i++) {
		frmElement[i].selected = true;
	}
}
function doSelectAllItemsToggle(frmElement, trueFalse) {
	for ( var i = 0; i < frmElement.length; i++) {
		frmElement[i].selected = trueFalse;
	}
}
function doAddOptionItem(frmElement, optName, optValue, defaultSelected,
		selected) {
	frmElement.options[frmElement.options.length] = new Option(optName,
			optValue, defaultSelected, selected);
}
function doDeleteOptionItems(frmElement) {
	var optionsLength = frmElement.options.length;
	for (i = 0; i < optionsLength; i++) {
		frmElement.options[0] = null;
	}
}
function doDisableCheckBoxes(frmObj, checkBoxList, updateValue) {
	checkBoxList = checkBoxList.split(";");
	for (i = 0; i < checkBoxList.length; i++) {
		frmElement = eval("frmObj." + checkBoxList[i]);
		frmElement.disabled = updateValue;
		frmElement.checked = updateValue;
	}
}
function doLoadCheckBoxSelections(frmObj, checkBoxList, updateValue) {
	checkBoxList = checkBoxList.split(";");
	for (i = 0; i < checkBoxList.length; i++) {
		if (checkBoxList[i]) {
			frmElement = eval("frmObj." + checkBoxList[i]);
		} else {
			continue;
		}
		frmElement.disabled = updateValue;
		if (updateValue) {
			frmElement.checked = updateValue;
		}
	}
}
function doSetCheckBoxSelection(frmObj, checkBoxName, updateValue) {
	frmElement = eval("frmObj." + checkBoxName);
	frmElement.checked = updateValue;
}
function NameSorter(paramA, paramB) {
	var result = 0;
	if (paramA.name && paramB.name) {
		if (paramA.name == "All" || paramB.name == "All") {
			result = (paramA.name == "All") ? -1 : 1;
		} else {
			result = ((paramA.name < paramB.name) ? -1
					: ((paramA.name > paramB.name) ? 1 : 0));
		}
	}
	return result;
}
function setValue(frmObj, elementName, elementValue) {
	frmElement = eval(frmObj + "." + elementName);
	if (frmElement) {
		frmElement.value = elementValue;
	}
}
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [ curleft, curtop ];
}
var LOG_ACTIVITY = "/iv/logActivity.do";
function doOpenWindow(URL, name, attributes) {
	setTimeout('logActivity("URL=' + URL + '")', 1000);
	newWindow = window.open(URL, name, attributes);
}
function logThisClick(fromPage, clickedPoint) {
	setTimeout('logActivity("from=' + fromPage + "&clickedPoint="
			+ clickedPoint + '")', 1000);
}
function logActivity(params) {
	var jsessionid = "";
	if (params.indexOf(";jsessionid=") != -1) {
		var start = params.indexOf(";jsessionid=") + 12;
		var end = (params.indexOf("?") != -1) ? params.indexOf("?")
				: params.length;
		jsessionid = params.substring(start, end);
	} else {
		jsessionid = getCookie("JSESSIONID");
	}
	Spry.Utils.loadURL("GET", LOG_ACTIVITY + ";jsessionid=" + jsessionid + "?"
			+ escape(params), true);
}
function encodeSingleQuotes(str) {
	str = str.replace(/'/g, "%27");
	return str;
}
function doOpenExtWindow(URL, tWidth, tHeight, track, trackUrl) {
	URL = URL.replace(/&amp;/g, "&");
	URL = URL.replace(/"/g, "%22");
	var name = "extWindow";
	if (arguments[3] == "newwindow") {
		name = arguments[3];
	}
	var attributes = "toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width="
			+ tWidth + ",height=" + tHeight;
	extWindow = window.open(URL, name, attributes);
	if (typeof track === "boolean") {
		if (track) {
			iv.util.logUserActivity(trackUrl);
		}
	}
	extWindow.focus();
}
function doOpenExtTerritoryWindow(URL, tWidth, tHeight, loctarget) {
	URL = URL.replace(/&amp;/g, "&");
	URL = URL.replace(/"/g, "%22");
	var attributes = "toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width="
			+ tWidth + ",height=" + tHeight;
	var extWindow = window.open(URL, loctarget, attributes);
	setTimeout('logActivity("URL=' + URL + '")', 1000);
	extWindow.focus();
}
function doLaunchLinkedIn(companyName) {
	companyName = companyName.replace(/\(\w*\)/g, "");
	companyName = companyName
			.replace(
					/(\bASA\b)|(\bCompanies\b)|(\bCompany\b)|(\bGroup\b)|(\bGrp\b)|(\bGrupo\b)|(\bGruppo\b)|(\bHolding\b)|(\bHoldings\b)|(\/NY\b)|(\bIndustries\b)|(\bKoninklijke\b)|(\bN\.V\.)|(\bNV\b)|(\bPart\.)|(\bParticipacoes\b)|(\bSGPS\b)/gi,
					"");
	companyName = companyName.replace(/\s\s*/g, " ");
	companyName = companyName.replace(/(^\s*)|(\s*$)/g, "");
	companyName = '"' + companyName + '"';
	companyName = escape(companyName);
	URL = "http://www.linkedin.com/search?search=&company=" + companyName
			+ "&currentCompany=co";
	var name = "linkedInWindow";
	var attributes = "toolbar=yes,location=yes,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=810,height=740";
	linkedInWindow = window.open(URL, name, attributes);
	setTimeout('logActivity("action=launchLinkedIn&companyName='
			+ escape(companyName) + '")', 1000);
	linkedInWindow.focus();
}
function doLaunchLinkedInPerson(firstName, lastName, companyName) {
	personName = firstName + " " + lastName;
	firstName = escape(firstName);
	lastName = escape(lastName);
	companyName = companyName.replace(/\(\w*\)/g, "");
	companyName = companyName
			.replace(
					/(\bASA\b)|(\bCompanies\b)|(\bCompany\b)|(\bGroup\b)|(\bGrp\b)|(\bGrupo\b)|(\bGruppo\b)|(\bHolding\b)|(\bHoldings\b)|(\/NY\b)|(\bIndustries\b)|(\bKoninklijke\b)|(\bN\.V\.)|(\bNV\b)|(\bPart\.)|(\bParticipacoes\b)|(\bSGPS\b)/gi,
					"");
	companyName = companyName.replace(/\s\s*/g, " ");
	companyName = companyName.replace(/(^\s*)|(\s*$)/g, "");
	companyName = '"' + companyName + '"';
	companyName = escape(companyName);
	URL = "http://www.linkedin.com/search?search=&lname=" + lastName
			+ "&company=" + companyName + "&fname=" + firstName
			+ "&currentCompany=cp";
	var name = "linkedInWindow";
	var attributes = "toolbar=yes,location=yes,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=810,height=740";
	linkedInWindow = window.open(URL, name, attributes);
	setTimeout('logActivity("action=launchLinkedInPerson&companyName='
			+ escape(companyName) + "&personName=" + escape() + '")', 1000);
	linkedInWindow.focus();
}
function doLaunchJigsaw(lastName, firstName, companyName) {
	firstName = escape(firstName);
	lastName = escape(lastName);
	companyName = escape(companyName);
	URL = "http://www.jigsaw.com/SearchAcrossCompanies.xhtml?opCode=search&cnName="
			+ lastName + "&cnFirstName=" + firstName + "&cmName=" + companyName;
	doOpenExtWindow(URL, 1050, 510);
}
function doLaunchGoogle(searchString) {
	searchString = escape(searchString);
	URL = "http://www.google.com/search?q=" + searchString;
	doOpenExtWindow(URL, 800, 510);
}
function doPageSelection(frmObj, methodName, pageNum) {
//	frmObj.methodName.value = methodName;
//	frmObj.pageNum.value = pageNum;
//	frmObj.submit();
	
	var text = $("#searchbox").attr("value");
	if(methodName == "showNextSectionForCompanies" || methodName=="showCompanyPage"){
		var SearchResultsForMan = new SearchResultsForModel().init(text,pageNum,"all"); 
	}else if(methodName == "showNextPageForGlobalSearch"){
		var SearchResultsForPeopleMan = new SearchResultsForPeopleModel().init(text,pageNum,"all"); 
	}else{}
}
function doLoadSavedSearch(frmElement, frmObj, frmAction, methodName) {
	frmObj.action = frmAction;
	frmObj.methodName.value = methodName;
	frmObj.searchName.value = frmElement[frmElement.selectedIndex].value;
	frmObj.submit();
}
function doLoadCustomRangeFields(frmElement, frmElementOldValue, frmObj,
		methodName) {
	if (frmElement[frmElement.selectedIndex].value == "CustomRange") {
		frmObj.methodName.value = methodName;
		frmObj.submit();
	} else {
		if (frmElementOldValue == "CustomRange") {
			frmObj.methodName.value = methodName;
			frmObj.submit();
		}
	}
}
function refreshPage(parameterKey, parameterValue) {
	var parameter = parameterKey + "=" + parameterValue;
	var searchString = window.location.search;
	if (searchString != "") {
		if (searchString.indexOf("help=") != -1) {
			searchString = searchString.substring(0, searchString
					.indexOf("help="))
					+ parameter
					+ searchString.substring(searchString.indexOf("help=") + 9,
							searchString.length);
		} else {
			searchString = searchString + "&" + parameter;
		}
	} else {
		searchString = "?" + parameter;
	}
	var jsessionid = "";
	var jsessionid_position = window.location.href.indexOf(";jsessionid=");
	if ((jsessionid_position != -1)
			&& window.location.pathname.indexOf(";jsessionid=") == -1) {
		if (window.location.search) {
			jsessionid = window.location.href.substring(jsessionid_position,
					window.location.href.indexOf(window.location.search));
		} else {
			if (window.location.hash) {
				jsessionid = window.location.href.substring(
						jsessionid_position, window.location.href
								.indexOf(window.location.hash));
			} else {
				jsessionid = window.location.href
						.substring(jsessionid_position);
			}
		}
	}
	window.location.href = window.location.protocol + "//"
			+ window.location.host + window.location.pathname + jsessionid
			+ searchString + window.location.hash;
}
function setCookie(name, value, expires, path, domain, secure) {
	document.cookie += name + "=" + escape(value)
			+ ((expires) ? "; expires=" + expires.toGMTString() : "")
			+ ((path) ? "; path=" + path : "")
			+ ((domain) ? "; domain=" + domain : "")
			+ ((secure) ? "; secure" : "");
}
function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) {
			return null;
		}
	} else {
		begin += 2;
	}
	var end = document.cookie.indexOf(";", begin);
	if (end == -1) {
		end = dc.length;
	}
	return unescape(dc.substring(begin + prefix.length, end));
}
function MM_findObj(n, d) {
	var p, i, x;
	if (!d) {
		d = document;
	}
	if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
		d = parent.frames[n.substring(p + 1)].document;
		n = n.substring(0, p);
	}
	if (!(x = d[n]) && d.all) {
		x = d.all[n];
	}
	for (i = 0; !x && i < d.forms.length; i++) {
		x = d.forms[i][n];
	}
	for (i = 0; !x && d.layers && i < d.layers.length; i++) {
		x = MM_findObj(n, d.layers[i].document);
	}
	if (!x && d.getElementById) {
		x = d.getElementById(n);
	}
	return x;
}
function doToggleImageOpen(imgObj, isOpen) {
	if (isOpen) {
		imgObj.src = imgObj.src.substring(0, imgObj.src.indexOf(".gif") - 2)
				+ "_0.gif";
	} else {
		imgObj.src = imgObj.src.substring(0, imgObj.src.indexOf(".gif") - 2)
				+ "_1.gif";
	}
}
function doToggleDisplay(objName, isOpen) {
	if ((obj = MM_findObj(objName)) != null) {
		if (obj.style) {
			obj = obj.style;
		}
		if (isOpen) {
			obj.display = "none";
		} else {
			obj.display = "block";
		}
	}
}
function mappingObj(value, layer) {
	this.value = value;
	this.layer = layer;
}
function doToggleDisplay_mappingArray(mappingArray, selectValue) {
	for (i = 0; i < mappingArray.length; i++) {
		var isOpen = (selectValue == mappingArray[i].value) ? false : true;
		doToggleDisplay(mappingArray[i].layer, isOpen);
	}
}
function doToggleObjDisplay(objName, isOpen, isExpandAllToggle) {
	var imgObj = eval("document.images['IMG_" + objName + "']");
	if (!!imgObj) {
		if (isOpen == undefined) {
			if (imgObj.src.indexOf("_1.gif") != -1) {
				isOpen = true;
			} else {
				isOpen = false;
			}
		}
		doToggleImageOpen(imgObj, isOpen);
		doToggleDisplay(objName, isOpen);
	}
}
function doToggleDurationDisplay(durationValue) {
	doToggleDisplay("activity_duration_read", true);
	doToggleDisplay("activity_duration_write", false);
	doReselectText(document.forms.analyzeSettingsForm.duration, durationValue);
	document.forms.analyzeSettingsForm.duration.focus();
}
function doApplyDuration(frmElement, frmObj, methodName) {
	frmObj.duration.value = frmElement[frmElement.selectedIndex].value;
	frmObj.submit();
}
function getBrowserHeight() {
	var intH = 0;
	var intW = 0;
	if (typeof window.innerWidth == "number") {
		intH = window.innerHeight;
		intW = window.innerWidth;
	} else {
		if (document.documentElement
				&& (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			intH = document.documentElement.clientHeight;
			intW = document.documentElement.clientWidth;
		} else {
			if (document.body
					&& (document.body.clientWidth || document.body.clientHeight)) {
				intH = document.body.clientHeight;
				intW = document.body.clientWidth;
			}
		}
	}
	return {
		width : parseInt(intW),
		height : parseInt(intH)
	};
}
function setLayerPosition() {
	var shadow = document.getElementById("shadow");
	var question = document.getElementById("question");
	var bws = getBrowserHeight();
	if (shadow != null) {
		shadow.style.width = bws.width + "px";
		shadow.style.height = bws.height + "px";
	}
	if (question != null) {
		question.style.left = parseInt((bws.width - 350) / 2) + "px";
		question.style.top = parseInt((bws.height - 200) / 2) + "px";
	}
	shadow = null;
	question = null;
}
function showLayer() {
	setLayerPosition();
	var shadow = document.getElementById("shadow");
	var question = document.getElementById("question");
	if (shadow != null) {
		shadow.style.display = "block";
	}
	if (question != null) {
		question.style.display = "block";
	}
	shadow = null;
	question = null;
}
function hideLayer() {
	var shadow = document.getElementById("shadow");
	var question = document.getElementById("question");
	if (shadow != null) {
		shadow.style.display = "none";
	}
	if (question != null) {
		question.style.display = "none";
	}
	shadow = null;
	question = null;
}
window.onresize = setLayerPosition;
function showview() {
	document.getElementById("brand").style.display = "block";
}
function closeview() {
	document.getElementById("brand").style.display = "none";
}
function toggleDiv(showdivId, hidesdivId) {
	$("#" + hidesdivId).hide();
	$("#" + showdivId).show();
	return false;
}
function showHSPopup(obj, fromPage, clickedPoint) {
	if (typeof iv !== "undefined") {
		if (typeof iv.util !== "undefined") {
			iv.util.logUserActivity("/" + fromPage + "-" + clickedPoint);
		}
	}
	hs.htmlExpand(obj, {
		contentId : clickedPoint
	});
}
