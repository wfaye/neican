function registerNS(ns) {
    var nsParts = ns.split(".");
    var root = window;
    for (var i = 0; i < nsParts.length; i++) {
        if (typeof root[nsParts[i]] == "undefined") {
            root[nsParts[i]] = new Object();
        }
        root = root[nsParts[i]];
    }
}

function createInhertiance(subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
Array.prototype.forEach = function (fn, thisObj) {
    if (typeof fn === "undefined") {
        return;
    }
    var scope = thisObj || window;
    for (var i = 0, j = this.length; i < j; ++i) {
        fn.call(scope, this[i], i, this);
    }
};
Array.prototype.filter = function (fn, thisObj) {
    var scope = thisObj || window;
    var a = [];
    if (typeof fn === "undefined") {
        return a;
    }
    for (var i = 0, j = this.length;
    i < j; ++i) {
        if (!fn.call(scope, this[i], i, this)) {
            continue;
        }
        a.push(this[i]);
    }
    return a;
};

function Observer() {}
Observer.prototype = {
    subscribe: function (f, scope) {
        if (typeof this.subscribers === "undefined") {
            this.subscribers = [];
        }
        if (typeof scope === "object") {
            this.subscribers.push(_.bind(f, scope));
        } else {
            this.subscribers.push(f);
        }
    },
    unsubscribe: function (f) {
        if (typeof this.subscribers === "undefined") {
            this.subscribers = [];
        }
        this.subscribers = this.subscribers.filter(function (el) {
            if (el != f) {
                return el;
            }
        });
    },
    fireEvent: function (event, data, thisObj) {
        if (typeof this.subscribers === "undefined") {
            this.subscribers = [];
        }
        scope = thisObj || window;
        this.subscribers.forEach(function (el) {
            el(event, data);
        });
    }
};
registerNS("iv");
iv = {
    isMashup: false,
    isSmallMashup: false,
    setProperties: function () {
        if ($(document.body)) {
            if ($(document.body).hasClass("iv-mashup-screen")) {
                this.isMashup = true;
                if ($(document.body).hasClass("iv-mashup-small")) {
                    this.isSmallMashup = true;
                }
            }
        }
    },
    fixSideBar: function () {
        if ($("#side-bar-center")) {
            $("#side-bar-center").height($("#global-menu-bar").height() + $("#main-container").height());
        }
    },
    showAllTrainingVideos: function () {
        $("#training-panel .hidden-training-vids").show();
        $(".training-view-all").hide();
    },
    onLoadProcesses: [],
    onDomReadyProcesses: [],
    onAfterLoadProcessesTriggered: false,
    onAfterOnLoadProcesses: [],
    processAfterOnLoad: function (fn) {
        if (!this.onAfterLoadProcessesTriggered) {
            if (typeof fn === "function") {
                this.onAfterOnLoadProcesses[this.onAfterOnLoadProcesses.length] = fn;
            } else {
                alert("you can register only functions as onload processes ");
                return false;
            }
        } else {
            if (this.onAfterLoadProcessesTriggered) {
                if (typeof fn === "function") {
                    fn();
                } else {
                    alert("you can register only functions as onload processes ");
                    return false;
                }
            }
        }
    },
    processOnLoad: function (fn) {
        if (typeof fn === "function") {
            this.onLoadProcesses[this.onLoadProcesses.length] = fn;
        } else {
            alert("you can register only functions as onload processes ");
            return false;
        }
    },
    processOnDomReady: function (fn) {
        if (typeof fn === "function") {
            this.onDomReadyProcesses[this.onDomReadyProcesses.length] = fn;
        } else {
            alert("you can register only functions as dom ready processes ");
            return false;
        }
    },
    triggerAfterOnLoadProcesses: function () {
        _.each(this.onAfterOnLoadProcesses, function (fn) {
            fn();
        });
        this.onAfterLoadProcessesTriggered = true;
    },
    triggerOnLoadProcesses: function () {
        if (typeof timerData != "undefined") {
            timerData.onLoad_Time = new Date();
        }
        _.each(this.onLoadProcesses, function (fn) {
            fn();
        });
        if (typeof timerData != "undefined") {
            timerData.onLoad_tasks_ends = new Date();
            iv.timer.collectData();
        }
        this.triggerAfterOnLoadProcesses();
    },
    triggerDomReadyProcesses: function () {
        if (typeof timerData != "undefined") {
            timerData.domReady_event = new Date();
        }
        _.each(this.onDomReadyProcesses, function (fn) {
            try {
                fn();
            } catch (e) {
                if (typeof console !== "undefined") {
                    console.info("issue in dom ready process");
                    console.error(e);
                }
            }
        });
        if (typeof timerData != "undefined") {
            timerData.domReady_tasks_ends = new Date();
        }
    },
    initIvSetup: function () {
        if (document.getElementById("ivSetup") && iv.user.data.setupMap && !_.isEmpty(iv.user.data.setupMap)) {
            var theme = "original";
            if (iv.user && iv.user.data && iv.user.data.theme && iv.user.data.theme != "") {
                theme = iv.user.data.theme;
            }
            iv.util.require([iv.ui.getTemplate("commonRequires." + theme + ".ivSetupCss"), iv.ui.getTemplate("commonRequires.ivSetupRenderer"), iv.ui.getTemplate("commonRequires.ivSetupController")], function () {
                iv.setup.controller.init({
                    selector: "#ivSetup"
                });
            });
        }
    },
    initMenus: function () {
        menuInstanceMap = {};
        var menus = $("ul.menu");
        for (var i = menus.length - 1; i >= 0; i--) {
            var elem = menus[i];
            menuInstanceMap[elem.id] = new menu.dd("menuInstanceMap." + elem.id);
            menuInstanceMap[elem.id].init(elem.id, "menuhover");
        }
    },
    setupBackToTop: function () {
        if (!iv.isMashup && typeof $.fn.autoscroll != "undefined") {
            $(window).autoscroll({
                threshold: 0,
                needBackToTop: true,
                scrollEventName: "DEFAULT_PAGE_SCROLL"
            });
        }
    },
    ssoContextHandler: function () {
        var elem = $(this);
        if (!elem.data("ssoContextEnabled")) {
            var newURL = iv.getSSOUrl(elem.attr("href"));
            elem.attr("href", newURL);
            elem.data("ssoContextEnabled", true);
        }
    },
    getSSOUrl: function (elemHref) {
        try {
            if (elemHref.indexOf("javascript:") >= 0 || elemHref.indexOf("#") >= 0) {
                return elemHref;
            }
            var hrefComponents = elemHref.split("#");
            var pathNameComponents = hrefComponents[0].split("?");
            var newURL = pathNameComponents[0];
            newURL += "?contextHash=" + crmHashSuffix;
            if (pathNameComponents.length > 1) {
                for (var i = 1; i < pathNameComponents.length; i++) {
                    if (i > 1) {
                        newURL += "?";
                    }
                    if (i == 1) {
                        newURL += "&";
                    }
                    newURL += pathNameComponents[i];
                }
            }
            if (hrefComponents.length > 1) {
                for (var i = 1; i < hrefComponents.length; i++) {
                    newURL += "#" + pathNameComponents[i];
                }
            }
            return newURL;
        } catch (e) {
            return elemHref;
        }
    },
    enableSSOContext: function () {
        if (typeof crmHashSuffix != "undefined" && crmHashSuffix != "") {
            $("a").die("mousedown", iv.ssoContextHandler);
            $("a").live("mousedown", iv.ssoContextHandler);
            if (typeof window.open_ == "undefined" && typeof iv.util != "undefined") {
                window.open_ = window.open;
                window.open = function (url, name, props) {
                    var params = iv.util.getURLParams(url);
                    if (typeof params["contextHash"] == "undefined") {
                        url = iv.getSSOUrl(url);
                    }
                    return window.open_(url, name, props);
                };
            }
        }
    }
};
iv.processOnDomReady(function () {
    iv.fixSideBar();
    iv.setProperties();
});
$(document).ready(function () {
    iv.triggerDomReadyProcesses();
});
$(window).load(function () {
    iv.triggerOnLoadProcesses();
});
var menuInstanceMap = {};
iv.processOnDomReady(iv.initMenus);
iv.processOnLoad(iv.initIvSetup);
iv.processOnDomReady(iv.setupBackToTop);
iv.processOnDomReady(iv.enableSSOContext);
registerNS("iv.application.data");
registerNS("iv.user.data");
registerNS("iv.hub");
iv.hub = {
    map: {},
    hasEvent: function (eventName) {
        if (typeof this.map[eventName] === "undefined") {
            return false;
        } else {
            return true;
        }
    },
    addEvent: function (eventName) {
        this.map[eventName] = [];
    },
    flushEvent: function (eventName) {
        if (this.hasEvent(eventName)) {
            this.map[eventName] = [];
        }
    },
    registerNewEvent: function (eventName, enforceFlush) {
        if (typeof enforceFlush !== "undefined") {
            if (enforceFlush === true) {
                this.flushEvent(eventName);
            }
        }
        if (!this.hasEvent(eventName)) {
            this.addEvent(eventName);
        }
    },
    addSubscription: function (eventName, eventSubscriber, subscriberScope) {
        this.map[eventName].push({
            f: eventSubscriber,
            s: subscriberScope
        });
    },
    subscribeToEvent: function (eventName, eventSubscriber, subscriberScope) {
        if (!this.hasEvent(eventName)) {
            this.addEvent(eventName);
        }
        var scope = this,
            cb;
        if (typeof subscriberScope !== "undefined") {
            scope = subscriberScope;
        }
        if (typeof eventSubscriber == "function") {
            cb = eventSubscriber;
        } else {
            if (typeof console !== "undefined") {
                if (typeof console.error !== "undefined") {
                    console.error("pass a registeration callback function");
                }
            } else {
                alert("pass a registeration callback function");
            }
            return false;
        }
        this.addSubscription(eventName, cb, scope);
    },
    publishEvent: function (eventName, eventData) {
        if (!this.hasEvent(eventName)) {
            this.addEvent(eventName);
        }
        if (this.hasEvent(eventName)) {
            var eObj = {
                "eventName": eventName,
                "eventData": eventData
            };
            var $this = this;
            _.each(this.map[eventName], function (ev) {
                $this.triggerEvent(eObj, ev);
            });
        }
    },
    triggerEvent: function (ev, targ) {
        targ.f.call(targ.s, ev);
    }
};
var pipeClass = function (params) {
    var $this = this;
    this.data = params.data;
    this.type = params.type;
    this.method = typeof params.method != "undefined" ? params.method : "GET";
    this.dataSource = params.dataSource;
    this.requestId = 0;
    this.publishDataEvents = params.publishDataEvents;
    _.each(this.publishDataEvents, function (ev) {
        iv.hub.registerNewEvent(ev);
    });
    this.eventData = {};
    this.fetchDataEvents = params.fetchDataEvents;
    this.handleFetchDataEvent = function () {
        this.requestId++;
        var currentId = this.requestId;
        var config = {
            resource: this.dataSource,
            urlParams: this.eventData,
            success: function (resp) {
                if (currentId == $this.requestId) {
                    $this.publishEvent(resp);
                }
            },
            error: function (resp) {
                if (currentId == $this.requestId) {
                    $this.publishEvent(resp);
                }
            }
        };
        if (this.method == "POST") {
            config.responseType = "json";
            iv.api.doPost(config);
        } else {
            iv.api.getJson(config);
        }
    };
    _.each(this.fetchDataEvents, function (obj, key) {
        iv.hub.subscribeToEvent(obj.key, function (event) {
            if (typeof obj.customHandler !== "undefined") {
                obj.customHandler.call(this, event);
            } else {
                this.eventData = event.eventData;
            }
            this.handleFetchDataEvent();
        }, $this);
    });
    this.publishEvent = function (eventData) {
        _.each(this.publishDataEvents, function (event) {
            iv.hub.publishEvent(event, eventData);
        });
    };
};
registerNS("iv.ui");
iv.ui = {
    templates: (new templateRepository).templates,
    getTemplate: function (k) {
        var s = k.split(".");
        var sl = s.length;
        var t = null;
        t = this.templates;
        for (var i = 0; i < sl; i++) {
            t = t[s[i]];
            if (typeof t === "undefined") {
                alert("Template undefined for key " + k);
                break;
            }
        }
        if (typeof t !== "null" && typeof t !== "undefined") {
            return t;
        }
    },
    addTemplate: function (k, t) {
        this.templates[k] = t;
    },
    setTemplate: function (k, t) {
        this.templates[k] = t;
    }
};
registerNS("iv.util");
iv.util = {
    AC_CACHE_SIZE: 30,
    urls: {
        logActivity: "/iv/logActivity.do"
    },
    attachUpgradeLinkEvents: function () {
        $("body").delegate("a.upgradeStopPoint", "click", function () {
            var key_name = $(this).attr("name");
            iv.stopPoint.logClickedPoints(key_name);
        });
    },
    logUserActivity: function (url, data) {
        window.setTimeout(function () {
            iv.util._logActivity(url, data);
        }, 200);
    },
    trackToMarketo: function (type, url) {
        window.setTimeout(function () {
            mktoMunchkinFunction(type, {
                "href": url
            });
        }, 200);
    },
    _logActivity: function (url, data) {
        var logUrls = [];
        if (typeof url === "string") {
            logUrls.push(url);
        } else {
            logUrls = url;
        }
        var urlParams = {};
        urlParams.URL = "";
        if (typeof url !== "undefined") {
            urlParams.URL = logUrls.join("|");
        }
        if (typeof data !== "undefined" && typeof data === "object") {
            if (typeof urlParams.URL != "undefined") {
                $.extend(urlParams, data);
            } else {
                urlParams = data;
            }
        }
        urlParams._now = (new Date()).getTime();
        iv.api.userAction.getContent({
            resource: this.urls.logActivity,
            urlParams: urlParams
        });
    },
    encodeSingleQuotes: function (str) {
        str = str.replace(/'/g, "%27");
        return str;
    },
    encodeAngledBracesInText: function (str) {
        str = str.replace(/\<b/g, "&lt;b").replace(/\<\/b/g, "&lt;/b").replace(/\<a href/g, "&lt;a href").replace(/\<a target/g, "&lt;a target").replace(/\<a style/g, "&lt;a style").replace(/\<\/a/g, "&lt;/a").replace(/</g, "-");
        str = iv.util.decodeHTML(str);
        return str;
    },
    encodeHTML: function (text) {
        $("body").append('<div id="utilDiv" style="display:none;"></div>');
        var encodedText = $("#utilDiv").text(text).html();
        $("#utilDiv").remove();
        return encodedText;
    },
    decodeHTML: function (text) {
        $("body").append('<div id="utilDiv" style="display:none;"></div>');
        var decodedText = $("#utilDiv").html(text).text();
        $("#utilDiv").remove();
        return decodedText;
    },
    trackIt: function (id, url) {
        iv.api.userAction.getHtmlContent({
            resource: url,
            target: $("#add_" + id),
            postLoad: function () {
                iv.initMenus();
            }
        });
    },
    idCounter: 0,
    getUniqueId: function () {
        this.idCounter++;
        return this.idCounter;
    },
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    setCaretToPos: function (input, pos) {
        this.setSelectionRange(input, pos, pos);
    },
    setSelectionRange: function (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        } else {
            if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd("character", selectionEnd);
                range.moveStart("character", selectionStart);
                range.select();
            }
        }
    },
    doOpenExtWindow: function (URL, tWidth, tHeight, track, trackUrl) {
        URL = URL.replace(/&amp;/g, "&");
        URL = URL.replace(/"/g, "%22");
        var name = "extWindow";
        if (arguments[3] == "newwindow") {
            name = arguments[3];
        }
        var attributes = "toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + tWidth + ",height=" + tHeight;
        extWindow = window.open(URL, name, attributes);
        if (typeof track === "boolean") {
            if (track) {
                iv.util.logUserActivity(trackUrl);
            }
        }
        extWindow.focus();
    },
    getFieldOperatorMap: function () {
        return {
            "boolean": [{
                "label": "Equals",
                "value": "eq"
            }],
            "datetime": [{
                "label": "Greater than",
                "value": "gt"
            }, {
                "label": "Greater than or equal to",
                "value": "gte"
            }, {
                "label": "Less than",
                "value": "lt"
            }, {
                "label": "Less than or equal to",
                "value": "lte"
            }],
            "date": [{
                "label": "Greater than",
                "value": "gt"
            }, {
                "label": "Greater than or equal to",
                "value": "gte"
            }, {
                "label": "Less than",
                "value": "lt"
            }, {
                "label": "Less than or equal to",
                "value": "lte"
            }],
            "number": [{
                "label": "Equals",
                "value": "eq"
            }, {
                "label": "Does not equal",
                "value": "noteq"
            }, {
                "label": "Greater than",
                "value": "gt"
            }, {
                "label": "Greater than or equal to",
                "value": "gte"
            }, {
                "label": "Less than",
                "value": "lt"
            }, {
                "label": "Less than or equal to",
                "value": "lte"
            }],
            "currency": [{
                "label": "Equals",
                "value": "eq"
            }, {
                "label": "Does not equal",
                "value": "noteq"
            }, {
                "label": "Greater than",
                "value": "gt"
            }, {
                "label": "Greater than or equal to",
                "value": "gte"
            }, {
                "label": "Less than",
                "value": "lt"
            }, {
                "label": "Less than or equal to",
                "value": "lte"
            }],
            "multipicklist": [{
                "label": "Equals",
                "value": "eq"
            }, {
                "label": "Does not equal",
                "value": "noteq"
            }, {
                "label": "Contains",
                "value": "multipicklist_con"
            }, {
                "label": "Does not contain",
                "value": "multipicklist_notcon"
            }],
            "string": [{
                "label": "Equals",
                "value": "eq"
            }, {
                "label": "Does not equal",
                "value": "noteq"
            }, {
                "label": "Begins with",
                "value": "beg"
            }, {
                "label": "Does not begin with",
                "value": "notbeg"
            }, {
                "label": "Ends with",
                "value": "end"
            }, {
                "label": "Does not end with",
                "value": "notend"
            }, {
                "label": "Contains",
                "value": "con"
            }, {
                "label": "Does not contain",
                "value": "notcon"
            }],
            "reference": [{
                "label": "Equals",
                "value": "eq"
            }, {
                "label": "Does not equal",
                "value": "noteq"
            }, {
                "label": "Begins with",
                "value": "beg"
            }, {
                "label": "Does not begin with",
                "value": "notbeg"
            }, {
                "label": "Ends with",
                "value": "end"
            }, {
                "label": "Does not end with",
                "value": "notend"
            }, {
                "label": "Contains",
                "value": "con"
            }, {
                "label": "Does not contain",
                "value": "notcon"
            }]
        };
    },
    getURLParams: function (URL) {
        var params = URL.toString();
        params = params.split("?");
        var paramMap = {};
        if (params.length > 1) {
            paramMap = this.parseParamString(params[1]);
        }
        return paramMap;
    },
    parseParamString: function (paramString) {
        var paramMap = {};
        var param = paramString.split("&");
        for (var i = 0; i < param.length; i++) {
            var paramPair = param[i].split("=");
            if (paramPair.length > 1) {
                paramMap[paramPair[0]] = paramPair[1];
            }
        }
        return paramMap;
    },
    convertToQueryString: function (queryMap) {
        var q = "";
        var first = true;
        for (var a in queryMap) {
            if (!first) {
                q += "&";
            }
            first = false;
            q += a;
            q += "=";
            q += queryMap[a];
        }
        return q;
    },
    getBrowserHeight: function () {
        var intViewH = 0;
        var intW = 0;
        if (typeof window.innerWidth == "number") {
            intViewH = window.innerHeight;
            intW = window.innerWidth;
        } else {
            if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                intViewH = document.documentElement.clientHeight;
                intW = document.documentElement.clientWidth;
            } else {
                if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                    intViewH = document.body.clientHeight;
                    intW = document.body.clientWidth;
                }
            }
        }
        var D = document;
        var intH = Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
        return {
            width: parseInt(intW),
            height: parseInt(intH),
            viewPortHeight: parseInt(intViewH)
        };
    },
    getElementMetrics: function (target) {
        var rect = target.getBoundingClientRect();
        return {
            "top": parseInt(rect.top),
            "left": parseInt(rect.left),
            "right": parseInt(rect.right),
            "bottom": parseInt(rect.bottom),
            "height": parseInt(rect.bottom - rect.top),
            "width": parseInt(rect.right - rect.left)
        };
    },
    getScrollPosition: function () {
        var scrollX, scrollY;
        if (typeof window.pageYOffset != "undefined") {
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
            scrollWidth = window.innerWidth;
        } else {
            scrollX = document.documentElement.scrollLeft;
            scrollY = document.documentElement.scrollTop;
            scrollWidth = document.documentElement.scrollWidth;
        }
        return {
            scrollX: scrollX,
            scrollY: scrollY
        };
    },
    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },
    getCookie: function (name) {
        var cookieArray = document.cookie.split(";");
        for (var i = 0;
        i < cookieArray.length; i++) {
            var x = cookieArray[i].substr(0, cookieArray[i].indexOf("="));
            var y = cookieArray[i].substr(cookieArray[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == name) {
                return unescape(y);
            }
        }
    },
    isEmail: function (email) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    },
    setDefaultFocus: function (container) {
        var elemArray = container.find("input:visible,select:visible,textarea:visible");
        if (elemArray.length > 0) {
            elemArray[0].focus();
        }
    },
    setStorageItem: function (key, value, type) {
        var userId = iv.user.data.userId;
        if (typeof (Storage) == "undefined") {
            return false;
        }
        var isLocal = true;
        if (typeof type != "undefined" && type == false) {
            isLocal = false;
        }
        if (isLocal) {
            var tempValue = {};
            if (localStorage.getItem(userId) != null) {
                tempValue = JSON.parse(localStorage.getItem(userId));
            }
            tempValue[key] = value;
            localStorage.removeItem(userId);
            try {
                localStorage.setItem(userId, JSON.stringify(tempValue));
            } catch (err) {
                iv.util.printToConsole("Error while writing to local storage:" + err);
                localStorage.removeItem(userId);
                localStorage.setItem(userId, JSON.stringify(tempValue));
            }
        } else {
            var tempValue = {};
            if (sessionStorage.getItem(userId) != null) {
                tempValue = JSON.parse(sessionStorage.getItem(userId));
            }
            tempValue[key] = value;
            sessionStorage.removeItem(userId);
            try {
                sessionStorage.setItem(userId, JSON.stringify(tempValue));
            } catch (err) {
                iv.util.printToConsole("Error while writing to session storage:" + err);
                sessionStorage.removeItem(userId);
                sessionStorage.setItem(userId, JSON.stringify(tempValue));
            }
        }
    },
    isStoragePresent: function () {
        if (typeof (Storage) == "undefined") {
            return false;
        }
        return true;
    },
    getStorageItem: function (key, type) {
        var userId = iv.user.data.userId;
        if (!iv.util.isStoragePresent()) {
            return false;
        }
        localStorage.removeItem("11");
        if (typeof type != "undefined" && type == false) {
            var tempValue = sessionStorage.getItem(userId);
        } else {
            var tempValue = localStorage.getItem(userId);
        }
        if (tempValue != null) {
            tempValue = JSON.parse(tempValue);
            if (tempValue[key]) {
                return tempValue[key];
            } else {
                return null;
            }
        }
    },
    removeStorageItem: function (key, type) {
        var userId = iv.user.data.userId;
        if (typeof (Storage) == "undefined") {
            return false;
        }
        if (typeof type != "undefined" && type == false) {
            var tempValue = sessionStorage.getItem(userId);
        } else {
            var tempValue = localStorage.getItem(userId);
        }
        if (tempValue != null) {
            tempValue = JSON.parse(tempValue);
            delete tempValue[key];
        }
        try {
            localStorage.setItem(userId, JSON.stringify(tempValue));
        } catch (err) {
            iv.util.printToConsole("Error while removing item from local storage:" + err);
            localStorage.removeItem(userId);
            localStorage.setItem(userId, JSON.stringify(tempValue));
        }
    },
    clearStorage: function (type) {
        var userId = iv.user.data.userId;
        if (typeof (Storage) == "undefined") {
            return false;
        }
        if (typeof type != "undefined" && type == false) {
            sessionStorage.removeItem(userId);
        } else {
            localStorage.removeItem(userId);
        }
    },
    flushAllStorage: function (type) {
        var userId = iv.user.data.userId;
        if (typeof (Storage) == "undefined") {
            return false;
        }
        if (typeof type != "undefined" && type == false) {
            sessionStorage.clear();
        } else {
            localStorage.clear();
        }
    },
    applyLRUOnACCache: function () {
        var items = iv.util.getStorageItem("ac_data");
        var key = "",
            tVal = "";
        var bufList = {};
        _.each(items, function (item, k) {
            if (key === "") {
                key = k;
                tVal = item.ts;
            } else {
                if (tVal > item.ts) {
                    tVal = item.ts;
                    key = k;
                }
            }
        });
        _.each(items, function (item, k) {
            if (key !== k) {
                bufList[k] = item;
            }
        });
        return bufList;
    },
    updateLastAccessOnACCacheItem: function (key) {
        iv.util.getStorageItem("ac_data")[key].ts = (new Date()).getTime();
    },
    newACCacheItem: function (data) {
        return {
            "ts": (new Date()).getTime(),
            "data": data
        };
    },
    setACCache: function (cData, cDataCt) {
        iv.util.setStorageItem("ac_data", cData);
        iv.util.setStorageItem("ac_count", cDataCt);
    },
    clearACCache: function () {
        iv.util.setStorageItem("ac_data", {});
        iv.util.setStorageItem("ac_count", 0);
    },
    readFromACCache: function (obj) {
        var cData = iv.util.getStorageItem("ac_data");
        if (cData !== null) {
            if (typeof cData !== "undefined") {
                if (typeof cData[obj] !== "undefined" && typeof cData[obj] !== "null") {
                    iv.util.updateLastAccessOnACCacheItem(obj);
                    return cData[obj].data;
                }
            }
        }
        return false;
    },
    writeToACCache: function (filterString, data) {
        var cData = iv.util.getStorageItem("ac_data");
        var cDataCt = iv.util.getStorageItem("ac_count");
        var lastRefresh = iv.util.getStorageItem("ac_last_refresh");
        if (typeof cData === "undefined") {
            cData = {};
            cDataCt = 0;
            iv.util.setACCache(cData, cDataCt);
        }
        if (iv.user.data.autoCompleteRefreshTime !== lastRefresh) {
            cData = {};
            cDataCt = 0;
            iv.util.clearACCache();
            iv.util.setStorageItem("ac_last_refresh", iv.user.data.autoCompleteRefreshTime);
        }
        if (cDataCt >= iv.util.AC_CACHE_SIZE) {
            cData = iv.util.applyLRUOnACCache();
            cDataCt--;
            iv.util.printToConsole("decreased ct to" + cDataCt);
            iv.util.setACCache(cData, cDataCt);
        }
        cData[filterString] = iv.util.newACCacheItem(data);
        cDataCt++;
        iv.util.setACCache(cData, cDataCt);
    },
    setupGlobalAutoComplete: function (options) {
        var targ = $("#global_search");
        if (targ.length < 1) {
            return;
        }
        var resource = "/iv/autoCompleteCompany.do?callFunction=globalAutoComplete";
        var placeholder = "Search for company, person, or news";
        targ.val(placeholder);
        targ.css({
            "color": "#666666"
        });
        targ.focus(function () {
            var sb = targ,
                st = placeholder;
            if (sb.val() === st) {
                sb.val("");
            }
        });
        targ.blur(function () {
            var sb = targ,
                st = placeholder;
            if (sb.val() === "") {
                sb.val(st);
                sb.css({
                    "color": "#666666"
                });
            }
        });
        targ.keydown(function (e) {
            var sb = targ,
                st = placeholder;
            if (sb.val() === st) {
                sb.val("").css({
                    "color": "#333333"
                });
            }
        });
        var config = {
            minChars: 1,
            max: 12,
            autoFill: false,
            mustMatch: false,
            matchContains: false,
            useCache: true,
            resultsClass: "global_acResults",
            selectClass: "global_ac_select",
            sortResults: false,
            scrollHeight: 220,
            paramName: "searchString",
            filterResults: false,
            url: resource
        };
        if (iv.util.isStoragePresent()) {
            config.readExternalCache = iv.util.readFromACCache;
            config.writeToExternalCache = iv.util.writeToACCache;
        }
        config.onItemSelect = function (item) {
            window.location.href = $("#auto_" + item.data.id).attr("href");
        };
        config.showResult = function (value, data) {
            var filter = $.trim(data.filterString);
            var filterWords = filter.split(" ");
            var newValue = [];
            var words = data.value.split(" ");
            while (words.length > 0) {
                var word = words[0];
                var hflag = false;
                var kf = 0;
                while (filterWords.length > kf) {
                    var keyword = filterWords[kf];
                    var ptr = word.toUpperCase().indexOf(keyword.toUpperCase());
                    if (ptr === 0) {
                        newValue.push('<span style="color:#969696;">' + word.slice(0, keyword.length) + "</span>" + '<span style="color:black;">' + word.slice(keyword.length) + "</span>");
                        hflag = true;
                        break;
                    }
                    kf++;
                }
                if (!hflag) {
                    newValue.push('<span style="color:#333333;">' + word + "</span>");
                }
                words = _.reject(words, function (v) {
                    return v == word;
                });
            }
            data.highLightedValue = newValue.join(" ");
            return _.template(iv.ui.getTemplate("autocompleteSearch"), data);
        };
        targ.autocomplete(config);
    },
    formatNumber: function (num) {
        var str = "";
        var index = 0;
        num = Number(num);
        if (num <= 0) {
            return num;
        }
        while (num > 0) {
            var t1 = num % 10;
            num = Math.floor(num / 10);
            str = t1 + (index > 0 && (index) % 3 == 0 ? "," : "") + str;
            index++;
        }
        return str;
    },
    setupAutoComplete: function (options) {
        var placeholder = "Search for company, person, or news";
        if (typeof options.placeholder != "undefined") {
            placeholder = options.placeholder;
        }
        var config = {
            minChars: 1,
            max: 12,
            autoFill: false,
            mustMatch: false,
            matchContains: false,
            useCache: false,
            sortResults: false,
            scrollHeight: 220,
            paramName: "searchString",
            filterResults: false
        };
        if (typeof options.url != "undefined") {
            config.url = options.url;
        }
        if (typeof options.data != "undefined") {
            config.data = options.data;
        }
        var template = "autocompleteSearch";
        if (typeof options.template != "undefined") {
            template = options.template;
            if ($("#" + options.id).parents("form").length > 0) {
                var form = $("#" + options.id).parents("form");
                if (form.find("input[name=companyId]").length > 0) {
                    config.onItemSelect = function (item) {
                        var companyId = $("#" + options.id).parents("form").find("input[name=companyId]");
                        if (typeof item.data != "undefined" && typeof item.data.id != "undefined") {
                            companyId.val(item.data.id);
                        }
                    };
                }
            }
        } else {
            config.onItemSelect = function (item) {
                window.location.href = $("#auto_" + item.data.id).attr("href");
            };
        }
        config.showResult = function (value, data) {
            return _.template(iv.ui.getTemplate(template), data);
        };
        $("#" + options.id).autocomplete(config);
    },
    setupNestedAutoComplete: function (options) {
        var config = {
            minChars: 1,
            max: 12,
            resultsClass: "acResultsIndustry",
            autoFill: false,
            mustMatch: false,
            matchContains: false,
            useCache: false,
            sortResults: false,
            paramName: "searchString"
        };
        if (typeof options.url != "undefined") {
            config.url = options.url;
        }
        if (typeof options.data != "undefined") {
            config.data = options.data;
        }
        var template = "autocompleteIndustry";
        if (typeof options.template != "undefined") {
            template = options.template;
        } else {
            config.onItemSelect = function (item) {
                window.location.href = $("#auto_" + item.data.id).attr("href");
            };
        }
        config.showResult = function (value, id, subLevel) {
            return _.template(iv.ui.getTemplate(template), {
                "data": id,
                "value": value,
                "subLevel": subLevel
            });
        };
        config.filterResults = function (results, filter, options) {
            var filtered = [];
            var id, subId, value, i, type, include, subValue, subInclude, firstChar, subfirstChar, filterSmallerCase, listValueSmallCase, sublistValueSmallCase;
            var regex, pattern, attributes = "";
            var headLevel = true;
            var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
            filter = filter.replace(/^\s+|\s+$/g, "");
            for (var i = 1; i < results.length; i++) {
                headLevel = true;
                id = results[i].id;
                value = results[i].name;
                value = String(value);
                listValueSmallCase = value.toLowerCase();
                if (value > "") {
                    include = !options.filterResults;
                    if (!include) {
                        pattern = String(filter);
                        pattern = pattern.replace(specials, "\\$&");
                        if (!options.matchInside) {
                            pattern = "^" + pattern;
                        }
                        if (!options.matchCase) {
                            attributes = "i";
                        }
                        regex = new RegExp(pattern, attributes);
                        include = regex.test(value);
                        if (include) {
                            firstChar = listValueSmallCase.replace(/^\s+|\s+$/g, "");
                            if (firstChar.indexOf(filterSmallerCase) == 0) {
                                include = true;
                            }
                        }
                    }
                    if (include) {
                        headLevel = false;
                        filtered.push({
                            data: id,
                            value: value
                        });
                    }
                }
                for (var j = 0; j < results[i].industries.length; j++) {
                    subId = results[i].industries[j].id;
                    subValue = results[i].industries[j].name;
                    subValue = String(subValue);
                    sublistValueSmallCase = subValue.toLowerCase();
                    if (subValue > "") {
                        subInclude = !options.filterResults;
                        if (!subInclude) {
                            pattern = String(filter);
                            pattern = pattern.replace(specials, "\\$&");
                            if (!options.matchInside) {
                                pattern = "^" + pattern;
                            }
                            if (!options.matchCase) {
                                attributes = "i";
                            }
                            regex = new RegExp(pattern, attributes);
                            subInclude = regex.test(subValue);
                            if (subInclude) {
                                subfirstChar = sublistValueSmallCase.replace(/^\s+|\s+$/g, "");
                                if (subfirstChar.indexOf(filterSmallerCase) == 0) {
                                    subInclude = true;
                                }
                            }
                        }
                        if (subInclude) {
                            if (headLevel) {
                                filtered.push({
                                    data: id,
                                    value: value
                                });
                                headLevel = false;
                            }
                            filtered.push({
                                data: subId,
                                value: subValue,
                                subLevel: true
                            });
                        }
                    }
                }
            }
            if (options.sortResults) {
                filtered = this.sortResults(filtered, filter);
            }
            if (options.maxItemsToShow > 0 && options.maxItemsToShow < filtered.length) {
                filtered.length = options.maxItemsToShow;
            }
            if (filtered.length === 0) {
                $(".acResultsIndustry").css("height", "0px");
                $(".acResultsIndustry").val("");
            } else {
                $(".acResultsIndustry").css("height", "200px");
            }
            return filtered;
        };
        $("#" + options.id).autocomplete(config);
    },
    initTooltip: function () {
        this.setupDelegateEvents();
    },
    isiOSdevice: function () {
        if ((navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPhone/i))) {
            return true;
        } else {
            return false;
        }
    },
    setupDelegateEvents: function () {
        if (iv.util.isiOSdevice()) {
            $("#wrapper").delegate("#mainContent,#head", "tap", function () {
                if (isMenuOpen) {
                    if (typeof $(this).parents(".menu") === "undefined") {
                        $(this).parents(".menu").children().find("ul").hide();
                    }
                }
            });
        } else {
            $("body").delegate(".company-hover", "mouseenter", function () {
                var element = $(this);
                iv.util.showCompanyTooltip(element);
            });
            $("body").delegate(".contact-hover", "mouseenter", function () {
                var element = $(this);
                iv.util.showContactTooltip(element);
            });
        }
    },
    showCompanyTooltip: function (elem) {
        var eventHover = "mouseenter";
        if (!elem.hasClass("hover-set")) {
            var nameStr = elem.attr("name");
            var parts = nameStr.split("_");
            if (parts.length >= 2) {
                var isSmallerFrame = parts[0] == "SMALL";
                var companyId = parts[1];
                iv.util.initCompanyHover(elem, isSmallerFrame, companyId);
                elem.addClass("hover-set").removeClass("company-hover").trigger(eventHover);
            } else {
                iv.util.printToConsole(nameStr + " does not match pattern of company hover initialization.");
            }
        }
    },
    showContactTooltip: function (elem) {
        var eventHover = "mouseenter";
        if (!elem.hasClass("hover-set")) {
            var nameStr = elem.attr("name");
            var parts = nameStr.split("_");
            if (parts.length >= 3) {
                var isSmallerFrame = parts[0] == "SMALL";
                var companyId = parts[1];
                var employmentId = parts[2];
                iv.util.initContactHover(elem, isSmallerFrame, companyId, employmentId);
                elem.addClass("hover-set").removeClass("contact-hover").trigger(eventHover);
            } else {
                iv.util.printToConsole(nameStr + " does not match pattern of contact hover initialization.");
            }
        }
    },
    printToConsole: function (msg) {
        if (typeof console != "undefined" && typeof console.log != "undefined") {
            console.log(msg);
        }
    },
    enablePlaceholder: function (inputElem) {
        if ($.browser.msie && $.browser.version <= 9) {
            inputElem.bind("focus", function () {
                var elem = $(this);
                if ($.trim(elem.val()) == elem.attr("placeholder")) {
                    elem.val("");
                    elem.removeClass("placeholder");
                }
            });
            inputElem.bind("blur", function () {
                var elem = $(this);
                if ($.trim(elem.val()) == "") {
                    elem.val(elem.attr("placeholder"));
                    elem.addClass("placeholder");
                }
            }).trigger("blur");
        }
    },
    setMaxTextLength: function (elem, limit) {
        elem.bind("keydown", function (e) {
            if ($(this).val().length >= limit) {
                if (e.which != 8 && e.which != 46 && e.which != 16 && (e.which < 37 || e.which > 40)) {
                    e.stopPropagation();
                    return false;
                }
            }
            $(this).data("VAL", $(this).val());
        });
        elem.bind("keyup", function (e) {
            var oldValue = $(this).data("VAL");
            var newValue = $(this).val();
            if (oldValue.length <= limit && newValue.length > limit) {
                $(this).val(oldValue);
            } else {
                $(this).data("VAL", $(this).val());
            }
        });
    },
    initCompanyHover: function (target, isSmallerFrame, companyId) {
        var companyUrl = "/iv/sourceData" + "?id=" + companyId + "&source=familyTree" + "&isMashup=" + (typeof iv.isMashup != "undefined" ? iv.isMashup : false);
        companyUrl = encodeURI(companyUrl);
        var tt = new ivTooltip({
            "target": target[0],
            "delay": 400,
            "timeOut": 200,
            "width": 565,
            "displayCallback": function () {
                if (iv.util.isiOSdevice()) {
                    target.attr("href", target.attr("data-hoverurl"));
                }
                iv.util.fixHeader();
            },
            "prefetch": false,
            "dataSource": companyUrl,
            "smallerFrame": isSmallerFrame,
            "tracking": {
                url: "/iv/incrementPopularity.do?methodName=incrementCompanyPageView&companyId=" + companyId,
                duration: 3
            }
        });
        return tt;
    },
    initContactHover: function (target, isSmallerFrame, companyId, employmentId) {
        var contactUrl = "/iv/companyinfo.do" + "?methodToCall=getBusinessCard" + "&companyId=" + companyId + "&empId=" + employmentId + "&isMashup=" + (typeof iv.isMashup != "undefined" ? iv.isMashup : false);
        contactUrl = encodeURI(contactUrl);
        var tt = new ivTooltip({
            "target": target[0],
            "delay": 400,
            "timeOut": 200,
            "width": 465,
            "displayCallback": function () {
                if (iv.util.isiOSdevice()) {
                    target.attr("href", target.attr("data-hoverurl"));
                }
            },
            "prefetch": false,
            "dataSource": contactUrl,
            "smallerFrame": isSmallerFrame,
            "tracking": {
                url: "/iv/executiveHover.do?methodName=pageView&employmentId=" + employmentId,
                duration: 3
            }
        });
        return tt;
    },
    getWidths: function (selector) {
        var targ = $(selector)[0];
        if (targ) {
            var rect = targ.getBoundingClientRect();
            return parseInt(rect.right - rect.left);
        } else {
            return 0;
        }
    },
    fixHeader: function () {
        var statusLength = 0;
        var companyWidth = this.getWidths("#tt-head-name");
        var companyStatusWidth = this.getWidths("#tt-head-status");
        var locationWidth = this.getWidths("#tt-head-location");
        var urlWidth = this.getWidths("#tt-head-url");
        if (companyStatusWidth > 0) {
            statusLength = 1;
        }
        if (companyWidth + locationWidth + urlWidth + companyStatusWidth >= 530) {
            if (companyWidth + companyStatusWidth < 530) {
                if (companyWidth + companyStatusWidth + locationWidth < 530) {
                    $("#tt-head-url").css("clear", "both");
                    $($(".header-pipe-to-hide")[statusLength + 1]).css("display", "none");
                } else {
                    $("#tt-head-location").css("clear", "both");
                    $($(".header-pipe-to-hide")[statusLength + 0]).css("display", "none");
                }
            } else {
                if (companyStatusWidth > 0) {
                    $("#tt-head-status").css("clear", "both");
                    $($(".header-pipe-to-hide")[0]).css("display", "none");
                }
                if (companyStatusWidth + locationWidth + urlWidth >= 530) {
                    if (locationWidth + urlWidth > 530) {
                        $("#tt-head-location").css("clear", "both");
                        $("#tt-head-url").css("clear", "both");
                        $(".header-pipe-to-hide").forEach(function (el) {
                            el.css("display", "none");
                        });
                    } else {
                        $("#tt-head-url").css("clear", "both");
                        $($(".header-pipe-to-hide")[1]).css("display", "none");
                    }
                }
            }
        }
    },
    addUserData: function (key, data) {
        if (typeof iv.user.data !== "undefined") {
            if (typeof iv.user.data[key] !== "undefined") {
                iv.user.data[key] = data;
            }
        } else {
            if (typeof console !== "undefined") {
                if (typeof console.error !== "undefined") {
                    console.error("cant find iv.user.data");
                }
            }
        }
    },
    require: function (fileArray, callBack, callBackParams) {
        var jsFilesArray = [];
        _.each(fileArray, function (fileName) {
            if (fileName.match(/.*\.css/)) {
                iv.util.loadCss(fileName);
            } else {
                jsFilesArray.push(fileName);
            }
        });
        require(jsFilesArray, function (file, css) {
            callBack(callBackParams);
        });
    },
    getCompanyTrackedByWatchlist: function (companyId) {
        var trackedByWL = [];
        var companyId = companyId.toString();
        _.each(iv.user.data.genericWatchlistInfo, function (watchlist) {
            if ($.inArray(companyId, watchlist.companies) >= 0) {
                trackedByWL.push(watchlist.id);
            }
        });
        return trackedByWL;
    },
    getExecTrackedByWatchlist: function (executiveId) {
        var trackedByWL = [];
        var executiveId = executiveId.toString();
        _.each(iv.user.data.genericWatchlistInfo, function (watchlist) {
            if ($.inArray(executiveId, watchlist.executives) >= 0) {
                trackedByWL.push(watchlist.id);
            }
        });
        return trackedByWL;
    },
    getShortifiedString: function (str, length) {
        var originalString = str;
        var shortString = str.substring(0, length);
        if (originalString.length > shortString.length) {
            shortString += "...";
        }
        return shortString;
    },
    getShortifiedTitle: function (str, length) {
        var originalString = str;
        var shortString = str.substring(0, length);
        if (originalString.length > shortString.length) {
            return str;
        } else {
            return "";
        }
    },
    userHasPermission: function (feature) {
        if ($.inArray(feature, iv.user.data.permissions) != -1) {
            return true;
        }
        return false;
    },
    getThemedImageUrl: function (imageName) {
        var theme = iv.user.data.theme;
        if (!theme) {
            theme = "original";
        }
        return _.template(iv.ui.getTemplate("themedImages." + theme + "." + imageName), {});
    },
    setupMarketo: function () {
        var $this = this;
        $.ajax({
            url: document.location.protocol + "//munchkin.marketo.net/munchkin.js",
            dataType: "script",
            cache: true,
            success: function () {
                Munchkin.init("970-YGT-940");
                $this.associateLead();
            }
        });
    },
    associateLead: function () {
        try {
            if (typeof iv.user.data !== "undefined") {
                if (typeof iv.user.data.marketoHash !== "undefined") {
                    mktoMunchkinFunction("associateLead", {
                        Email: iv.user.data.userEmail,
                        FirstName: iv.user.data.firstName,
                        LastName: iv.user.data.lastName
                    }, iv.user.data.marketoHash);
                }
            }
        } catch (e) {
            console.log("error in trying to associate lead");
        }
    },
    loadCss: function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    initUserLocale: function () {
        var userLocale = iv.util.getStorageItem("locale");
        if (userLocale !== null || typeof userLocale !== "undefined") {
            if (userLocale !== iv.user.data.locale) {
                iv.util.clearStorage();
                iv.util.setStorageItem("locale", iv.user.data.locale);
            }
        } else {
            iv.util.setStorageItem("locale", iv.user.data.locale);
        }
    },
    getValidId: function (str) {
        return str.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-");
    },
    reloadTopPage: function (path) {
        top.location.href = path;
    },
    referrer: null,
    setupCRMGrandChild: function () {
        if (!iv.isMashup) {
            return false;
        }
        this.referrer = document.referrer;
        var p = this.getURLParams(window.location.href);
        var purl;
        if (typeof p["connect"] !== "undefined") {
            purl = decodeURIComponent(p["connect"]);
        }
        var chost = this.getCookie("mscrmbridge");
        if (typeof purl !== "undefined") {
            this.referrer = purl;
            if (typeof chost !== "undefined") {
                if (purl !== chost) {
                    this.setCookie("mscrmbridge", purl, 1);
                } else {
                    this.referrer = chost;
                }
            } else {
                this.setCookie("mscrmbridge", purl, 1);
            }
        } else {
            if (chost !== "undefined") {
                this.referrer = chost;
            } else {
                return;
            }
        }
        $("body").append('<iframe href="javascript:return false;" name="ivconnectbridge"  id="ivconnectbridge" style="display:none;" ></iframe>');
    },
    transmitRefreshMessageToConnector: function () {
        var message = "refresh";
        $("#ivconnectbridge").attr("src", this.referrer.split("?")[0] + "#" + message);
        return false;
    },
    showSingularOrPlural: function (num, singular, plural) {
        return num + " " + (num === 1 ? singular : plural);
    },
    generateMailToLinkForArticleLauncher: function (articleLink) {
        var mailToLink = "mailto:?subject=";
        mailToLink += encodeURIComponent("Opportunity Alert");
        mailToLink += "&body=";
        mailToLink += encodeURIComponent("I think you will find this article interesting.");
        mailToLink += "%0D%0A";
        articleLink = articleLink.replace(/%20/g, "%2520");
        mailToLink += articleLink;
        return mailToLink;
    }
};
iv.processOnDomReady(function () {
    iv.util.initTooltip();
    iv.util.attachUpgradeLinkEvents();
    iv.util.initUserLocale();
});
iv.processOnDomReady(function () {
    iv.util.setupGlobalAutoComplete();
});
iv.processAfterOnLoad(function () {
    iv.util.setupMarketo();
    iv.util.setupCRMGrandChild();
});

function openWebsitePopup(companyURL, track) {
    if (companyURL.substring(0, 4) != "http") {
        var tCompanyURL = "http://" + companyURL;
        companyURL = tCompanyURL;
    }
    var extWindow = window.open(companyURL);
    if (typeof track === "boolean") {
        if (track) {
            iv.util.logUserActivity("/company-url");
        }
    }
    extWindow.focus();
}
if (typeof jQuery != "undefined") {
    if ($(".mailToLink").length > 0) {
        $(".mailToLink").each(function () {
            var elem = $(this);
            var href = elem.attr("href");
            href = href.replace("%3C%3CREFERRING_URL_GOES_HERE%3E%3E", encodeURIComponent(window.location.href));
            elem.attr("href", href);
        });
    }
} else {
    var elems = Spry.$$(".mailToLink");
    if (elems.length > 0) {
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            var href = elem.href;
            href = href.replace("%3C%3CREFERRING_URL_GOES_HERE%3E%3E", encodeURIComponent(window.location.href));
            elem.href = href;
        }
    }
}
registerNS("iv.api");
jQuery.ajaxSetup({
    cache: false
});
iv.api.getContent = function (params) {
    var q = "";
    if (params.urlParams) {
        q = iv.api.constructQueryString(params.urlParams, params.resource, false);
    }
    var success = function (data) {};
    var error = function () {};
    if (params.success) {
        success = params.success;
    }
    if (params.error) {
        error = params.error;
    }
    var dataType = "html";
    if (typeof params.dataType !== "undefined") {
        dataType = params.dataType;
    }
    $.get(params.resource + q, function (data, textStatus, jQXHR) {
        try {
            if (textStatus === "success") {
                success(data);
            } else {
                error();
            }
        } catch (e) {
            if (typeof console !== "undefined") {
                console.info("Error caught in iv.api.getContent");
            }
        }
    }, dataType);
};
iv.api.getHtmlContent = function (params) {
    var q = "";
    if (params.urlParams) {
        q = iv.api.constructQueryString(params.urlParams, params.resource, false);
    }
    var success = function (data) {};
    var error = function () {};
    if (params.success) {
        success = params.success;
    }
    if (params.error) {
        error = params.error;
    }
    var preLoad = function () {};
    var postLoad = function () {};
    var preLoadParams = {};
    var postLoadParams = {};
    if (typeof params.preLoad === "function") {
        preLoad = params.preLoad;
    } else {
        if (typeof params.preLoad !== "function" && typeof params.preLoad !== "undefined") {
            alert("pre load specified is not a function");
        }
    }
    if (typeof params.postLoad === "function") {
        postLoad = params.postLoad;
    } else {
        if (typeof params.postLoad !== "function" && typeof params.postLoad !== "undefined") {
            alert("post load specified is not a function");
        }
    }
    if (typeof params.preLoadParams != "undefined") {
        preLoadParams = params.preLoadParams;
    }
    if (typeof params.postLoadParams != "undefined") {
        postLoadParams = params.postLoadParams;
    }
    if (typeof params.target !== "undefined") {
        preLoad(preLoadParams);
        params.target.load(params.resource + q, function (responseText, textStatus) {
            try {
                if (textStatus === "success") {
                    success(responseText);
                    postLoad(postLoadParams);
                } else {
                    error();
                }
            } catch (e) {
                if (typeof console !== "undefined") {
                    console.info("Error caught in iv.api.getHTMLContent");
                    console.error(e);
                }
            }
        });
    } else {
        iv.api.getContent(params);
    }
};
iv.api.constructQueryString = function (params, url, isPostCall) {
    var q = "";
    var appendQueryMarker = true;
    if (url.indexOf("?") !== -1) {
        appendQueryMarker = false;
    }
    _.each(params, function (value, key) {
        if (!isPostCall) {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);
        }
        if (q === "" && !isPostCall) {
            if (appendQueryMarker) {
                q += "?";
            } else {
                q += "&";
            }
            q += key + "=" + value;
        } else {
            q += "&" + key + "=" + value;
        }
    });
    return q;
};
iv.api.getJSONP = function (params) {
    var q = "";
    if (params.urlParams) {
        q = iv.api.constructQueryString(params.urlParams, params.resource, false);
    }
    var dataType = "jsonp";
    $.ajax({
        url: params.resource + q,
        dataType: dataType
    });
};
iv.api.getJson = function (params) {
    var q = "";
    if (params.urlParams) {
        q = iv.api.constructQueryString(params.urlParams, params.resource, false);
    }
    var success = function (data) {};
    var error = function () {};
    if (params.success) {
        success = params.success;
    }
    if (params.error) {
        error = params.error;
    }
    var dataType = "json";
    $.get(params.resource + q, function (data, textStatus, jQXHR) {
        try {
            if (textStatus === "success") {
                if (data.error) {
                    var sessionError = session.validate(data.errorType);
                    if (!sessionError) {
                        error(data);
                    }
                } else {
                    success(data);
                }
            } else {
                error();
            }
        } catch (e) {
            if (typeof console !== "undefined") {
                console.info("Error caught in iv.api.getJson");
                console.log(e);
            }
        }
    }, dataType);
};
iv.api.validateSession = function (resp) {};
iv.api.resourceCallback = function () {};
iv.api.doPost = function (params) {
    var success = function (data) {};
    var error = function () {};
    if (params.success) {
        success = params.success;
    }
    if (params.error) {
        error = params.error;
    }
    var responseType = "html";
    if (params.responseType) {
        responseType = params.responseType.toLowerCase();
    }
    $.post(params.resource, params.urlParams, function (resp, textStatus, jqXHR) {
        try {
            if (textStatus === "success") {
                if (responseType === "json") {
                    if (resp.error) {
                        var sessionError = session.validate(resp.errorType);
                        if (!sessionError) {
                            error(resp);
                        }
                    } else {
                        success(resp);
                    }
                } else {
                    if (responseType === "html") {
                        success(resp);
                    }
                }
            } else {
                error(resp);
            }
        } catch (e) {
            if (typeof console !== "undefined") {
                console.info("Error caught in iv.api.doPost");
            }
        }
    }, responseType);
};
iv.api.submitForm = function (params) {
    if (typeof params.form != "undefined") {
        var form = params.form;
        var text = form.serialize();
        var xhr = $.post(form.attr("action"), text, function () {
            if (typeof params.success != "undefined" && typeof params.successParams != "undefined") {
                params.success(xhr, params.successParams);
            } else {
                if (typeof params.success != "undefined") {
                    params.success(xhr);
                }
            }
        });
    }
};
iv.api.submitJsonForm = function (params) {
    if (typeof params.form != "undefined") {
        var form = params.form;
        var text = form.serialize();
        form.submit(function () {
            $.post(form.attr("action"), text, function (resp) {
                if (typeof params.success != "undefined" && typeof params.successParams != "undefined") {
                    params.success(resp, params.successParams);
                } else {
                    if (typeof params.success != "undefined") {
                        params.success(resp);
                    }
                }
            }, "json");
            return false;
        });
    }
};
registerNS("iv.api.userAction");
iv.api.userAction.enableActionTracking = function (params) {
    if (typeof params.urlParams !== "undefined") {
        params.urlParams.LOG_USER_ACTION = true;
    } else {
        params.urlParams = {};
        params.urlParams.LOG_USER_ACTION = true;
    }
    return params;
};
iv.api.userAction.doPost = function (params) {
    iv.api.doPost(iv.api.userAction.enableActionTracking(params));
};
iv.api.userAction.getJson = function (params) {
    iv.api.getJson(iv.api.userAction.enableActionTracking(params));
};
iv.api.userAction.getHtmlContent = function (params) {
    iv.api.getHtmlContent(iv.api.userAction.enableActionTracking(params));
};
iv.api.userAction.getContent = function (params) {
    iv.api.getContent(iv.api.userAction.enableActionTracking(params));
};
iv.api.userAction.submitForm = function (params) {
    if (typeof params.form != "undefined") {
        var logUserAction = params.form.find("input[name=LOG_USER_ACTION]");
        if (logUserAction.length > 0) {
            logUserAction.val(true);
        } else {
            params.form.append('<input type="hidden" name="LOG_USER_ACTION" value="true"/>');
        }
    }
    iv.api.submitForm(params);
};
if (registerNS) {
    registerNS("iv.session");
}
var session = {
    config: {
        SESSION_TIMED_OUT: "/iv/welcome.do"
    },
    validate: function (response) {
        if (response === "SESSION_TIMED_OUT") {
            window.location.href = this.config.SESSION_TIMED_OUT;
            return true;
        }
    }
};
if (iv.session) {
    iv.session = session;
}
var menu = function () {
    var t = 15,
        z = 9999,
        s = 6,
        a;

    function dd(n) {
        this.n = n;
        this.h = [];
        this.c = [];
        this.timer = [];
    }
    dd.prototype.init = function (p, c) {
        isMenuOpen = false;
        a = c;
        var w = document.getElementById(p);
        w.style.zIndex = z;
        var lis = w.getElementsByTagName("li");
        for (var j = 0; j < lis.length; j++) {
            lis[j].style.zIndex = z;
        }
        z++;
        var s = w.getElementsByTagName("ul");
        var l = s.length;
        var i = 0;
        for (i; i < l; i++) {
            var h = s[i].parentNode;
            this.h[i] = h;
            this.c[i] = s[i];
            this.timer[i] = null;
            s[i].style.zIndex = z;
            var lis = s[i].getElementsByTagName("li");
            for (var j = 0; j < lis.length; j++) {
                lis[j].style.zIndex = z;
            }
            z++;
            h.onmouseover = new Function("event", this.n + ".st(event," + i + ",true)");
            h.onmouseout = new Function("event", this.n + ".st(event," + i + ")");
        }
    };
    dd.prototype.st = function (event, x, f) {
        var c = this.c[x];
        var h = this.h[x];
        var p = h.getElementsByTagName("a")[0];
        var timer = this.timer[x];
        if (f) {
            if (timer) {
                clearInterval(timer);
                this.timer[x] = null;
            }
            clearInterval(c.t);
            if (p.className.indexOf(a) == -1) {
                p.className += " " + a;
            }
            c.style.display = "block";
            if (!c.mh) {
                c.style.height = "";
                c.mh = c.offsetHeight;
                c.style.height = 0;
            }
            if (c.mh == c.offsetHeight) {
                c.style.filter = "";
                c.style.opacity = 1;
                c.style.overflow = "visible";
            } else {
                c.t = setInterval(function () {
                    sl(c, 1);
                }, t);
            }
        } else {
            if (c.className.indexOf("sub") != -1) {
                this.timer[x] = setTimeout(function () {
                    clearInterval(c.t);
                    var re = new RegExp(a, "g");
                    p.className = p.className.replace(re, "");
                    c.t = setInterval(function () {
                        sl(c, -1);
                    }, t);
                }, 10);
            } else {
                this.timer[x] = setTimeout(function () {
                    clearInterval(c.t);
                    var re = new RegExp(a, "g");
                    p.className = p.className.replace(re, "");
                    c.t = setInterval(function () {
                        sl(c, -1);
                    }, t);
                }, 500);
            }
        }
        isMenuOpen = true;
    };

    function sl(c, f) {
        var h = c.offsetHeight;
        if ((h <= 0 && f != 1) || (h >= c.mh && f == 1)) {
            if (f == 1) {
                c.style.filter = "";
                c.style.opacity = 1;
                c.style.overflow = "visible";
            }
            clearInterval(c.t);
            return;
        }
        if (f == -1) {
            c.style.opacity = 0;
            c.style.filter = "alpha(opacity=0)";
            c.style.height = "0px";
            c.style.display = "none";
            clearInterval(c.t);
            isMenuOpen = false;
            return;
        } else {
            var d = (f == 1) ? Math.ceil((c.mh - h) / s) : Math.ceil(h / s);
            var o = h / c.mh;
            c.style.opacity = o;
            c.style.filter = "alpha(opacity=" + (o * 100) + ")";
            c.style.height = h + (d * f) + "px";
        }
    }
    return {
        dd: dd
    };
}();
registerNS("iv.analytics");
iv.analytics = {
    tracker: null,
    ENABLE: true,
    mouseOverHash: {},
    init: function () {
        if (!this.ENABLE) {
            return;
        }
        if (this.tracker === null) {
            this.tracker = _gat._getTracker("UA-XXXXX-X");
        }
    },
    trackEvent: function (category, action, label, value) {
        if (!this.ENABLE) {
            return;
        }
        if (typeof category === "undefined" || typeof action === "undefined" || typeof label === "undefined") {
            alert("iv.analytics - one or more required fields are not provided");
            return false;
        }
        if (typeof value !== "undefined") {
            _gaq.push(["_trackEvent", category, action, label, value]);
            return true;
        }
        _gaq.push(["_trackEvent", category, action, label]);
    },
    getKey: function (arr) {
        if (!this.ENABLE) {
            return;
        }
        return arr.join("|");
    },
    hasKey: function (key) {
        if (!this.ENABLE) {
            return;
        }
        if (typeof this.mouseOverHash[key] === "undefined") {
            return false;
        } else {
            return true;
        }
    },
    setHash: function (key) {
        if (!this.ENABLE) {
            return;
        }
        this.mouseOverHash[key] = true;
    },
    trackMouseOver: function (category, action, label, value) {
        if (!this.ENABLE) {
            return;
        }
        if (typeof category === "undefined" || typeof action === "undefined" || typeof label === "undefined") {
            alert("iv.analytics - one or more required fields are not provided");
            return false;
        }
        if (typeof value !== "undefined") {
            var key = this.getKey([category, action, label, value]);
            if (this.hasKey(key)) {
                return false;
            }
            _gaq.push(["_trackEvent", category, action, label, value]);
            this.setHash(key);
            return true;
        }
        var key = this.getKey([category, action, label]);
        if (this.hasKey(key)) {
            return false;
        }
        _gaq.push(["_trackEvent", category, action, label]);
        this.setHash(key);
    },
    trackPageView: function (pagePath) {
        if (!this.ENABLE) {
            return;
        }
        if (typeof pagePath === "undefined") {
            if (typeof console !== undefined) {
                console.log("PagePath is missing for analytics.");
            }
            return false;
        }
        _gaq.push(["_trackPageview", pagePath]);
    },
    url: "",
    activePassiveUrls: {
        "showSfHomePage": function () {
            iv.analytics.hookSFHomePage();
        },
        "analyseAccount": function () {
            iv.analytics.hookAnalyzeAccount();
        },
        "analyseExecutive": function () {
            iv.analytics.hookAnalyzeExecutive();
        }
    },
    isMashup: function () {
        return (window.location.href.indexOf("/crm/", 0) !== -1);
    },
    urlToMap: "",
    screenType: "",
    initActivePassiveHooks: function () {
        if (!this.isMashup()) {
            return;
        }
        this.url = window.location.href;
        _.each(this.activePassiveUrls, function (val, key) {
            if (this.url.indexOf(key, 0) !== -1) {
                val();
                this.screenType = key;
            }
        }, this);
    },
    isActive: false,
    threshHold: 4000,
    timerDump: {
        mouseIn: 0,
        mouseLeave: 0
    },
    checkUserActivity: function () {
        if (this.timerDump.mouseLeave > this.timerDump.mouseIn) {
            var dif = this.timerDump.mouseLeave - this.timerDump.mouseIn;
            if (dif > this.threshHold) {
                this.logActivityAndUnbind();
            }
        }
    },
    logActivityAndUnbind: function () {
        if (this.isActive) {
            return;
        }
        this.isActive = true;
        this.unbindHooks();
        this.urlToMap = this.url.substring(this.url.indexOf("/crm/", 0) + 5, this.url.indexOf("?", 0));
        iv.util.logUserActivity(this.urlToMap + "-active");
    },
    resetTimerDump: function () {
        this.timerDump.mouseIn = 0;
        this.timerDump.mouseLeave = 0;
    },
    unbindHooks: function () {
        if (this.screenType === "showSfHomePage") {
            $(".analysisConsole").unbind("mouseenter", this.mouseIn);
            $(".analysisConsole").unbind("mouseleave", this.mouseOut);
            $(".analysisConsole").unbind("click", this.clickHandler);
        } else {
            if (this.screenType !== "showSfHomePage") {
                $("#outerBox").unbind("mouseenter", this.mouseIn);
                $("#outerBox").unbind("mouseleave", this.mouseOut);
                $("#outerBox").unbind("click", this.clickHandler);
            }
        }
    },
    mouseIn: function (e) {
        var $this = iv.analytics;
        if (!$this.isActive) {
            if ($this.timerDump.mouseIn === 0) {
                $this.timerDump.mouseIn = (new Date()).getTime();
            }
        }
    },
    mouseOut: function (e) {
        var $this = iv.analytics;
        if (!$this.isActive) {
            if ($this.timerDump.mouseIn !== 0) {
                $this.timerDump.mouseLeave = (new Date()).getTime();
                $this.checkUserActivity();
                $this.resetTimerDump();
            }
        }
    },
    clickHandler: function (e) {
        var $this = iv.analytics;
        $this.logActivityAndUnbind();
    },
    hookAnalyzeAccount: function () {
        $("#outerBox").bind("mouseenter", this.mouseIn);
        $("#outerBox").bind("mouseleave", this.mouseOut);
        $("#outerBox").bind("click", this.clickHandler);
    },
    hookAnalyzeExecutive: function () {
        $("#outerBox").bind("mouseenter", this.mouseIn);
        $("#outerBox").bind("mouseleave", this.mouseOut);
        $("#outerBox").bind("click", this.clickHandler);
    },
    hookSFHomePage: function () {
        $(".analysisConsole").bind("mouseenter", this.mouseIn);
        $(".analysisConsole").bind("mouseleave", this.mouseOut);
        $(".analysisConsole").bind("click", this.clickHandler);
    }
};
iv.processOnDomReady(function () {
    iv.analytics.initActivePassiveHooks();
});
(function ($) {
    var ivGrid = function (elem, options) {
        this.gridContainer = elem;
        this.config = {
            gridType: "static",
            data: [],
            pageData: [],
            colConfig: [],
            dataSource: null,
            dataSourceParams: {
                sortType: "",
                sortOrder: "",
                searchTerm: ""
            },
            dataSuffix: "",
            pager: {
                pageNum: 1,
                totalPages: -1,
                resultsPerPage: 10,
                startRecord: -1,
                endRecord: -1,
                totalRecords: -1,
                type: "linear",
                rowsCountMultiplier: 2
            },
            liveFilter: true,
            filter: true,
            overflowRows: {
                enabled: false,
                overflowHeight: "300px",
                overflowClass: "ivgrid_overflow"
            },
            renderCallback: function (data) {},
            preRenderCallback: function (resp) {
                return resp;
            },
            selectedIndex: -1,
            defaultSearchTemplate: '<div class="search">' + '<div class="searchBoxLabel"><~%=label%~></div>' + '<div class="searchBoxLeftNoIcon">' + '	<div class="searchBoxRight">' + '		<div class="searchBoxCenter">' + '			<input type="text" class="searchBox" style="color: #666666;" value="<~%=defaultText%~>">' + "		</div>" + "	</div>" + "</div>" + '<img class="searchBoxRightImage" alt="Search" src="<~%=iv.util.getThemedImageUrl(\'searchIcon\')%~>">' + '<div class="searchLinkSpan">&nbsp;&nbsp;<a class="bluefont_11px searchLink" href="javascript:void(0)">View all</a></div>' + '<div style="clear:both;"></div>' + "</div>",
            liveSearchTemplate: '<div class="search">' + '<div class="searchBoxLabel"><~%=label%~></div>' + '<div class="searchBoxLeft">' + '	<div class="searchBoxRight">' + '		<div class="searchBoxCenter">' + '			<input type="text" class="searchBox" style="color: #666666;" value="<~%=defaultText%~>">' + "		</div>" + "	</div>" + "</div>" + '<img class="searchBoxRightImage" alt="Search" src="<~%=iv.util.getThemedImageUrl(\'searchIcon\')%~>">' + '<div class="searchLinkSpan">&nbsp;&nbsp;<a class="bluefont_11px searchLink" href="javascript:void(0)">View all</a></div>' + '<div style="clear:both;"></div>' + "</div>",
            headerTemplate: '<div class="white-overlay">' + '<img style="margin-top:100px;" src="<~%=iv.util.getThemedImageUrl(\'LoadingAnimation\')%~>">' + "<h1>Loading...</h1>" + "</div>" + '<div class="rows-header">' + '<~% if (className != "") { %~> ' + '	<div class="fillerLeft"><div class="filler-left-image"></div></div>' + "<~% } %~>" + "<~% _.each(colConfigs, function(col) { %~>" + '	<~% if(typeof col.sortable != "undefined" && col.sortable == false) { %~>' + '		<div class="not-sortable" name="<~%=col.name%~>" style="float:left;width:<~%=col.widthInPercent%~>%;"><span class="header-text" style="float:left;"><~%=col.displayName%~></span></div>' + "	<~% } else { %~>" + '		<div class="sortable-column"  name="<~%=col.name%~>" style="float:left;width:<~%=col.widthInPercent%~>%;"><span class="header-text" style="float:left;"><~%=col.displayName%~></span><span class="common_sprites"></span></div>' + "	<~% } %~>" + "<~%});%~>" + '<~% if (className != "") { %~> ' + '	<div class="fillerRight"><div class="filler-right-image"></div></div>' + "<~% } %~>" + "</div>",
            rowTemplate: '<~% if (className != "") { %~> ' + '	<div class="fillerLeft">&nbsp;</div>' + "<~% } %~>" + "	<~% _.each(colConfigs, function(col) { %~>" + '	<div class="data ' + "	<~% if(hasCustomHandler) { %~>" + "cursorpointer" + "<~% } %~>" + '" name="<~%=col.name%~>" style="width:<~%=col.widthInPercent%~>%;"><span class="row-text"><~%=col.template%~></span></div>' + "<~%});%~>" + '<~% if (className != "") { %~> ' + '	<div class="fillerRight"></div>' + "<~% } %~>",
            dataTemplate: "",
            pagerTemplate: "<~% if(pager.totalPages > 0 && pager.pageNum > 0) { %~>" + '<div class="pages">' + "<~% if(pager.totalRecords > 0) { %~>" + '<span style="font-weight:bold;"><~%=pager.startRecord%~>-<~%=pager.endRecord%~> of <~%=pager.totalRecords%~> </span>' + "<~% } %~>" + "<span>" + "<~% if(pager.pageNum > 10) { %~>" + '	<label class="page pageprev"> &laquo; Prev</label> ' + "<~% } %~>" + "<~% var startPage = (pager.pageNum % 10 == 0) ? (pager.pageNum - 9)	: pager.pageNum - (pager.pageNum % 10) + 1; %~>" + "<~% var endPage = startPage + 9; %~>" + "<~% endPage = endPage > pager.totalPages ? pager.totalPages : endPage; %~>" + "<~% for ( var i = startPage; i <= endPage; i++) {%~>" + "	<~% if (i == pager.pageNum) { %~>" + '		<label name="page-<~%=i%~>" class="page active-page"><~%=i%~></label>' + "	<~% } else  {%~>" + '		<label name="page-<~%=i%~>" class="page"><~%=i%~></label>' + "	<~% } %~>" + "<~% } %~>" + "<~% if ((startPage + 10) <= pager.totalPages) { %~>" + '	<label id="page-next" class="page pagenext">Next &raquo;</label>' + "<~% } %~>" + "</span>" + "</div>" + "<~% } %~>",
            loadMoreTemplate: '<div class="loadMoreLink" align="center">' + '	<a href="javascript:void(0);" class="loadMoreMessage">' + '		<img src="/iv/common/styles/images/loadmore.png"/>' + "		<span>Load more</span>" + "	</a>" + '	<div class="loadingIcon" style="display: none; ">' + '		<img src="<~%=iv.util.getThemedImageUrl(\'indicator\')%~>" style="display:inline;"/><span>Loading</span>' + "	</div>" + "</div>",
            emptyMessage: "No records found.",
            searchLabel: "Search:",
            searchDefaultText: ""
        };
        if (typeof options != "undefined") {
            $.extend(true, this.config, options);
        }
        this.prepareDataTemplate();
        this.setStaticContent();
        this.getData(true);
        this.delegatePageEvents();
        this.delegateSearchEvents();
        this.delegateSortEvents();
        this.delegateSelectionEvents();
    };
    ivGrid.prototype.prepareDataTemplate = function () {
        if (!this.gridContainer.hasClass("iv-grid") && typeof this.config.gridClass != "undefined") {
            this.gridContainer.addClass(this.config.gridClass);
        } else {
            this.gridContainer.addClass("iv-grid");
        }
        var colConfig = this.config.colConfig;
        for (var i = 0; i < colConfig.length; i++) {
            var col = colConfig[i];
            var defaultValue = typeof col.defaultValue != "undefined" ? col.defaultValue : "&nbsp;";
            if (typeof col.template == "undefined" || col.template == null || jQuery.trim(col.template) == "") {
                col.template = '<~% if($.trim(row["' + col.name + '"]) != "") { %~><~%=row["' + col.name + '"]%~><~% } else {%~>' + defaultValue + "<~%}%~>";
            } else {
                if (col.checkbox) {
                    var checkboxHtml = "<input type='checkbox' name=" + col.checkboxName + " id=" + col.checkboxValue + " class=" + col.checkboxClass + " value=" + col.checkboxValue + " />";
                    col.template = checkboxHtml + col.template;
                }
                var value = '<~% if(row["$1"] != null && row["$1"].toString() != ""){%~><~%=row["$1"]%~><~% }else{%~>' + defaultValue + "<~%}%~>";
                col.template = col.template.replace(/<~%=((\S)*?)%~>/gm, value);
            }
            colConfig[i] = col;
        }
        if (typeof this.config.onSelectHandler != "undefined") {
            this.config.hasCustomHandler = true;
        } else {
            this.config.hasCustomHandler = false;
            this.config.onSelectHandler = function (obj) {
                if (typeof console != "undefined") {
                    console.log(obj);
                }
            };
        }
        this.config.dataTemplate = "";
        if (this.config.overflowRows.enabled) {
            this.config.dataTemplate += '<div class="' + this.config.overflowRows.overflowClass + '"  style="max-height:' + this.config.overflowRows.overflowHeight + ';" >';
        }
        this.config.dataTemplate += '<div class="dataSet">' + "<~% _.each(data, function(row) { if (row != null) { %~>" + '	<div class="rows">' + _.template(this.config.rowTemplate, {
            colConfigs: colConfig,
            hasCustomHandler: this.config.hasCustomHandler,
            className: typeof this.config.gridClass != "undefined" ? this.config.gridClass : ""
        }) + "   </div>" + "<~%}});%~>" + "</div>";
        if (this.config.overflowRows.enabled) {
            this.config.dataTemplate += "</div>";
        }
    };
    ivGrid.prototype.setStaticContent = function () {
        if (this.config.gridType == "static") {
            var pager = this.config.pager;
            pager.totalPages = Math.ceil(this.config.data.length / pager.resultsPerPage);
            this.config.pager = pager;
        }
        this.config.headerHtml = _.template(this.config.headerTemplate, {
            colConfigs: this.config.colConfig,
            className: typeof this.config.gridClass != "undefined" ? this.config.gridClass : ""
        });
        this.config.searchHtml = _.template((typeof this.config.liveFilter != "undefined" && this.config.liveFilter) ? this.config.liveSearchTemplate : this.config.defaultSearchTemplate, {
            label: this.config.searchLabel,
            defaultText: this.config.searchDefaultText
        });
        var html = (this.config.filter == false) ? "" : this.config.searchHtml;
        html += this.config.headerHtml;
        this.gridContainer.append(html);
    };
    ivGrid.prototype.getData = function (isDefaultLoad, resetStartIndexFlag) {
        var isUserAction = true;
        if (typeof isDefaultLoad !== "undefined") {
            if (isDefaultLoad) {
                isUserAction = false;
            }
        }
        var resetStartIndex = false;
        if (typeof resetStartIndexFlag !== "undefined") {
            if (resetStartIndexFlag) {
                resetStartIndex = true;
            }
        }
        var config = this.config;
        this.gridContainer.find(".white-overlay").show();
        if (config.gridType == "static") {
            this.getDataCallback();
        } else {
            if (config.gridType == "dynamic" && isDefaultLoad && config.data.length > 0) {
                this.getDataCallback(config.data, isDefaultLoad);
            } else {
                var $this = this;
                config.dataSourceParams.pageNum = $this.config.pager.pageNum;
                if (resetStartIndex) {
                    config.dataSourceParams.startIndex = 0;
                } else {
                    config.dataSourceParams.startIndex = $this.gridContainer.find(".dataSet .rows").length;
                }
                config.dataSourceParams.resultsPerPage = $this.config.pager.resultsPerPage;
                var postParams = {
                    resource: config.dataSource,
                    urlParams: config.dataSourceParams,
                    success: function (resp) {
                        $this.getDataCallback(resp);
                    },
                    error: function (resp) {
                        $this.getDataCallback(resp);
                    },
                    responseType: "json"
                };
                if (isUserAction) {
                    iv.api.userAction.doPost(postParams);
                } else {
                    iv.api.doPost(postParams);
                }
            }
        }
    };
    ivGrid.prototype.delegatePageEvents = function () {
        var $this = this;
        $this.gridContainer.undelegate(".page", "click");
        $this.gridContainer.undelegate(".loadMoreLink a", "click");
        $this.gridContainer.delegate(".page", "click", function () {
            var page = $(this);
            if (!page.hasClass("active-page")) {
                var pageNum = parseInt($this.config.pager.pageNum);
                var resultsPerPage = parseInt($this.config.pager.resultsPerPage);
                if (page.hasClass("pageprev")) {
                    if (pageNum % resultsPerPage == 0) {
                        pageNum = pageNum - resultsPerPage;
                    } else {
                        pageNum -= (pageNum % resultsPerPage);
                    }
                } else {
                    if (page.hasClass("pagenext")) {
                        if (pageNum % resultsPerPage == 0) {
                            pageNum++;
                        } else {
                            pageNum = pageNum - (pageNum % resultsPerPage) + resultsPerPage + 1;
                        }
                    } else {
                        pageNum = parseInt(page.attr("name").replace("page-", ""));
                        $this.gridContainer.find(".active-page").removeClass("active-page");
                        page.addClass("active-page");
                    }
                }
                $this.config.pager.pageNum = pageNum;
                $this.getData();
            }
            return false;
        });
        $this.gridContainer.delegate(".loadMoreLink a", "click", function () {
            $(this).find("span").text("Loading more");
            var pager = $this.config.pager;
            var pageNum = parseInt(pager.pageNum);
            if (pageNum == 1) {
                pager.firstCount = parseInt(pager.resultsPerPage);
            }
            var rowsCountMultiplier = parseInt(pager.rowsCountMultiplier);
            pager.resultsPerPage = pager.firstCount * Math.pow(rowsCountMultiplier, (pageNum));
            pager.pageNum = pageNum + 1;
            $this.getData();
        });
    }, ivGrid.prototype.delegateSearchEvents = function () {
        var $this = this;
        $this.gridContainer.undelegate("input.searchBox", "keyup");
        $this.gridContainer.undelegate("input.searchBox", "click");
        $this.gridContainer.undelegate("input.searchBox", "blur");
        $this.gridContainer.undelegate(".searchBoxRightImage", "click");
        $this.gridContainer.undelegate(".searchLink", "click");
        if ($this.config.filter != "false") {
            $this.gridContainer.delegate("input.searchBox", "keyup", function () {
                if ($(this).val() == $this.config.searchDefaultText || $(this).val() == "") {
                    $(this).css("color", "#666666");
                } else {
                    $(this).css("color", "#333333");
                }
            });
            $this.gridContainer.delegate("input.searchBox", "click", function () {
                if ($(this).val() == $this.config.searchDefaultText) {
                    $(this).val("").css("color", "#333333");
                }
            });
            $this.gridContainer.delegate("input.searchBox", "blur", function () {
                if (jQuery.trim($(this).val()) == "") {
                    $(this).val($this.config.searchDefaultText).css("color", "#666666");
                }
            });
            $this.gridContainer.delegate(".searchBoxRightImage", "click", function () {
                var value = $this.gridContainer.find("input.searchBox").val();
                if (jQuery.trim(value) != $this.config.searchDefaultText) {
                    $this.config.dataSourceParams.searchTerm = jQuery.trim(value);
                    $this.config.pager.pageNum = 1;
                    $this.config.pageData = [];
                    $this.getData(false, true);
                }
            });
            $this.gridContainer.delegate(".searchLink", "click", function () {
                $this.gridContainer.find("input.searchBox").val($this.config.searchDefaultText).css("color", "#666666");
                $this.config.dataSourceParams.searchTerm = "";
                $this.config.pageData = [];
                $this.getData();
            });
            $this.gridContainer.delegate("input.searchBox", "keyup", function (event) {
                if ((!_.isUndefined($this.config.liveFilter) && $this.config.liveFilter) || event.which == 13) {
                    var value = $this.gridContainer.find("input.searchBox").val();
                    if ($this.config.searchDefaultText == "" || jQuery.trim(value) != $this.config.searchDefaultText) {
                        $this.config.dataSourceParams.searchTerm = jQuery.trim(value);
                        $this.config.pageData = [];
                        $this.getData();
                    }
                }
            });
            setTimeout(function () {
                $this.gridContainer.find("input.searchBox").click().focus();
            }, 10);
        }
    }, ivGrid.prototype.delegateSortEvents = function () {
        var $this = this;
        $this.gridContainer.delegate(".rows-header > div", "click", function () {
            var col = $(this);
            if (col.hasClass("not-sortable") || col.hasClass("fillerRight") || col.hasClass("fillerLeft")) {
                return;
            }
            var span = col.find("span.common_sprites");
            if (span.hasClass("ascending_arrow")) {
                $this.config.dataSourceParams.sortOrder = "desc";
                span.removeClass("ascending_arrow").addClass("descending_arrow");
            } else {
                if (span.hasClass("descending_arrow")) {
                    $this.config.dataSourceParams.sortOrder = "asc";
                    span.removeClass("descending_arrow").addClass("ascending_arrow");
                } else {
                    $this.config.dataSourceParams.sortOrder = "asc";
                    span.removeClass("descending_arrow_disabled").addClass("ascending_arrow");
                    $this.config.dataSourceParams.sortType = col.attr("name");
                }
            }
            $this.getData();
        });
    }, ivGrid.prototype.delegateSelectionEvents = function () {
        var $this = this;
        $this.gridContainer.delegate(".data", "click", function () {
            $this.config.selectedIndex = $this.gridContainer.find(".rows").index($(this).parent());
            if ($this.config.gridType == "static") {
                var pager = $this.config.pager;
                $this.config.selectedIndex += (pager.pageNum - 1) * pager.resultsPerPage;
            }
            var selectedObj = $this.getSelectedObject();
            $this.config.onSelectHandler(selectedObj);
        });
    }, ivGrid.prototype.getDataCallback = function (resp, isDefaultLoad) {
        this.gridContainer.find(".white-overlay").hide();
        this.gridContainer.find("a.loadMoreMessage span").text("Load more");
        if (typeof resp != "undefined" && typeof resp.error != "undefined" && resp.error) {
            return;
        }
        if (typeof isDefaultLoad == "undefined") {
            isDefaultLoad = false;
        }
        var config = this.config;
        if (config.gridType != "static" && !isDefaultLoad) {
            if (config.dataSuffix != "") {
                this.config.data = resp.data[config.dataSuffix];
                var pager = this.config.pager;
                if (typeof resp.data.pagingParams != "undefined") {
                    var pagingParams = resp.data.pagingParams;
                    if (typeof pagingParams.pageNum != "undefined" && pagingParams.pageNum > 0) {
                        pager.pageNum = pagingParams.pageNum;
                    }
                    if (typeof pagingParams.totalPages != "undefined" && pagingParams.totalPages >= 0) {
                        pager.totalPages = pagingParams.totalPages;
                    }
                    if (typeof pagingParams.totalRecords != "undefined" && pagingParams.totalRecords >= 0) {
                        pager.totalRecords = pagingParams.totalRecords;
                    }
                }
                pager.startRecord = ((pager.pageNum - 1) * pager.resultsPerPage) + 1;
                var endRecord = pager.pageNum * pager.resultsPerPage;
                endRecord = endRecord > pager.totalRecords ? pager.totalRecords : endRecord;
                pager.endRecord = endRecord;
                this.config.pager = pager;
                pager = null;
            } else {
                var newResp = resp.data;
                if (typeof this.config.preRenderCallback != "undefined") {
                    newResp = this.config.preRenderCallback(resp.data);
                }
                this.config.data = newResp;
            }
        }
        this.applyData();
        this.config.renderCallback(this.config.data);
    };
    ivGrid.prototype.applyData = function () {
        var sortType = this.config.dataSourceParams.sortType;
        var sortOrder = this.config.dataSourceParams.sortOrder;
        var searchTerm = jQuery.trim(this.config.dataSourceParams.searchTerm);
        var searchFields = [this.config.colConfig[0].name];
        if (typeof this.config.dataSourceParams.searchFields != "undefined") {
            searchFields = this.config.dataSourceParams.searchFields;
        }
        var html = "";
        if (this.config.gridType == "static") {
            var data = this.config.data;
            data = _.sortBy(data, function (row) {
                if (typeof row[sortType] != "undefined") {
                    if (typeof row[sortType] == "string") {
                        return String(row[sortType]).toLowerCase();
                    } else {
                        return row[sortType];
                    }
                }
                return 1;
            });
            if (sortOrder == "desc") {
                data = data.reverse();
            }
            $("body").append('<div id="utilDiv" style="display:none;"></div>');
            var encodedText = $("#utilDiv").text(searchTerm.toLowerCase()).html();
            data = _.select(data, function (row) {
                var dataString = "";
                for (var i = 0; i < searchFields.length; i++) {
                    dataString += (typeof row[searchFields[i]] != "undefined" ? row[searchFields[i]] : "");
                }
                return (searchTerm != "") ? dataString.toLowerCase().indexOf(encodedText) >= 0 : true;
            });
            $("#utilDiv").remove();
            var pager = this.config.pager;
            if (data.length != this.config.pageData.length || data.length == 0) {
                pager.totalPages = Math.ceil(data.length / pager.resultsPerPage);
                pager.pageNum = 1;
                pager.totalRecords = data.length;
            }
            this.config.pageData = data;
            pager.startRecord = ((pager.pageNum - 1) * pager.resultsPerPage) + 1;
            var endRecord = pager.pageNum * pager.resultsPerPage;
            endRecord = endRecord > pager.totalRecords ? pager.totalRecords : endRecord;
            pager.endRecord = endRecord;
            this.config.pager = pager;
            if (this.config.pager.type == "non-linear" && typeof this.config.pager.firstCount != "undefined") {
                var a = this.config.pager.firstCount;
                var r = this.config.pager.rowsCountMultiplier;
                var n = pager.pageNum;
                var start = a * (Math.pow(r, n - 1) - 1) / (r - 1);
            } else {
                var start = ((pager.pageNum - 1) * pager.resultsPerPage);
            }
            if (this.config.pager.type == "non-linear" && typeof this.config.pager.firstCount != "undefined" && pager.pageNum == 1) {
                pager.resultsPerPage = pager.firstCount;
            }
            var end = start + pager.resultsPerPage;
            if (pager.type == "non-linear") {
                pager.totalShownRecords = end;
            }
            data = data.slice(start, end);
            html = _.template(this.config.dataTemplate, {
                colConfigs: this.config.colConfig,
                data: data
            });
            if (this.config.pager.type == "non-linear" && this.config.pager.pageNum != 1) {
                var loadedHTML = html;
                loadedHTML = loadedHTML.substring(21, loadedHTML.length - 6);
            }
            if (data.length == 0) {
                html = '<div class="dataSet"><div class="rows"><div class="fillerLeft"></div><div class="row-text">' + this.config.emptyMessage + "</div></div></div>";
            }
        } else {
            html = _.template(this.config.dataTemplate, {
                colConfigs: this.config.colConfig,
                data: this.config.data
            });
            if (this.config.data.length == 0) {
                html = '<div class="dataSet"><div class="rows"><div class="row-text">' + this.config.emptyMessage + "</div></div></div>";
            }
        }
        var pager = this.config.pager;
        if (pager.type == "linear" && pager.totalPages > 1) {
            html += _.template(this.config.pagerTemplate, {
                pager: this.config.pager
            });
        }
        if (pager.type == "non-linear" && pager.totalRecords > pager.resultsPerPage && pager.pageNum == 1) {
            html += _.template(this.config.loadMoreTemplate, {});
        }
        this.gridContainer.find(".ascending_arrow").removeClass("ascending_arrow");
        this.gridContainer.find(".descending_arrow").removeClass("descending_arrow");
        this.gridContainer.find(".descending_arrow_disabled").removeClass("descending_arrow_disabled");
        this.gridContainer.find(".sortable-column  span.common_sprites").addClass("descending_arrow_disabled");
        this.gridContainer.find("div[name=" + sortType + "] span.common_sprites").removeClass("descending_arrow_disabled").addClass(sortOrder + "ending_arrow");
        if (pager.type == "non-linear" && pager.pageNum != 1 && typeof pager.totalShownRecords != "undefined") {
            if (pager.totalRecords <= pager.totalShownRecords) {
                this.gridContainer.find("div.loadMoreLink").hide();
            }
            this.gridContainer.find("div.dataSet").append(loadedHTML);
        } else {
            if (pager.type == "non-linear" && pager.pageNum != 1 && this.config.type != "static") {
                html = $(html).html();
                this.gridContainer.find("div.dataSet").append(html);
                if (pager.totalRecords <= this.gridContainer.find(".rows").length) {
                    this.gridContainer.find("div.loadMoreLink").hide();
                }
            } else {
                this.gridContainer.find("div.dataSet, div.pages, div.loadMoreLink , div." + this.config.overflowRows.overflowClass).remove();
                this.gridContainer.append(html);
            }
        }
        if (searchTerm == "" || searchTerm == this.config.searchDefaultText) {
            $("a.searchLink").hide();
        } else {
            $("a.searchLink").show();
        }
        if (typeof this.config.customHandler != "undefined") {
            this.config.customHandler(this);
        }
    };
    ivGrid.prototype.getContainer = function () {
        return this.gridContainer;
    };
    ivGrid.prototype.getSelectedObject = function () {
        if (this.config.gridType == "static") {
            return this.config.pageData[this.config.selectedIndex];
        } else {
            return this.config.data[this.config.selectedIndex];
        }
    };
    $.fn.setupIvGrid = function (options) {
        var grid = new ivGrid(this, options);
        return grid;
    };
})(jQuery);
registerNS("iv.userExperiments");
iv.userExperiments = {
    exptList: [],
    exptObjs: {},
    eventTrigger: {},
    registerForEventTrigger: function (expId, eventTrigger, cb) {
        if (typeof eventTrigger === "boolean" && eventTrigger) {
            this.eventTrigger[expId] = {
                "eventTrigger": eventTrigger,
                "callback": cb
            };
        }
    },
    init: function (exptConfig) {
        this.exptList = exptConfig;
        var len = this.exptList.length;
        for (var i = 0; i < len; i++) {
            this.processExpt(this.exptList[i]);
            if (typeof this.eventTrigger[this.exptList[i].expId] === "undefined" || !this.eventTrigger[this.exptList[i].expId].eventTrigger) {
                if (!this.exptObjs[this.exptList[i].expId].isRunning && !this.exptObjs[this.exptList[i].expId].isDisabled) {
                    this.exptObjs[this.exptList[i].expId].isRunning = true;
                    this.initHandler(this.exptObjs[this.exptList[i].expId]);
                }
            } else {
                var c = _.bind(this.eventTrigger[this.exptList[i].expId].callback, this, this.exptList[i]);
                c();
            }
        }
    },
    triggerExperiment: function (expId) {
        if (typeof this.exptObjs[expId] !== "undefined") {
            if (this.exptObjs[expId].isRunning || this.exptObjs[expId].isDisabled) {
                return;
            }
            this.exptObjs[expId].isRunning = true;
            this.initHandler(this.exptObjs[expId]);
        }
    },
    processExpt: function (expt) {
        expt.template = this.getExptTemplate(expt);
        this.exptObjs[expt.expId] = expt;
        this.exptObjs[expt.expId].isRunning = false;
        this.exptObjs[expt.expId].isDisabled = false;
    },
    getExptTemplate: function (expt) {
        return iv.ui.getTemplate("userExperiments.exp" + expt.expId + "grp" + expt.grpId);
    },
    initHandler: function (expt) {
        if (expt.expId === "0") {
            this.showFirstUse(expt);
            this.exp0AttachEvents(expt);
        } else {
            if (expt.expId === "1") {
                this.showOnGoingUse(expt);
                this.exp1AttachEvents(expt);
            }
        }
    },
    exp0AttachEvents: function (expt) {
        var $this = this;
        $(".firstUseBg,#FUE-Learn-More").bind("click", function () {
            $this.triggerFUEEvent(expt, this.id);
        });
        $(".start-using-iv").click(function () {
            var action = this.id;
            $this.hideFirstUse();
            $this.trackEvent(action, expt);
            $this.disableFeature(expt);
            return false;
        });
    },
    exp1AttachEvents: function (expt) {
        var $this = this;
        $(".crossOue,.closeTip").click(function () {
            var action = "OUE-expId" + expt.expId + "-grp" + expt.grpId + "-" + this.id;
            $this.trackEvent(action, expt);
            $this.disableFeature(expt);
            $this.hideOnGoingUse();
            return false;
        });
    },
    showFirstUse: function (expt) {
        var opaqueLayer = '<div id="fue-opaqueLayer" class="opaqueLayer" style="width:100%;bottom:0;display:block;height:100%;position:fixed;"></div>';
        var fueContainer = '<div style="position:absolute;z-index:100004;top:50%;left:50%;margin:-190px 0 0 -372px;" id="firstUseContainer">';
        var fueContainerEnd = "</div>";
        var html = opaqueLayer + fueContainer + iv.ui.getTemplate("userExperiments.firstUseHeader");
        html += this.exptObjs[expt.expId].template;
        html += iv.ui.getTemplate("userExperiments.firstUseFooter");
        html += fueContainerEnd;
        $(document.body).append(html);
    },
    ieSevenHandleForOUE: function () {
        if (iv.isMashup) {
            if ($("#oue-container").css("display") !== "none") {
                this.fixPositionForIeSevenInOue();
            }
        }
    },
    fixPositionForIeSevenInOue: function () {
        if (iv.isMashup) {
            var left = $(".smart-agent-tabs").offset().left + $(".smart-agent-tabs").width();
            var top = "65px";
            $(".smart-agent-tabs").css("position", "static");
            $("#oue-container").css("position", "fixed");
            $("#oue-container").css({
                "top": top,
                "left": left + "px"
            });
            $(".lt_arrow").css("height", "35px");
        }
    },
    showOnGoingUse: function (expt) {
        var oueHtml = _.template(expt.template, {
            grp: expt.grpId
        });
        if (expt.grpId === "0" || expt.grpId === "1") {
            $(".smart-agent-tabs").append(oueHtml);
            $(".smart-agent-tabs").css("position", "relative");
            $("#oue-container").css("left", "125px");
            $("#oue-container").css("top", "-90px");
            if ($.browser.msie) {
                if ($.browser.version === "7.0") {
                    this.fixPositionForIeSevenInOue();
                    if ($("#content_panel")) {}
                }
            }
        } else {
            if (expt.grpId === "2") {
                $("#tabPeople").append(oueHtml);
                $("#tabPeople").css("position", "relative");
                $("#oue-container").css("left", "-52px");
                $("#oue-container").css("top", "20px");
            } else {
                if (expt.grpId === "3") {}
            }
        }
        $("#oue-container").fadeIn();
    },
    triggerFUEEvent: function (expt, action) {
        if (action === "FUE-firstUse_findProspects") {
            iv.userExperiments.trackEvent(action, expt);
            window.open("http://community.insideview.com/t5/Getting-Started/Find-Better-Prospects/ta-p/1119");
        } else {
            if (action === "FUE-firstUse_qualify") {
                iv.userExperiments.trackEvent(action, expt);
                window.open("http://community.insideview.com/t5/Getting-Started/Qualify-your-Leads-and-Opportunities-Quickly/ta-p/1125");
            } else {
                if (action === "FUE-firstUse_engage") {
                    iv.userExperiments.trackEvent(action, expt);
                    window.open("http://community.insideview.com/t5/Getting-Started/Engage-Prospects-and-Customers/ta-p/1127");
                } else {
                    if (action === "FUE-firstUse_findOppor") {
                        iv.userExperiments.trackEvent(action, expt);
                        window.open("http://community.insideview.com/t5/Getting-Started/Find-Opportunities-to-Reach-Out-to-Customers/ta-p/1133");
                    } else {
                        if (action === "FUE-firstUse_referrals") {
                            iv.userExperiments.trackEvent(action, expt);
                            window.open("http://community.insideview.com/t5/Getting-Started/Get-Referrals-to-Key-Decision-Makers/ta-p/1141");
                        } else {
                            if (action === "FUE-firstUse_startConver") {
                                iv.userExperiments.trackEvent(action, expt);
                                window.open("http://community.insideview.com/t5/Getting-Started/Start-Conversations-with-Prospects-and-Customers/ta-p/1091");
                            } else {
                                iv.userExperiments.trackEvent(action, expt);
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    trackEvent: function (url, expt) {
        if (typeof expt !== "undefined") {
            if (this.exptObjs[expt.expId].isDisabled) {
                return false;
            }
            iv.util.logUserActivity(url);
        } else {
            if (typeof console !== "undefined") {
                if (typeof console.log !== "undefined") {
                    console.log("WE CANT FIND EXPT OBJECT TO TRACK > PLEASE PASS THE SAME TO TRACK EVENT API");
                }
            }
        }
    },
    disableFeature: function (expt) {
        if (typeof expt !== "undefined") {
            if (this.exptObjs[expt.expId].isDisabled) {
                return false;
            }
            this.exptObjs[expt.expId].isRunning = false;
            this.exptObjs[expt.expId].isDisabled = true;
            iv.api.userAction.getContent({
                resource: "/iv/productMessage.do",
                urlParams: {
                    methodName: "messageShown",
                    featureId: expt.featureId
                },
                success: function () {},
                error: function () {}
            });
        } else {
            if (typeof console !== "undefined") {
                if (typeof console.log !== "undefined") {
                    console.log("WE CANT FIND EXPT OBJECT TO TRACK > PLEASE PASS THE SAME TO DISABLE FEATURE API");
                }
            }
        }
    },
    hideFirstUse: function () {
        $("#fue-opaqueLayer").hide();
        $("#firstUseContainer").hide();
        $("#outer").show();
    },
    hideOnGoingUse: function () {
        $("#oue-container").hide();
        $(".smart-agent-tabs").removeAttr("position");
    }
};
registerNS("iv.stopPoint");
iv.stopPoint = {
    data: null,
    templates: {},
    init: function (config) {
        this.data = config;
        this.templates = config.templates;
        this.baseTemplate = iv.ui.getTemplate("stopPoint.baseTemplate");
    },
    applyBaseTemplate: function (key) {
        var obj = $.extend(this.templates[key], {
            "stopPointKey": key
        });
        return _.template(this.baseTemplate, obj);
    },
    getTemplate: function (key) {
        if (typeof (this.templates[key]) !== "undefined") {
            return this.applyBaseTemplate(key);
        } else {
            return false;
        }
    },
    mod: null,
    show: function (key) {
        this.initModal(this.getTemplate(key));
        iv.util.logUserActivity("stop_point_" + key + "_exposed");
        iv.util.trackToMarketo("clickLink", "stop_point_" + key + "_exposed");
        return false;
    },
    attachStopPointEvents: function () {},
    logClickedPoints: function (key) {
        iv.util.logUserActivity("upgrade_flow_" + key + "_clicked");
        iv.util.trackToMarketo("clickLink", "upgrade_flow_" + key + "_clicked");
    },
    initModal: function (msg) {
        var m = false,
            s = false,
            d = false;
        if (typeof (this.data.isMashup) === "boolean" && this.data.isMashup) {
            m = true;
        }
        if (m) {
            s = this.data.crmSize;
            d = true;
        }
        this.mod = new modal();
        this.mod.initModalDialog({
            metrics: {
                width: 420
            },
            content: msg,
            callback: _.bind(this.attachStopPointEvents, this),
            mashup: m,
            crmSize: s,
            displayOverlayMashup: d,
            controlsEnabled: true,
            moveControlEnabled: false
        });
        this.mod.displayModal();
    }
};

function modal() {
    this.container = document.getElementById("container");
    this.overlay = document.getElementById("overlay");
    this.contentDiv = document.getElementById("modal-content");
    this.autoResize = false;
    this.content = "";
    this.data = null;
    this.metrics = null;
    this.controlsEnabled = false;
    this.moveControl = false;
    this.mashup = false;
    this.staticTopPosition = null;
    this.disableOverlay = false;
    this.displayOverlayMashup = false;
    this.showOverlayMashup = false;
    this.crmSize = "full";
    this.screenMetrics = null;
    this.showModal = true;
    this.callback = null;
    var that = this;

    function showLayer() {
        if (that.disableOverlay) {
            that.overlay.style.display = "none";
            return;
        }
        if (that.overlay != null && !that.mashup) {
            that.overlay.style.display = "block";
            that.showOverlayMashup = true;
        } else {
            if (that.displayOverlayMashup && that.mashup) {
                that.overlay.style.display = "block";
            }
            that.showOverlayMashup = true;
        }
        setLayerPosition();
    }

    function setLayerPosition() {
        if (that.showModal) {
            if (that.overlay != null && that.showOverlayMashup) {
                if (that.screenMetrics.height <= that.metrics.height) {
                    that.screenMetrics.height = that.metrics.height + 50;
                } else {
                    if (that.screenMetrics.height <= (that.metrics.height + 40)) {
                        that.screenMetrics.height = that.metrics.height + 50;
                    }
                }
                that.overlay.style.width = (that.screenMetrics.width - 20) + "px";
                that.overlay.style.height = (that.screenMetrics.height - 5) + "px";
            }
        }
    }

    function getBrowserHeight() {
        var intViewH = 0;
        var intW = 0;
        if (typeof window.innerWidth == "number") {
            intViewH = window.innerHeight;
            intW = window.innerWidth;
        } else {
            if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                intViewH = document.documentElement.clientHeight;
                intW = document.documentElement.clientWidth;
            } else {
                if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                    intViewH = document.body.clientHeight;
                    intW = document.body.clientWidth;
                }
            }
        }
        var D = document;
        var intH = Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
        var docH = $(document).height();
        if (parseInt(docH) > parseInt(intH)) {
            intH = docH;
        }
        return {
            width: parseInt(intW),
            height: parseInt(intH),
            viewPortHeight: parseInt(intViewH)
        };
    }
    this.controls = "";

    function fillContainer(content) {
        if (that.showModal) {
            if (!that.controlsEnabled) {
                if (iv.isMashup) {
                    if (iv.isSmallMashup) {
                        that.controlsEnabled = true;
                    }
                }
            }
            if (that.controlsEnabled) {
                that.controls = '<div class="modal_controls">';
                if (that.moveControl) {
                    that.controls += '<div title="Move" class="modal_move"></div>';
                } else {
                    that.controls += '<div title="Move" class="modal_move" style="background:transparent; cursor: auto;"></div>';
                }
                that.controls += '<div title="Close" class="modal_close close redCrossButton"></div>';
                that.controls += "</div>";
            }
            that.contentDiv.innerHTML = that.controls + content;
            if (that.container != null) {
                that.container.style.display = "block";
            }
            that.setPosition();
        }
    }
    this.setScreenMetrics = function () {
        this.screenMetrics = getBrowserHeight();
    };
    this.getBoundingRect = function (node) {
        var r = node.getBoundingClientRect();
        var contentHeight, contentWidth;
        if ($.browser.msie) {
            contentHeight = parseInt(r.bottom - r.top);
            contentWidth = parseInt(r.right - r.left);
        } else {
            contentHeight = parseInt(r.height);
            contentWidth = parseInt(r.width);
        }
        return {
            "contentHeight": contentHeight,
            "contentWidth": contentWidth
        };
    };

    function setModalConfig() {
        var contentHeight, contentWidth;
        if (that.autoResize) {
            var bounding = that.getBoundingRect(that.contentDiv.children[0]);
            contentWidth = bounding.contentWidth;
        }
        if (that.metrics == null) {
            alert("Metrics are missing for modal");
            that.showModal = false;
            return;
        }
        var m = that.metrics;
        if (that.autoResize) {
            m = {
                width: contentWidth
            };
        }
        var twid = m.width;
        that.container.style.width = twid + 85 + "px";
        that.contentDiv.style.width = twid + "px";
    }
    this.setPosition = function () {
        var contentHeight, contentWidth;
        var bounding = this.container.getBoundingClientRect();
        if (!this.autoResize) {
            contentHeight = bounding.bottom - bounding.top;
            var contentWidth = this.metrics.width;
        }
        if (this.autoResize) {
            var bounding = this.contentDiv.getBoundingClientRect();
            if ($.browser.msie) {
                contentHeight = bounding.bottom - bounding.top;
                contentWidth = bounding.right - bounding.left;
            } else {
                contentHeight = bounding.height;
                contentWidth = bounding.width;
            }
        }
        if (this.container != null) {
            var x = parseInt((this.screenMetrics.width - (contentWidth + 70)) / 2);
            this.container.style.left = x + "px";
            if (this.screenMetrics.viewPortHeight <= contentHeight) {
                this.screenMetrics.viewPortHeight = contentHeight;
            }
            var scrollTop = 0;
            if (typeof document.body.scrollTop != "undefined" && document.body.scrollTop > 0) {
                scrollTop = document.body.scrollTop;
            }
            if (typeof document.documentElement != "undefined" && typeof document.documentElement.scrollTop != "undefined" && document.documentElement.scrollTop > 0) {
                scrollTop = document.documentElement.scrollTop;
            }
            if (that.mashup && that.staticTopPosition != null) {
                this.container.style.top = that.staticTopPosition;
            } else {
                this.container.style.top = parseInt(scrollTop + ((this.screenMetrics.viewPortHeight - (contentHeight + 20)) / 2)) + "px";
            }
            if (that.crmSize == "small") {
                this.container.style.top = 0 + "px";
            }
        }
    };
    this.resizeEvent = function () {
        this.setScreenMetrics();
        this.setPosition();
        setLayerPosition();
    };
    this.initModalDialog = function (params) {
        this.showModal = true;
        if (params) {
            if (params.metrics) {
                this.metrics = params.metrics;
            } else {
                if (params.autoResize) {
                    this.metrics = {
                        width: 100
                    };
                } else {
                    alert("Metrics are missing.");
                    this.showModal = false;
                }
            }
            if (params.content) {
                this.content = params.content;
            }
            if (params.contentLocation) {
                this.content = document.getElementById(params.contentLocation).innerHTML;
            }
            if (params.callback) {
                this.callback = params.callback;
            } else {
                alert("no callback");
            }
            if (params.autoResize === true) {
                this.autoResize = params.autoResize;
            }
            if (params.data) {
                this.data = params.data;
            }
            if (params.mashup) {
                this.mashup = params.mashup;
            }
            if (params.displayOverlayMashup) {
                this.displayOverlayMashup = params.displayOverlayMashup;
            }
            if (params.crmSize) {
                this.crmSize = params.crmSize;
            }
            if (params.disableOverlay) {
                this.disableOverlay = params.disableOverlay;
            }
            if (typeof params.controlsEnabled === "boolean") {
                this.controlsEnabled = params.controlsEnabled;
                this.moveControl = true;
                if (typeof params.moveControlEnabled === "boolean") {
                    this.moveControl = params.moveControlEnabled;
                }
            }
            if (typeof params.staticTopPosition != "undefined") {
                this.staticTopPosition = params.staticTopPosition;
            }
        } else {
            alert("Params are missing. Cannot show modal.");
            this.showModal = false;
            return;
        }
    };
    this.displayModal = function (oneTimeData) {
        this.setScreenMetrics();
        showLayer();
        fillContainer(this.content);
        setModalConfig();
        var ref = this;
        window.onresize = function () {
            ref.resizeEvent();
        };
        if (this.data) {
            if (oneTimeData !== undefined || oneTimeData !== null) {
                this.data["oneTimeData"] = oneTimeData;
            }
            this.callback(this.data);
        } else {
            if (oneTimeData !== undefined || oneTimeData !== null) {
                this.callback(oneTimeData);
            } else {
                this.callback();
            }
        }
        setModalConfig();
        this.setPosition();
        if (this.controlsEnabled) {
            this.controlEvents(this.moveControl);
        }
        $(document).bind("scroll", function () {
            var hgt = $(document).height();
            $(".opaqueLayer").css("height", hgt);
        });
    };
    this.controlEvents = function (enableMove) {
        if (enableMove) {
            $("#container").drag(function (ev, dd) {
                $(this).css({
                    top: dd.offsetY,
                    left: dd.offsetX
                });
                $(this).find("input").trigger("blur");
            }, {
                handle: ".modal_move"
            });
        }
        $(".modal_close").click(_.bind(this.hideModal, this));
    };
    this.hideModal = function () {
        this.container.style.display = "none";
        this.contentDiv.innerHTML = "";
        this.overlay.style.display = "none";
        window.onresize = null;
        $(document).unbind("scroll");
    };
}
var myModal = new modal();
/* 
 * jquery.event.drag - v 2.0.0
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
(function (f) {
    f.fn.drag = function (b, a, d) {
        var e = typeof b == "string" ? b : "",
            k = f.isFunction(b) ? b : f.isFunction(a) ? a : null;
        if (e.indexOf("drag") !== 0) {
            e = "drag" + e;
        }
        d = (b == k ? a : d) || {};
        return k ? this.bind(e, d, k) : this.trigger(e);
    };
    var i = f.event,
        h = i.special,
        c = h.drag = {
            defaults: {
                which: 1,
                distance: 0,
                not: ":input",
                handle: null,
                relative: false,
                drop: true,
                click: false
            },
            datakey: "dragdata",
            livekey: "livedrag",
            add: function (b) {
                var a = f.data(this, c.datakey),
                    d = b.data || {};
                a.related += 1;
                if (!a.live && b.selector) {
                    a.live = true;
                    i.add(this, "draginit." + c.livekey, c.delegate);
                }
                f.each(c.defaults, function (e) {
                    if (d[e] !== undefined) {
                        a[e] = d[e];
                    }
                });
            },
            remove: function () {
                f.data(this, c.datakey).related -= 1;
            },
            setup: function () {
                if (!f.data(this, c.datakey)) {
                    var b = f.extend({
                        related: 0
                    }, c.defaults);
                    f.data(this, c.datakey, b);
                    i.add(this, "mousedown", c.init, b);
                    this.attachEvent && this.attachEvent("ondragstart", c.dontstart);
                }
            },
            teardown: function () {
                if (!f.data(this, c.datakey).related) {
                    f.removeData(this, c.datakey);
                    i.remove(this, "mousedown", c.init);
                    i.remove(this, "draginit", c.delegate);
                    c.textselect(true);
                    this.detachEvent && this.detachEvent("ondragstart", c.dontstart);
                }
            },
            init: function (b) {
                var a = b.data,
                    d;
                if (!(a.which > 0 && b.which != a.which)) {
                    if (!f(b.target).is(a.not)) {
                        if (!(a.handle && !f(b.target).closest(a.handle, b.currentTarget).length)) {
                            a.propagates = 1;
                            a.interactions = [c.interaction(this, a)];
                            a.target = b.target;
                            a.pageX = b.pageX;
                            a.pageY = b.pageY;
                            a.dragging = null;
                            d = c.hijack(b, "draginit", a);
                            if (a.propagates) {
                                if ((d = c.flatten(d)) && d.length) {
                                    a.interactions = [];
                                    f.each(d, function () {
                                        a.interactions.push(c.interaction(this, a));
                                    });
                                }
                                a.propagates = a.interactions.length;
                                a.drop !== false && h.drop && h.drop.handler(b, a);
                                c.textselect(false);
                                i.add(document, "mousemove mouseup", c.handler, a);
                                return false;
                            }
                        }
                    }
                }
            },
            interaction: function (b, a) {
                return {
                    drag: b,
                    callback: new c.callback,
                    droppable: [],
                    offset: f(b)[a.relative ? "position" : "offset"]() || {
                        top: 0,
                        left: 0
                    }
                };
            },
            handler: function (b) {
                var a = b.data;
                switch (b.type) {
                    case !a.dragging && "mousemove":
                        if (Math.pow(b.pageX - a.pageX, 2) + Math.pow(b.pageY - a.pageY, 2) < Math.pow(a.distance, 2)) {
                            break;
                        }
                        b.target = a.target;
                        c.hijack(b, "dragstart", a);
                        if (a.propagates) {
                            a.dragging = true;
                        }
                    case "mousemove":
                        if (a.dragging) {
                            c.hijack(b, "drag", a);
                            if (a.propagates) {
                                a.drop !== false && h.drop && h.drop.handler(b, a);
                                break;
                            }
                            b.type = "mouseup";
                        }
                    case "mouseup":
                        i.remove(document, "mousemove mouseup", c.handler);
                        if (a.dragging) {
                            a.drop !== false && h.drop && h.drop.handler(b, a);
                            c.hijack(b, "dragend", a);
                        }
                        c.textselect(true);
                        if (a.click === false && a.dragging) {
                            jQuery.event.triggered = true;
                            setTimeout(function () {
                                jQuery.event.triggered = false;
                            }, 20);
                            a.dragging = false;
                        }
                        break;
                }
            },
            delegate: function (b) {
                var a = [],
                    d, e = f.data(this, "events") || {};
                f.each(e.live || [], function (k, j) {
                    if (j.preType.indexOf("drag") === 0) {
                        if (d = f(b.target).closest(j.selector, b.currentTarget)[0]) {
                            i.add(d, j.origType + "." + c.livekey, j.origHandler, j.data);
                            f.inArray(d, a) < 0 && a.push(d);
                        }
                    }
                });
                if (!a.length) {
                    return false;
                }
                return f(a).bind("dragend." + c.livekey, function () {
                    i.remove(this, "." + c.livekey);
                });
            },
            hijack: function (b, a, d, e, k) {
                if (d) {
                    var j = {
                        event: b.originalEvent,
                        type: b.type
                    }, n = a.indexOf("drop") ? "drag" : "drop",
                        l, o = e || 0,
                        g, m;
                    e = !isNaN(e) ? e : d.interactions.length;
                    b.type = a;
                    b.originalEvent = null;
                    d.results = [];
                    do {
                        if (g = d.interactions[o]) {
                            if (!(a !== "dragend" && g.cancelled)) {
                                m = c.properties(b, d, g);
                                g.results = [];
                                f(k || g[n] || d.droppable).each(function (q, p) {
                                    l = (m.target = p) ? i.handle.call(p, b, m) : null;
                                    if (l === false) {
                                        if (n == "drag") {
                                            g.cancelled = true;
                                            d.propagates -= 1;
                                        }
                                        if (a == "drop") {
                                            g[n][q] = null;
                                        }
                                    } else {
                                        if (a == "dropinit") {
                                            g.droppable.push(c.element(l) || p);
                                        }
                                    }
                                    if (a == "dragstart") {
                                        g.proxy = f(c.element(l) || g.drag)[0];
                                    }
                                    g.results.push(l);
                                    delete b.result;
                                    if (a !== "dropinit") {
                                        return l;
                                    }
                                });
                                d.results[o] = c.flatten(g.results);
                                if (a == "dropinit") {
                                    g.droppable = c.flatten(g.droppable);
                                }
                                a == "dragstart" && !g.cancelled && m.update();
                            }
                        }
                    } while (++o < e);
                    b.type = j.type;
                    b.originalEvent = j.event;
                    return c.flatten(d.results);
                }
            },
            properties: function (b, a, d) {
                var e = d.callback;
                e.drag = d.drag;
                e.proxy = d.proxy || d.drag;
                e.startX = a.pageX;
                e.startY = a.pageY;
                e.deltaX = b.pageX - a.pageX;
                e.deltaY = b.pageY - a.pageY;
                e.originalX = d.offset.left;
                e.originalY = d.offset.top;
                e.offsetX = b.pageX - (a.pageX - e.originalX);
                e.offsetY = b.pageY - (a.pageY - e.originalY);
                e.drop = c.flatten((d.drop || []).slice());
                e.available = c.flatten((d.droppable || []).slice());
                return e;
            },
            element: function (b) {
                if (b && (b.jquery || b.nodeType == 1)) {
                    return b;
                }
            },
            flatten: function (b) {
                return f.map(b, function (a) {
                    return a && a.jquery ? f.makeArray(a) : a && a.length ? c.flatten(a) : a;
                });
            },
            textselect: function (b) {
                f(document)[b ? "unbind" : "bind"]("selectstart", c.dontstart).attr("unselectable", b ? "off" : "on").css("MozUserSelect", b ? "" : "none");
            },
            dontstart: function () {
                return false;
            },
            callback: function () {}
        };
    c.callback.prototype = {
        update: function () {
            h.drop && this.available.length && f.each(this.available, function (b) {
                h.drop.locate(this, b);
            });
        }
    };
    h.draginit = h.dragstart = h.dragend = c;
})(jQuery);
(function ($) {
    $.fn.autoscroll = function (options) {
        var settings = {
            handler: function (event) {},
            scrollEventName: "AUTOSCROLL_EVENT",
            maxHandleExecute: -1,
            executionCount: 0,
            threshold: 0,
            needBackToTop: false
        };
        var setupBackToTop = function (container) {
            var html = _.template(iv.ui.getTemplate("autoscroll.backtotop"), {});
            var backtotop = null;
            if (typeof container[0].scrollHeight != "undefined") {
                container.css("position", "relative");
                container.append(html);
                var scrollHeight = String(container[0].scrollHeight).replace(/[px;]/gi, "");
                backtotop = container.find(".autoscroll-backtop");
                backtotop.css("top", Number(scrollHeight - 25) + "px");
            } else {
                container = $(document);
                container.css("position", "relative");
                container.find("body").append(html);
                backtotop = container.find(".autoscroll-backtop");
                backtotop.css("top", (container.height() - 25) + "px");
            }
            backtotop.bind("click", function () {
                container.scrollTop(0);
            });
        };
        var setupAction = function (container, settings) {
            if (settings.needBackToTop) {
                setupBackToTop(container);
            }
            var timerId = -1;
            container.scroll(function (event) {
                var scrollHeight = 0;
                var height = $(this).height();
                if (typeof container[0].scrollHeight != "undefined") {
                    scrollHeight = container[0].scrollHeight;
                } else {
                    if (container[0] == window) {
                        scrollHeight = $(document).height();
                    } else {
                        if (container[0] == document) {
                            scrollHeight = container.height();
                            height = $(window).height();
                        } else {
                            scrollHeight = container.height();
                        }
                    }
                }
                scrollHeight = String(scrollHeight).replace(/[px;]/gi, "");
                var scrollTop = $(this).scrollTop();
                var diff = scrollHeight - (scrollTop + height);
                if (scrollHeight > 0 && diff <= settings.threshold) {
                    if (settings.maxHandleExecute == -1 || settings.executionCount < settings.maxHandleExecute) {
                        iv.hub.publishEvent(settings.scrollEventName, {
                            container: container,
                            settings: settings
                        });
                        settings.executionCount++;
                    }
                }
                var backtotop = container.find(".autoscroll-backtop");
                if (container[0] == window) {
                    backtotop = $(document).find(".autoscroll-backtop");
                }
                backtotop.hide();
                window.clearTimeout(timerId);
                timerId = window.setTimeout(function () {
                    if (scrollTop > 0) {
                        backtotop.show();
                        backtotop.css("top", (scrollTop + Number(height) - 25) + "px");
                    } else {
                        backtotop.hide();
                    }
                }, 500);
            }).trigger("scroll");
            return container;
        };
        return this.each(function () {
            if (options) {
                return setupAction($(this), $.extend({}, settings, options));
            } else {
                return setupAction($(this), $.extend({}, settings));
            }
        });
    };
})(jQuery);
