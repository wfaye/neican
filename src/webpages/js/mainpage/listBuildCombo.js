registerNS("iv.widgets.tab");
iv.widgets.tab = {
    validConfigs: function (data) {
        if (typeof data == "undefined") {
            return false;
        }
        if (typeof data.container == "undefined") {
            return false;
        }
        if (typeof data.container != "string") {
            return false;
        }
        if (typeof data.tabClass == "undefined") {
            return false;
        }
        if (typeof data.tabPanelClass == "undefined") {
            return false;
        }
        if (typeof data.tabPanelClass != "string") {
            return false;
        }
        if (typeof data.tabSelectedClass == "undefined") {
            return false;
        }
        if (typeof data.tabSelectedClass != "string") {
            return false;
        }
        if (typeof data.loader == "undefined") {
            return false;
        }
        if (typeof data.loader != "string") {
            return false;
        }
        if (typeof data.tabMapping == "undefined") {
            return false;
        }
        return true;
    },
    create: function (config) {
        if (!this.validConfigs(config)) {
            iv.util.printToConsole("Invalid config for the tab widget");
            iv.util.printToConsole(config);
            return false;
        }
        return new this.tabHandler(config);
    },
    tabHandler: function (meta) {
        if (meta.tabMapping <= 0) {
            iv.util.printToConsole("You need to give some tabs to map bad boy!");
            return false;
        }
        this.container = $(meta.container);
        var loader = $(meta.loader);
        var loaderParent = loader.parent();
        var tabClass = meta.tabClass;
        var tabSelector = "." + meta.tabClass;
        var tabSelectedClass = meta.tabSelectedClass;
        var tabShowEventCallback = meta.tabShowEventCallback;
        var tabPanelClass = meta.tabPanelClass;
        var allTabs = $(tabSelector);
        var allTabPanels = $("." + tabPanelClass);
        var tabCustomizer = function () {};
        if (typeof meta.tabCustomizer !== "undefined") {
            tabCustomizer = meta.tabCustomizer;
        }
        var $this = this;

        function tabPanel(data) {
            var tab = $this.container.find("#" + data.tabId);
            if (tab.length == 0) {
                return false;
            }
            var tabPanel = $this.container.find("#" + data.tabPanelId);
            var dataSource = data.source;
            var dataType = data.sourceResponseType;
            var cb = data.postLoadCallback;
            var genericCallback = data.genericCallback;
            var preLoaded = false;
            if (data.preLoaded) {
                preLoaded = data.preLoaded;
            }
            var tabLoaded = false;
            var preserveTabState = false;
            if (data.preserveTabState === true) {
                preserveTabState = true;
            }
            var loadTabData = function () {
                if (tabLoaded) {
                    if (preserveTabState) {
                        return;
                    } else {
                        handleTabData();
                    }
                }
                if (dataType === "HTML") {
                    var settings = {
                        resource: dataSource,
                        target: tabPanel,
                        postLoad: function () {
                            handleTabData();
                        }
                    };
                    iv.api.getHtmlContent(settings);
                } else {
                    iv.api.getJson({
                        resource: dataSource,
                        success: function (data) {
                            handleTabData(data);
                        },
                        error: function () {
                            errorHandle();
                        }
                    });
                }
            };
            var errorHandle = function () {};
            var responseDataObject = {
                "tab": tab,
                "tabPanel": tabPanel
            };
            this.getResponseDataObject = function () {
                return responseDataObject;
            };
            var triggerGenericCallback = function () {
                if (typeof genericCallback !== "undefined") {
                    if (typeof genericCallback === "function") {
                        genericCallback(responseDataObject);
                    }
                }
            };
            var tabData = null;
            var handleTabData = function (data) {
                tabLoaded = true;
                if (dataType !== "HTML") {
                    if (typeof data !== "undefined") {
                        tabData = data;
                    }
                    responseDataObject.data = tabData;
                }
                triggerGenericCallback();
                if (typeof cb !== "undefined") {
                    if (typeof cb === "function") {
                        cb(responseDataObject);
                    }
                }
            };
            this.loadTabPanel = function () {
                if (preserveTabState === true && tabLoaded === true) {
                    triggerGenericCallback();
                    return;
                } else {
                    if ((preLoaded === true && tabLoaded === false) || (preLoaded === true && tabLoaded === true && preserveTabState === false)) {
                        handleTabData();
                    } else {
                        if (preLoaded === false && tabLoaded == false) {
                            loadTabData();
                        } else {
                            if (typeof dataSource !== "undefined") {
                                loadTabData();
                            } else {
                                handleTabData();
                            }
                        }
                    }
                }
            };
            this.getTab = function () {
                return tab;
            };
            this.getTabPanel = function () {
                return tabPanel;
            };
            this.resetLoadState = function () {
                tabLoaded = false;
            };
        }
        function postTabLoadHandler(response) {
            loader.hide();
            if (loaderParent.length > 0) {
                loaderParent.css({
                    "position": "static"
                });
            }
            tabShowEventCallback(response);
        }
        this.tabMap = {};
        _.each(meta.tabMapping, function (data) {
            data["genericCallback"] = postTabLoadHandler;
            $this.tabMap[data.tabId] = new tabPanel(data);
        });

        function tabSwitch(targetTab) {
            allTabs.removeClass(tabSelectedClass);
            targetTab.getTab().addClass(tabSelectedClass);
            tabCustomizer(targetTab.getResponseDataObject());
            allTabPanels.hide();
            targetTab.getTabPanel().css("display", "block");
        }
        function tabAction(tabObject) {
            if (loaderParent.length > 0) {
                loaderParent.css({
                    "position": "relative"
                });
            }
            loader.show();
            tabSwitch(tabObject);
            tabObject.loadTabPanel();
        }
        var resetTabLoadState = function (key) {
            $this.tabMap[key].resetLoadState();
        };
        this.reloadTab = function (tabKey) {
            resetTabLoadState(tabKey);
            tabAction(this.tabMap[tabKey]);
        };
        this.container.delegate(tabSelector, "click", function () {
            var targ = $(this);
            targId = targ.attr("id");
            if (typeof targId === "undefined" && targId === "") {
                return false;
            }
            var tabObject = $this.tabMap[targId];
            if (typeof tabObject !== "undefined") {
                if (tabObject.getTab().hasClass("tabSelectedClass")) {
                    return false;
                }
                tabAction(tabObject);
            }
            return false;
        });
        var defaultTabIndex = 0;
        if (typeof meta.defaultTabIndex !== "undefined") {
            defaultTabIndex = meta.defaultTabIndex;
        }
        var defaultTabId = meta.tabMapping[defaultTabIndex].tabId;
        if (typeof defaultTabId !== "undefined") {
            tabAction($this.tabMap[defaultTabId]);
        }
    }
};
registerNS("iv.follow.manager");
iv.follow.manager = {
    processItems: function (list) {
        var $this = this;
        _.each(list, function (item) {
            $this.createFollowWidgetItem(item.selector, item.config);
        });
    },
    createWidgets: function (list) {
        this.processItems(list);
        iv.initMenus();
    },
    createFollowWidgetItem: function (selector, config) {
        var elem = $(selector);
        elem.setupFollow(config);
    }
};
(function ($) {
    var ivFollow = function (elem, options) {
        this.followContainer = elem;
        this.clickedElem = null;
        this.isActionActive = false;
        this.uid = options.uid;
        this.followId = options.followId;
        this.config = {
            entityType: "company",
            followType: "inline",
            trackedByWatchlists: [],
            urls: {
                "follow": "/iv/followEntityInWatchlist.iv",
                "unfollow": "/iv/unfollowEntityFromWatchlist.iv"
            },
            menuHeaderTemplate: '<div id="add_<%=current%>"> <ul class="menu follow-menu ' + "<% if(trackedByWatchlists.length != 0) { %>" + "following-type-<%=followType%> " + "<% } else { %>" + "follow-type-<%=followType%> " + "<% } %>" + ' ieOverride" id="wlAddMenu_<%=uid%>">' + "<li>" + "<% if(trackedByWatchlists.length != 0) { %>" + '<a class="<% if(followType == "inline"){%> hover-button<% } %>" href="javascript:void(0);">' + '<div title="Add <%=entityType%> to your Watchlist" class="following-<%=followType%>-<%=entityType%>">' + '<div class="new-follow-sprite followingSymbol"></div>' + '<span class="textHook float_left">Following</span>' + '<span class="new-follow-sprite track-arw-<%=followType%>"></span> ' + "<% } else { %>" + ' <a class="<% if(followType == "inline"){%> hover-button<% } %>" href="javascript:void(0);">' + '<div title="Add <%=entityType%> to your Watchlist" class="follow-<%=followType%>-<%=entityType%>">' + '<div class="new-follow-sprite followSymbol"></div>' + '<span class="textHook float_left">Follow</span> ' + '<span class="new-follow-sprite float_left track-arw-<%=followType%>"></span> ' + "<% } %>" + "</div>" + '<div style="clear: both; height: 0px; width: 0px;"></div></a>',
            menuBodyTemplate: "<ul>" + "<%_.each(watchlistInfo , function(wlObj){%>" + '<li style="clear:both;">' + '<% if(wlObj["type"] == 2) { %>' + '<~% if($.inArray(wlObj["id"],trackedByWatchlists) > -1 || $.inArray(wlObj["id"],trackedByWatchlists) != -1) { %>' + '<a class="following-<%=entityType%>-freq following-entity freq-viewed-wl" id="<%=wlObj["id"]%>" rel="<%=wlObj["id"]%>"><img src="<%=iv.util.getThemedImageUrl(\'checked2\')%>" height="16" width="16" align="absmiddle" style="visibility:visible"/>&nbsp;' + '<span><%=wlObj["name"]%></span></a>' + "<%}else{%>" + '<span class="dynamic follow" title="Frequently Viewed Watchlist - cannot add ' + " <% entityType == \"company\" ? 'companies' : 'people'; %>" + ' manually."><img width="16" height="16" align="absmiddle" style="visibility:hidden;"  src="<%=iv.util.getThemedImageUrl(\'checked2\')%>">Frequently Viewed</span>' + "<%}%>" + '<%}else if(wlObj["type"] == 0){%>' + '<% if($.inArray(wlObj["id"],trackedByWatchlists) > -1 || $.inArray(wlObj["id"],trackedByWatchlists) != -1) { %>' + '<a rel="<%=wlObj["id"]%>" href="javascript:void(0);" class="following-entity">' + '<img src="<%=iv.util.getThemedImageUrl(\'checked2\')%>" height="16" width="16" align="absmiddle"/>&nbsp;' + "<%}else{%>" + '<a rel="<%=wlObj["id"]%>" href="javascript:void(0);" class="follow-entity">' + '<img src="<%=iv.util.getThemedImageUrl(\'checked2\')%>" height="16" width="16" align="absmiddle" style="visibility:hidden"/>&nbsp;' + "<%}%>" + '<% if(wlObj["name"].length > 17){ wlObj["name"] = wlObj["name"].substring(0,14) + "..."; %>' + "<%}%>" + '<span><%=wlObj["name"]%></span></a>' + '<%}else if(wlObj["type"] == 1){%>' + '<span class="dynamic follow" title="Automated Watchlist - cannot add ' + "<% entityType == \"company\" ? 'companies' : 'people'; %> manually.\">" + '<img src="<%=iv.util.getThemedImageUrl(\'checked2\')%>" height="16" width="16" align="absmiddle" ' + '<% if($.inArray(wlObj["id"],trackedByWatchlists) == -1) { %>' + 'style="visibility:hidden"' + "<%}%>  />&nbsp;" + '<img align="absmiddle" src="/iv/common/styles/images/salesforce_logo.png" style="width:16px;height:16px;padding-right:5px;"/>' + '<% if(wlObj["name"].length > 17){ wlObj["name"] = wlObj["name"].substring(0,14) + "..."; %>' + "<%}%>" + '<%=wlObj["name"]%></span></li>' + "<%}});%>" + "<% if(dynamicCreateWL != false) { %>" + '<li class="createAutomatedWL">' + '<% if(dynamicCreateWL == "enabled") { %>' + '<a href="/iv/watchlist.iv?dynamicWatchlistEnabled=true&newSFDCWatchList=true" target="insideview">' + "<span>Create Automated Watchlist</span></a>" + "<%} else {%>" + '<span class="dynamic">Create Automated Watchlist</span>' + "<%}%>" + "</li>" + "<%}%>" + "</ul></li></ul></div>"
        };
        if (typeof options != "undefined") {
            $.extend(true, this.config, options);
        }
        if (this.config.entityType == "company") {
            this.entityParams = {
                type: "company",
                companyId: this.config.companyId
            };
            this.config.currentId = this.config.companyId;
        } else {
            if (this.config.entityType == "person") {
                this.entityParams = {
                    type: "person",
                    employmentId: this.config.employmentId,
                    executiveId: this.config.executiveId
                };
                this.config.currentId = this.config.executiveId;
            }
        }
        this.showFollowMenu();
        this.attachDelegates();
    };
    ivFollow.prototype.showFollowMenu = function () {
        var html = "";
        var d = new Date();
        var dynamicCreateWL = false;
        if (iv.user.data.dynamicWLEnabled != "false" && iv.isMashup) {
            if (_.size(iv.user.data.genericWatchlistInfo) < iv.user.data.maxWLSize) {
                dynamicCreateWL = "enabled";
            } else {
                dynamicCreateWL = "disabled";
            }
        }
        var trackedByWatchlists = [];
        _.each(this.config.trackedByWatchlists, function (watchlistId) {
            if (watchlistId != "") {
                trackedByWatchlists.push(parseInt(watchlistId));
            }
        });
        this.config.trackedByWatchlists = trackedByWatchlists;
        html += _.template(this.config.menuHeaderTemplate, {
            trackedByWatchlists: this.config.trackedByWatchlists,
            followType: this.config.followType,
            current: this.config.currentId,
            entityType: this.config.entityType,
            uid: this.uid
        });
        var html2 = _.template(this.config.menuBodyTemplate, {
            trackedByWatchlists: this.config.trackedByWatchlists,
            watchlistInfo: this.config.watchlistInfo,
            followType: this.config.followType,
            current: this.config.currentId,
            entityType: this.config.entityType,
            dynamicCreateWL: dynamicCreateWL
        });
        this.followContainer.html(html + html2);
    };
    ivFollow.prototype.attachDelegates = function () {
        var $this = this;
        if ($("body").hasClass("follow-entity-init")) {
            return;
        }
        $("body").delegate("a", "click", function () {
            var target = $(this);
            if (!target.hasClass("follow-entity") && !target.hasClass("following-entity")) {
                return;
            }
            var targEntity = iv.user.followMetaData[target.parents(".follow-menu").attr("id").split("_")[1]];
            if (target.hasClass("follow-entity") && !targEntity.isActionActive) {
                targEntity.isActionActive = true;
                target.css("opacity", "0.5");
                var wId = target.attr("rel");
                targEntity.clickedElem = target.find("span");
                target.removeClass("follow-entity").addClass("following-entity");
                $.extend(targEntity.entityParams, {
                    watchlistId: wId
                });
                targEntity.followAction("follow");
            } else {
                if (target.hasClass("following-entity") && !targEntity.isActionActive) {
                    targEntity.isActionActive = true;
                    target.css("opacity", "0.5");
                    var wId = target.attr("rel");
                    targEntity.clickedElem = target.find("span");
                    $.extend(targEntity.entityParams, {
                        watchlistId: wId
                    });
                    if (target.hasClass("following-" + targEntity.config.entityType + "-freq")) {
                        target.removeClass("following-" + $this.config.entityType + "-freq").css("opacity", "0.5");
                        target.css("cursor", "normal");
                        target.removeClass("following-entity");
                    } else {
                        target.removeClass("following-entity").addClass("follow-entity");
                    }
                    targEntity.followAction("unfollow");
                }
            }
        });
        $("body").addClass("follow-entity-init");
    };
    ivFollow.prototype.actionCallback = function (resp) {
        this.isActionActive = false;
        if (resp.error == false) {
            iv.hub.publishEvent("REFRESH_SETUP", "followCompanies");
            var menuId = "wlAddMenu_" + this.uid;
            var spanText = $("#" + menuId).find(".textHook");
            if ($(this.clickedElem).parent("a").find("img").css("visibility") == "hidden") {
                $(this.clickedElem).parent("a").find("img").css("visibility", "visible");
                $(this.clickedElem).parent("a").css("opacity", "1");
                this.config.trackedByWatchlists.splice(0, 0, this.entityParams.watchlistId);
                var watchlistId = $(this.clickedElem).parent("a").attr("rel");
                if (this.config.entityType == "company") {
                    iv.user.data.genericWatchlistInfo[watchlistId]["companies"].push(this.followId);
                } else {
                    iv.user.data.genericWatchlistInfo[watchlistId]["executives"].push(this.followId);
                }
                if (spanText.text() == "Follow") {
                    $("#" + menuId).removeClass("follow-type-" + this.config.followType).addClass("following-type-" + this.config.followType);
                    spanText.text("Following");
                    $("#" + menuId).find("div.new-follow-sprite").removeClass("followSymbol").addClass("followingSymbol");
                    spanText.parent("div").removeClass("follow-" + this.config.followType + "-" + this.config.entityType).addClass("following-" + this.config.followType + "-" + this.config.entityType);
                }
            } else {
                $(this.clickedElem).parent("a").find("img").css("visibility", "hidden");
                if ($(this.clickedElem).parent("a").hasClass("freq-viewed-wl")) {
                    $(this.clickedElem).parent("a").css("opacity", "0.5");
                } else {
                    $(this.clickedElem).parent("a").css("opacity", "1");
                }
                var index = $.inArray(this.entityParams.watchlistId, this.config.trackedByWatchlists);
                this.config.trackedByWatchlists.splice(index, 1);
                var watchlistId = $(this.clickedElem).parent("a").attr("rel");
                if (this.config.entityType == "company") {
                    iv.user.data.genericWatchlistInfo[watchlistId]["companies"] = _.without(iv.user.data.genericWatchlistInfo[watchlistId]["companies"], this.followId);
                } else {
                    iv.user.data.genericWatchlistInfo[watchlistId]["executives"] = _.without(iv.user.data.genericWatchlistInfo[watchlistId]["executives"], this.followId);
                }
                if (spanText.text() == "Following" && this.config.trackedByWatchlists.length == 0) {
                    $("#" + menuId).removeClass("following-type-" + this.config.followType).addClass("follow-type-" + this.config.followType);
                    spanText.text("Follow");
                    $("#" + menuId).find("div.new-follow-sprite").removeClass("followingSymbol").addClass("followSymbol");
                    spanText.parent("div").removeClass("following-" + this.config.followType + "-" + this.config.entityType).addClass("follow-" + this.config.followType + "-" + this.config.entityType);
                }
            }
        } else {
            if (resp.error == true) {
                this.isActionActive = false;
                if ($(this.clickedElem).parent("a").hasClass("following-entity")) {
                    $(this.clickedElem).parent("a").removeClass("following-entity").addClass("follow-entity");
                } else {
                    $(this.clickedElem).parent("a").removeClass("follow-entity").addClass("following-entity");
                }
                $(this.clickedElem).parent("a").css("opacity", "1");
                if (resp.errorType = "WatchlistLimitError") {
                    iv.stopPoint.show("addRecordsToWatchlist");
                }
            }
        }
    };
    ivFollow.prototype.followAction = function (followtype) {
        var $this = this;
        iv.api.userAction.getJson({
            resource: this.config.urls[followtype],
            urlParams: this.entityParams,
            success: function (resp) {
                $this.actionCallback(resp);
            },
            error: function (resp) {
                $this.actionCallback(resp);
            }
        });
    };
    $.fn.setupFollow = function (options) {
        var ts = iv.util.getUniqueId();
        if (typeof options.companyId !== "undefined") {
            var uid = options.companyId + ts;
            var followId = options.companyId;
        } else {
            var uid = options.executiveId + options.employmentId + ts;
            var followId = options.executiveId;
        }
        options["uid"] = uid;
        options["followId"] = followId;
        registerNS("iv.user.followMetaData");
        iv.user.followMetaData[uid] = new ivFollow(this, options);
        return iv.user.followMetaData[uid];
    };
})(jQuery);
registerNS("iv.lists.formController");
iv.lists.formController = {
    tabState: "",
    queryParams: {},
    init: function (data) {
        this.data = data;
        this.setSubscribeEvents();
        this.initializeBuckets();
        this.attachCommonEvents();
        this.initializeTooltipDisabled();
    },
    setSubscribeEvents: function () {
        iv.hub.subscribeToEvent("UPDATE_FORM", iv.lists.formController.updateFormState, this);
        iv.hub.subscribeToEvent("SET_SAVESEARCH_CONTEXT", this.setSaveSearchContext, this);
        iv.hub.subscribeToEvent("REMOVE_SAVESEARCH_CONTEXT", this.removeSaveSearchContext, this);
    },
    setSaveSearchContext: function () {
        this.savedSearch = true;
    },
    removeSaveSearchContext: function () {
        this.savedSearch = false;
    },
    updateFormState: function (eventObj) {
        if (eventObj.eventData && eventObj.eventData["q"]) {
            this.queryParams = JSON.parse(decodeURIComponent(eventObj.eventData["q"]));
        }
        this.setFormState(eventObj);
    },
    setFormState: function (eventObj) {
        var formContainer = $("body .list-form-container");
        switch (eventObj.eventData["vs"]) {
            case "PR":
                $(formContainer).hide();
                iv.lists.formController.tabState = "contact";
                this.setFormToDefault();
                this.setBucketParams();
                iv.lists.formController.setPermanentExcludedIds();
                break;
            case "CR":
                $(formContainer).hide();
                iv.lists.formController.tabState = "company";
                this.setFormToDefault();
                this.setBucketParams();
                iv.lists.formController.setPermanentExcludedIds();
                break;
            case "PF":
                $(formContainer).show();
                iv.lists.formController.tabState = "contact";
                this.toggleMainFormTabs();
                this.resetSort();
                break;
            case "CF":
            default:
                $(formContainer).show();
                iv.lists.formController.tabState = "company";
                this.toggleMainFormTabs();
                this.setCompanyTabToEnabled();
                this.resetSort();
                break;
        }
    },
    setPermanentExcludedIds: function () {
        var compExcluded = $("form#search_main .compExcluded").val();
        var excludedEmpIds = $("form#search_main .excludedEmpIds").val();
        if (compExcluded == "") {
            compExcluded = [];
        } else {
            compExcluded = compExcluded.split(",");
        }
        if (excludedEmpIds == "") {
            excludedEmpIds = [];
        } else {
            excludedEmpIds = excludedEmpIds.split(",");
        }
        iv.lists.formController.permanentExcludedIds = {
            companyGrid: compExcluded,
            peopleGrid: excludedEmpIds
        };
    },
    initializeBuckets: function () {
        this.setFormToDefault();
        this.initializePeopleBucket();
        this.initializeLocationBucket();
        this.initializeIndustryBucket();
        this.initializeBusinessTypeBucket();
        this.initializeNewsBucket();
        this.initializeConnectionsBucket();
        this.initializeOthersBucket();
    },
    setBucketParams: function () {
        var form = $("form#search_main");
        var showBucketsIds = [];
        if (iv.lists.formController.queryParams["nDays"]) {
            if (!iv.lists.formController.queryParams["nST"] && !iv.lists.formController.queryParams["nKW"]) {
                delete iv.lists.formController.queryParams["nDays"];
            }
        }
        _.each(this.queryParams, function (elementValue, index) {
            var formElement = $(form).find("." + index);
            var bucketId = $(formElement).parents(".menu-expanded").attr("id");
            if (typeof bucketId != "undefined" && elementValue != "") {
                showBucketsIds.push(bucketId);
            }
            if ($(formElement).is("select")) {
                if ($(formElement).attr("multiple")) {
                    if (elementValue.length != 0) {
                        _.each($(formElement).find("option"), function (option) {
                            if ($.inArray($(option).val(), elementValue) != -1) {
                                $(option).attr("selected", true);
                            } else {
                                $(option).attr("selected", false);
                            }
                        });
                    } else {
                        $(formElement).attr("selectedIndex", "0");
                    }
                } else {
                    $(formElement).val(elementValue);
                }
            } else {
                if ($(formElement).is("input[type=checkbox]")) {
                    if (elementValue == "true" || elementValue == true) {
                        $(formElement).val("true");
                        $(formElement).attr("checked", true);
                    } else {
                        $(formElement).val("false");
                        $(formElement).attr("checked", false);
                        showBucketsIds.pop();
                    }
                } else {
                    if ($(formElement).is("input[type=radio]")) {
                        $(formElement + "#" + elementValue).attr("checked", true);
                    } else {
                        $(formElement).val(elementValue);
                    }
                }
            }
        });
        iv.lists.formController.hideBuckets(showBucketsIds);
        iv.lists.formController.setFormStates();
        iv.lists.formController.setSubIndustryBasedOnParams();
        iv.lists.formController.showSubTabsBasedOnParams();
    },
    showAllBuckets: function () {
        $("form#search_main .menu-expanded  .widgetBoxHeader").removeClass("center-content-hidden").addClass("center-content-expanded");
        $("form#search_main .menu-expanded  .innerWidgetBox").show();
    },
    hideBuckets: function (showBucketsIds) {
        _.each($("form#search_main .menu-expanded"), function (elem) {
            var elemId = $(elem).attr("id");
            if ($.inArray(elemId, showBucketsIds) == -1) {
                $("#" + elemId + " .widgetBoxHeader").removeClass("center-content-expanded").addClass("center-content-hidden");
                $("#" + elemId + " .innerWidgetBox").hide();
            }
        });
    },
    setSubIndustryBasedOnParams: function () {
        var subIndustryOptions = iv.lists.formController.queryParams["iSub"];
        if (!subIndustryOptions || subIndustryOptions.length == 0) {
            $(".iSub").attr("selectedIndex", "0");
        } else {
            if (subIndustryOptions) {
                _.each($(".iSub").find("option"), function (option) {
                    if ($.inArray($(option).val(), subIndustryOptions) != -1) {
                        $(option).attr("selected", true);
                    } else {
                        $(option).attr("selected", false);
                    }
                });
            }
        }
    },
    showSubTabsBasedOnParams: function () {
        if (iv.lists.formController.queryParams["nKW"]) {
            iv.lists.formController.handleNewsTabsToggle("keyword-tab");
        }
        if (iv.lists.formController.queryParams["iNAICS"]) {
            iv.lists.formController.handleIndustryTabsToggle("naics-tab");
        } else {
            if (iv.lists.formController.queryParams["iSIC"]) {
                var industryBucket = $("#buildlist_form #industry-bucket");
                if (iv.lists.formController.queryParams["iBSICOF"]) {
                    iv.lists.formController.handleIndustryTabsToggle("sic-tab-uk");
                } else {
                    if ($(industryBucket).find("#sic-tab-us").length > 0) {
                        iv.lists.formController.handleIndustryTabsToggle("sic-tab-us");
                    } else {
                        iv.lists.formController.handleIndustryTabsToggle("sic-tab");
                    }
                }
            }
        }
    },
    resetSort: function () {
        if (!this.savedSearch) {
            var form = $("form#search_main");
            $(form).find(".compSB").val("Popularity");
            $(form).find(".compSO").val("Descending");
            $(form).find(".contSB").val("Popularity");
            $(form).find(".contSO").val("Descending");
        }
    },
    setFormToDefault: function () {
        iv.lists.formController.showAllBuckets();
        iv.lists.formController.setDefaultFormValues();
        iv.lists.formController.setFormStates();
    },
    setDefaultFormValues: function () {
        var form = $("form#search_main");
        $(form).find(".menu-expanded input,.menu-expanded textArea").val("");
        $(form).find(".menu-expanded select").attr("selectedIndex", "0");
        $(form).find(".menu-expanded input[type=checkbox],.menu-expanded input[type=radio]").attr("checked", false);
        $(form).find(".menu-expanded input[type=checkbox],.menu-expanded input[type=radio]").val("false");
        $(form).find("#industry-bucket input[type=checkbox]").attr("checked", true);
        $(form).find("#industry-bucket input[type=checkbox]").val("true");
        $(form).find("#people-bucket input[type=checkbox]").attr("checked", true);
        $(form).find("#people-bucket input[type=checkbox]").val("true");
        $(form).find("#news-bucket .nDays").val($("#toggle-days-company").html());
        $(form).find(".formLog").val(false);
        $(form).find(".pageNum").val("1");
        $(form).find(".compSB").val("Popularity");
        $(form).find(".compSO").val("Ascending");
        $(form).find(".contSB").val("Popularity");
        $(form).find(".contSO").val("Ascending");
    },
    setFormStates: function () {
        iv.lists.formController.setLocationSelectionMenus();
        iv.lists.formController.handleSearchForSelectionChange();
        iv.lists.formController.createSubIndustryMenu();
        iv.lists.formController.handlePeopleYouKnowClick();
    },
    setCompanyTabToEnabled: function () {
        iv.lists.formController.enableCompanyTab(true);
        var businessTypeBucket = $("#buildlist_form #business-type-bucket");
        $(businessTypeBucket).find(".bSFC").val("AllCompanies");
        iv.lists.formController.handleSearchForSelectionChange();
    },
    initializePeopleBucket: function () {
        $("body").delegate("#buildlist_form #people-bucket input[type=checkbox]", "click", iv.lists.formController.handleCheckBoxClick);
    },
    initializeLocationBucket: function () {
        $("body #buildlist_form #location-bucket").delegate(".lRgn", "change", iv.lists.formController.handleLocationSelectionChange);
        $("body").delegate("#buildlist_form #location-bucket #new-geo", "click", iv.lists.formController.addNewGeography);
        $("body").delegate("#buildlist_form #location-bucket #edit-geo", "click", iv.lists.formController.editGeographies);
        $("body").delegate("#buildlist_form #location-bucket #del-geo", "click", iv.lists.formController.deleteGeography);
    },
    initializeIndustryBucket: function () {
        $("body").delegate("#buildlist_form #industry-bucket .tertiaryTab li", "click", function (element) {
            var tabId = element.currentTarget.id;
            iv.lists.formController.handleIndustryTabClick(tabId);
        });
        $("body #buildlist_form #industry-bucket").delegate(".iSect", "change", iv.lists.formController.createSubIndustryMenu);
        $("body").delegate("#buildlist_form #industry-bucket input[type=checkbox]", "click", iv.lists.formController.handleCheckBoxClick);
    },
    initializeBusinessTypeBucket: function () {
        $("body #buildlist_form #business-type-bucket").delegate(".bSFC", "change", iv.lists.formController.handleSearchForSelectionChange);
    },
    initializeNewsBucket: function () {
        $("body").delegate("#buildlist_form #news-bucket .tertiaryTab li", "click", function (element) {
            var tabId = element.currentTarget.id;
            iv.lists.formController.handleNewsTabClick(tabId);
        });
        $("body").delegate("#buildlist_form #news-bucket #read-layer-comp #toggle-days-company", "click", iv.lists.formController.handleDaysLinkClick);
    },
    initializeConnectionsBucket: function () {
        $("body").delegate("#buildlist_form #connections-bucket input[type=checkbox]", "click", iv.lists.formController.handleCheckBoxClick);
        $("body").delegate("#buildlist_form #connections-bucket input[type=checkbox]#cPFDF", "click", iv.lists.formController.handlePeopleYouKnowClick);
    },
    initializeOthersBucket: function () {
        $("body").delegate("#buildlist_form #other-bucket #oITRC", "click", iv.lists.formController.handleCheckBoxClick);
    },
    handleLocationSelectionChange: function () {
        var locationBucket = $("#buildlist_form #location-bucket");
        $(locationBucket).find(".location-menu-item input,.location-menu-item textArea").val("");
        $(locationBucket).find(".location-menu-item select").attr("selectedIndex", "0");
        iv.lists.formController.setLocationSelectionMenus();
    },
    setLocationSelectionMenus: function () {
        var locationBucket = $("#buildlist_form #location-bucket");
        var locationValue = $(locationBucket).find(".lRgn").val();
        $(locationBucket).find(".location-menu-item").hide();
        $(locationBucket).find(".edit-del-geo-link").hide();
        switch (locationValue) {
            case "ALL":
                $(locationBucket).find(".new-geo-link").show();
                break;
            case "citystate":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#city-menu").show();
                break;
            case "country":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#country-menu").show();
                break;
            case "zipcode":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#zip-code-menu").show();
                break;
            case "areacode":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#area-code-menu").show();
                break;
            case "region":
                $(locationBucket).find(".new-geo-link").show();
                $(locationBucket).find("#region-menu").show();
                break;
            case "newGeographicTerritory":
                $(locationBucket).find(".new-geo-link").show();
                iv.lists.formController.addNewGeography();
                break;
            default:
                $(locationBucket).find(".new-geo-link").hide();
                $(locationBucket).find(".edit-del-geo-link").show();
                break;
        }
    },
    handleSearchForSelectionChange: function (elem) {
        var businessTypeBucket = $("#buildlist_form #business-type-bucket");
        var selectValue = $(businessTypeBucket).find(".bSFC").val();
        $(businessTypeBucket).find("#comp-menu-grey-divider").hide();
        $(businessTypeBucket).find("#companyNameAndTicker").hide();
        switch (selectValue) {
            case "AllCompanies":
                iv.lists.formController.enableCompanyTab(true);
                $(businessTypeBucket).find("#comp-menu-grey-divider").show();
                $(businessTypeBucket).find("#companyMenuSection").show();
                break;
            case "Other":
                iv.lists.formController.enableCompanyTab(false);
                $(businessTypeBucket).find("#companyNameAndTicker").show();
                $(businessTypeBucket).find("#companyMenuSection").hide();
                break;
            case "WatchlistComp":
            default:
                iv.lists.formController.enableCompanyTab(false);
                $(businessTypeBucket).find("#companyMenuSection").hide();
                break;
        }
    },
    addNewGeography: function () {
        if (typeof geography == "undefined") {
            iv.util.require([iv.ui.getTemplate("commonRequires.geography")], function () {
                geography.init();
                geography.showNew();
            });
        } else {
            geography.showNew();
        }
    },
    editGeographies: function () {
        var locationValue = $("#location-bucket .lRgn").val();
        if (typeof geography == "undefined") {
            iv.util.require([iv.ui.getTemplate("commonRequires.geography")], function () {
                geography.init();
                geography.openForEdit(locationValue);
            });
        } else {
            geography.openForEdit(locationValue);
        }
    },
    deleteGeography: function () {
        var locationValue = $("#location-bucket .lRgn").val();
        if (typeof geography == "undefined") {
            iv.util.require([iv.ui.getTemplate("commonRequires.geography")], function () {
                geography.init();
                geography.deleteGeography(locationValue);
            });
        } else {
            geography.deleteGeography(locationValue);
        }
    },
    updateGeographies: function (data) {
        var locationBucket = $("#location-bucket");
        var option = '<option id="' + data.id + '" value="' + data.id + '" title="' + data.name + '" >' + data.name + "</option>";
        $(locationBucket).find(".lRgn optgroup#region-comp").append(option);
        $(locationBucket).find(".lRgn").val(data.id);
        $(locationBucket).find(".new-geo-link").hide();
        $(locationBucket).find(".edit-del-geo-link").show();
    },
    updateGeographyEntry: function (data) {
        $("#location-bucket .lRgn optgroup#region-comp option#" + data.id).attr("name", data.name);
        $("#location-bucket .lRgn optgroup#region-comp option#" + data.id).html(data.name);
    },
    removeGeography: function (data) {
        var locationBucket = $("#location-bucket");
        $(locationBucket).find(".lRgn optgroup#region-comp option#" + data).remove();
        $(locationBucket).find(".new-geo-link").show();
        $(locationBucket).find(".edit-del-geo-link").hide();
    },
    handleIndustryTabClick: function (tabId) {
        var industryBucket = $("#buildlist_form #industry-bucket");
        if ($(industryBucket).find("li#" + tabId).hasClass("current")) {
            return;
        }
        $(industryBucket).find("select").attr("selectedIndex", "0");
        $(industryBucket).find("input[type=text]").val("");
        $(industryBucket).find("input[type=checkbox]").attr("checked", true);
        $(industryBucket).find("input[type=checkbox]").val("true");
        $(industryBucket).find(".iBSICOF").val("");
        iv.lists.formController.handleIndustryTabsToggle(tabId);
    },
    handleIndustryTabsToggle: function (tabId) {
        var industryBucket = $("#buildlist_form #industry-bucket");
        $(industryBucket).find("li").removeClass("current");
        $(industryBucket).find("li#" + tabId).addClass("current");
        $(industryBucket).find(".industry-menu-section").hide();
        switch (tabId) {
            case "industry-tab":
                $(industryBucket).find("#industry-menu").show();
                break;
            case "naics-tab":
                $(industryBucket).find("#naics-menu").show();
                break;
            case "sic-tab-uk":
                $(industryBucket).find("#sic-menu .iBSICOF").val("true");
            case "sic-tab":
            case "sic-tab-us":
                $(industryBucket).find("#sic-menu").show();
                break;
        }
    },
    createSubIndustryMenu: function () {
        var industryBucket = $("#buildlist_form #industry-bucket");
        var industryType = $(industryBucket).find(".iSect").val();
//        var industryMap = iv.lists.formController.data.industriesData;
        var industryMap = {
        		"A":[{
        			'id': "01",
        			'value':"农业"
			        },{
			        'id': "02",
			        			'value': "林业"
			        },{
			        'id': "03",
			        			'value': "畜牧业"
			        },{
			        'id': "04",
			        			'value': "渔业"
			        },{
			        'id': "05",
			        			'value': "农、林、牧、渔服务业"
			        }
			        ],
			        "B":[{
			        			'id': "06",
			        			'value': "煤炭开采和洗选业"
			        },{
			        'id': "07",
			        			'value': "石油和天然气开采业"
			        },{
			        'id': "08",
			        			'value': "黑色金属矿采选业"
			        },{
			        'id': "09",
			        			'value': "有色金属矿采选业"
			        },{
			        'id': "10",
			        			'value': "非金属矿采选业"
			        },{
			        'id': "11",
			        			'value': "开采辅助活动"
			        },{
			        'id': "12",
			        			'value': "其他采矿业"
			        }
			        ],
			        "C":[{
			        			'id': "13",
			        			'value': "农副食品加工业"
			        },{
			        'id': "14",
			        			'value': "食品制造业"
			        },{
			        'id': "15",
			        			'value': "酒、饮料和精制茶制造业"
			        },{
			        'id': "16",
			        			'value': "烟草制品业"
			        },{
			        'id': "17",
			        			'value': "纺织业"
			        },{
			        'id': "18",
			        			'value': "纺织服装、服饰业"
			        },{
			        'id': "19",
			        			'value': "皮革、毛皮、羽毛及其制品和制鞋业"
			        },{
			        'id': "20",
			        			'value': "木材加工和木、竹、藤、棕、草制品业"
			        },{
			        'id': "21",
			        			'value': "家具制造业"
			        },{
			        'id': "22",
			        			'value': "造纸和纸制品业"
			        },{
			        'id': "23",
			        			'value': "印刷和记录媒介复制业"
			        },{
			        'id': "24",
			        			'value': "文教、工美、体育和娱乐用品制造业"
			        },{
			        'id': "25",
			        			'value': "石油加工、炼焦和核燃料加工业"
			        },{
			        'id': "26",
			        			'value': "化学原料和化学制品制造业"
			        },{
			        'id': "27",
			        			'value': "医药制造业"
			        },{
			        'id': "28",
			        			'value': "化学纤维制造业"
			        },{
			        'id': "29",
			        			'value': "橡胶和塑料制品业"
			        },{
			        'id': "30",
			        			'value': "非金属矿物制品业"
			        },{
			        'id': "31",
			        			'value': "黑色金属冶炼和压延加工业"
			        },{
			        'id': "32",
			        			'value': "有色金属冶炼和压延加工业"
			        },{
			        'id': "33",
			        			'value': "金属制品业"
			        },{
			        'id': "34",
			        			'value': "通用设备制造业"
			        },{
			        'id': "35",
			        			'value': "专用设备制造业"
			        },{
			        'id': "36",
			        			'value': "汽车制造业"
			        },{
			        'id': "37",
			        			'value': "铁路、船舶、航空航天和其他运输设备制造业"
			        },{
			        'id': "38",
			        			'value': "电气机械和器材制造业"
			        },{
			        'id': "39",
			        			'value': "计算机、通信和其他电子设备制造业"
			        },{
			        'id': "40",
			        			'value': "仪器仪表制造业"
			        },{
			        'id': "41",
			        			'value': "其他制造业"
			        },{
			        'id': "42",
			        			'value': "废弃资源综合利用业"
			        },{
			        'id': "43",
			        			'value': "金属制品、机械和设备修理业"
			        }
			        ],
			        "D":[{
			        			'id': "44",
			        			'value': "电力、热力生产和供应业"
			        },{
			        'id': "45",
			        			'value': "燃气生产和供应业"
			        },{
			        'id': "46",
			        			'value': "水的生产和供应业"
			        }
			        ],
			        "E":[{
			        			'id': "47",
			        			'value': "房屋建筑业"
			        },{
			        'id': "48",
			        			'value': "土木工程建筑业"
			        },{
			        'id': "49",
			        			'value': "建筑安装业"
			        },{
			        'id': "50",
			        			'value': "建筑装饰和其他建筑业"
			        }
			        ],
			        "F":[{
			        			'id': "51",
			        			'value': "批发业"
			        },{
			        'id': "52",
			        			'value': "零售业"
			        }
			        ],
			        "G":[{
			        			'id': "53",
			        			'value': "铁路运输业"
			        },{
			        'id': "54",
			        			'value': "道路运输业"
			        },{
			        'id': "55",
			        			'value': "水上运输业"
			        },{
			        'id': "56",
			        			'value': "航空运输业 "
			        },{
			        'id': "57",
			        			'value': "管道运输业"
			        },{
			        'id': "58",
			        			'value': "装卸搬运和运输代理业"
			        },{
			        'id': "59",
			        			'value': "仓储业 "
			        },{
			        'id': "60",
			        			'value': "邮政业"
			        }
			        ],
			        "H":[{
			        			'id': "61",
			        			'value': "住宿业"
			        },{
			        'id': "62",
			        			'value': "餐饮业"
			        }
			        ],
			        "I":[{
			        			'id': "63",
			        			'value': "电信、广播电视和卫星传输服务"
			        },{
			        'id': "64",
			        			'value': "互联网和相关服务"
			        },{
			        'id': "65",
			        			'value': "软件和信息技术服务业"
			        }
			        ],
			        "J":[{
			        			'id': "66",
			        			'value': "货币金融服务"
			        },{
			        'id': "67",
			        			'value': "资本市场服务"
			        },{
			        'id': "68",
			        			'value': "保险业"
			        },{
			        'id': "69",
			        			'value': "其他金融业"
			        }
			        ],
			        "K":[{
			        			'id': "70",
			        			'value': "房地产业"
			        }
			        ],
			        "L":[{
			        			'id': "71",
			        			'value': "租赁业"
			        },{
			        'id': "72",
			        			'value': "商务服务业"
			        }
			        ],
			        "M":[{
			        			'id': "73",
			        			'value': "研究和试验发展"
			        },{
			        'id': "74",
			        			'value': "专业技术服务业"
			        },{
			        'id': "75",
			        			'value': "科技推广和应用服务业"
			        }
			        ],
			        "N":[{
			        			'id': "76",
			        			'value': "水利管理业"
			        },{
			        'id': "77",
			        			'value': "生态保护和环境治理业"
			        },{
			        'id': "78",
			        			'value': "公共设施管理业"
			        }
			        ],
			        "O":[{
			        			'id': "79",
			        			'value': "居民服务业"
			        },{
			        'id': "80",
			        			'value': "机动车、电子产品和日用产品修理业"
			        },{
			        'id': "81",
			        			'value': "其他服务业"
			        }
			        ],
			        "P":[{
			        			'id': "82",
			        			'value': "教育"
			        }
			        ],
			        "Q":[{
			        			'id': "83",
			        			'value': "卫生"
			        },{
			        'id': "84",
			        			'value': "社会工作"
			        }
			        ],
			        "R":[{
			        			'id': "85",
			        			'value': "新闻和出版业"
			        },{
			        'id': "86",
			        			'value': "广播、电视、电影和影视录音制作业"
			        },{
			        'id': "87",
			        			'value': "文化艺术业"
			        },{
			        'id': "88",
			        			'value': "体育"
			        },{
			        'id': "89",
			        			'value': "娱乐业"
			        }
			        ],
			        "S":[{
			        			'id': "90",
			        			'value': "中国共产党机关"
			        },{
			        'id': "91",
			        			'value': "国家机构"
			        },{
			        'id': "92",
			        			'value': "人民政协、民主党派"
			        },{
			        'id': "93",
			        			'value': "社会保障"
			        },{
			        'id': "94",
			        			'value': "群众团体、社会团体和其他成员组织"
			        },{
			        'id': "95",
			        			'value': "基层群众自治组织"
			        }
			        ],
			        "T":[{
			        			'id': "96",
			        			'value': "国际组织"
			        }
			        ]
			 };
        var selectOptionsArray = [];
        var selectOptionsMap = {};
        _.each(industryMap, function (subIndustryList, index) {
            if ($.inArray("0", industryType) != -1 || $.inArray(index, industryType) != -1) {
                _.each(subIndustryList, function (element) {
                    selectOptionsArray.push(element.value);
                    selectOptionsMap[element.value] = element.id;
                });
            }
        });
        selectOptionsArray.sort();
//        var selectOptions = "<option value='ALL' title='All'  name='All' selected='selected'>All</option>";
        var selectOptions = "<option value='所有' title='所有'  name='所有' selected='selected'>所有</option>";
        _.each(selectOptionsArray, function (index) {
            selectOptions = selectOptions + '<option value="' + selectOptionsMap[index] + '" title="' + index + '" >' + index + "</option>";
        });
        $(industryBucket).find(".iSub").html(selectOptions);
    },
    handleNewsTabClick: function (tabId) {
        var newsBucket = $("#buildlist_form #news-bucket");
        if ($(newsBucket).find("li#" + tabId).hasClass("current")) {
            return;
        }
        $(newsBucket).find("select.nST").attr("selectedIndex", "0");
        $(newsBucket).find("input[type=text]").val("");
        iv.lists.formController.handleNewsTabsToggle(tabId);
    },
    handleNewsTabsToggle: function (tabId) {
        var newsBucket = $("#buildlist_form #news-bucket");
        $(newsBucket).find("li").removeClass("current");
        $(newsBucket).find("li#" + tabId).addClass("current");
        switch (tabId) {
            case "smart-agent-tab":
                $(newsBucket).find("#smart-agent-menu").show();
                $(newsBucket).find("#keyword-menu").hide();
                break;
            case "keyword-tab":
                $(newsBucket).find("#smart-agent-menu").hide();
                $(newsBucket).find("#keyword-menu").show();
                break;
        }
    },
    handleDaysLinkClick: function () {
        var newBucket = $("#buildlist_form #news-bucket");
        $(newBucket).find("#read-layer-comp").hide();
        $(newBucket).find("#write-layer-comp").show();
    },
    handlePeopleYouKnowClick: function () {
        var connectionsBucket = $("#buildlist_form #connections-bucket");
        if ($(connectionsBucket).find("#cPFDF").attr("checked")) {
            $(connectionsBucket).find("#secondDegreeConn").show();
        } else {
            $(connectionsBucket).find("#secondDegreeConn").hide();
            $(connectionsBucket).find("#secondDegreeConn #cPSDF").val("false");
            $(connectionsBucket).find("#secondDegreeConn #cPSDF").attr("checked", false);
        }
    },
    handleCheckBoxClick: function (elem) {
        var checkBox = $("#" + elem.currentTarget.id);
        if ($(checkBox).attr("checked")) {
            $(checkBox).val("true");
        } else {
            $(checkBox).val("false");
        }
    },
    attachCommonEvents: function () {
        this.intitializeFormButtons();
        this.initializeFormTabs();
        $("body").delegate(".list-form-container .widgetBoxHeader", "click", iv.lists.formController.handleToggleBuckets);
    },
    handleToggleBuckets: function (element) {
        var currentTarget = $(element.currentTarget);
        var isExpanded = $(currentTarget).hasClass("center-content-expanded");
        var innerWidgetBox = $(currentTarget).parent().find(".innerWidgetBox");
        if (isExpanded) {
            $(innerWidgetBox).hide();
            $(currentTarget).removeClass("center-content-expanded").addClass("center-content-hidden");
        } else {
            $(innerWidgetBox).show();
            $(currentTarget).removeClass("center-content-hidden").addClass("center-content-expanded");
        }
    },
    initializeFormTabs: function () {
        $("body").delegate(".list-form-container .secondaryNavFlat .secondaryNavListItems", "click", iv.lists.formController.handleFormMainTabClick);
    },
    handleFormMainTabClick: function (tab) {
        var tabId = tab.currentTarget.id;
        if ($(".list-form-container .secondaryNavFlat .secondaryNavList li#" + tabId).hasClass("secondaryNavListItemSelected")) {
            return;
        }
        if ($(".list-form-container .secondaryNavFlat .secondaryNavList li#" + tabId).hasClass("disabled")) {
            return;
        }
        var queryString = "";
        switch (tabId) {
            case "company-tab":
                queryString = "vs=CF";
                break;
            case "contact-tab":
                queryString = "vs=PF";
                break;
        }
        iv.lists.formController.publishChangeUrlEvent(queryString);
    },
    toggleMainFormTabs: function () {
        var companyTab = $(".list-form-container .secondaryNavFlat .secondaryNavList li#company-tab");
        var contactTab = $(".list-form-container .secondaryNavFlat .secondaryNavList li#contact-tab");
        switch (iv.lists.formController.tabState) {
            case "company":
                $("#people-bucket").hide();
                $("#business-type-bucket #searchForSection").hide();
                $(contactTab).removeClass("secondaryNavListItemSelected").addClass("secondaryNavListItems");
                $(companyTab).addClass("secondaryNavListItemSelected");
                break;
            case "contact":
                $("#people-bucket").show();
                $("#business-type-bucket #searchForSection").show();
                $(companyTab).removeClass("secondaryNavListItemSelected").addClass("secondaryNavListItems");
                $(contactTab).addClass("secondaryNavListItemSelected");
                break;
        }
        iv.util.setDefaultFocus($("#search_main"));
    },
    intitializeFormButtons: function () {
        $("body").delegate(".list-form-container .menu-action #clear", "click", iv.lists.formController.setFormToDefault);
        $("body").delegate(".list-form-container .menu-action #search", "click", iv.lists.formController.doSubmitForm);
    },
    enableCompanyTab: function (enable) {
        var companyTab = $(".list-form-container .secondaryNavFlat .secondaryNavList li#company-tab");
        if (enable == false) {
            $(companyTab).addClass("disabled");
        } else {
            $(companyTab).removeClass("disabled");
        }
    },
    updateCompanySort: function (sortByValue, sortOrder) {
        var form = $("form#search_main");
        $(form).find(".compSB").val(sortByValue);
        $(form).find(".compSO").val(sortOrder);
        iv.lists.searchController.setStrictMode();
        iv.lists.formController.doSubmitForm("company");
    },
    updatePeopleSort: function (sortByValue, sortOrder, excludedCompanies) {
        var form = $("form#search_main");
        $(form).find(".contSB").val(sortByValue);
        $(form).find(".contSO").val(sortOrder);
        var excluded = [];
        var excomp = $(form).find(".compExcluded").val();
        if (excomp !== "") {
            excluded.push(excomp);
        }
        if (typeof excludedCompanies !== "undefined" && excludedCompanies !== "") {
            excluded.push(excludedCompanies);
        }
        $(form).find(".compExcluded").val(excluded.join(","));
        iv.lists.searchController.setStrictMode();
        iv.lists.formController.doSubmitForm("contact");
        $(form).find(".compExcluded").val(excluded[0]);
    },
    initializeTooltipDisabled: function () {
        var companyTabId = ".list-form-container .secondaryNavFlat .secondaryNavList li#company-tab";
        var companyTab = $(companyTabId);
        var config = {
            messageId: "disabledCompanyTab",
            selector: companyTabId,
            position: {
                at: "right center",
                corner: "left center",
                my: "left center"
            },
            classes: "",
            messageContent: '<div class="float_left" style="margin:5px;"><img src="/iv/common/styles/images/Info.png"></div><div class="float_left">To create a list of companies, set the <b>Search for</b> option to <br/><b>All Companies</b> in the <b>Business Type</b> section below.</div>',
            preventDefaultShow: iv.lists.formController.preventDefaultShow,
            dependencies: []
        };
        iv.util.require([iv.ui.getTemplate("commonRequires.toolTip")], function () {
            iv.toolTip.init(config);
        });
    },
    preventDefaultShow: function () {
        if (!$(".list-form-container .secondaryNavFlat .secondaryNavList li#company-tab").hasClass("disabled")) {
            return true;
        }
    },
    displayValidation: function (type) {
        var msg = "";
        if (type === "employee") {
            msg = "Only numbers are valid for the Employee range.";
        }
        if (type === "revenue") {
            msg = "Only numbers and either M (Million) or B (Billion) are valid for the Revenue range.";
        }
//        alert(msg);
    },
    validateSizeBucket: function () {
        var remin = /^((\d)+|(\d)+\.(\d)+|((\d)+(M|m|B|b))|((\d)+\.(\d)+(M|m|B|b))|MIN|min)$/;
        var remax = /^((\d)+|(\d)+\.(\d)+|((\d)+(M|m|B|b))|((\d)+\.(\d)+(M|m|B|b))|MAX|max)$/;
        var reemp = /^(\d+)$/;
        var i, val, match;
        var sizeBucket = $("#size-bucket");
        val = $(sizeBucket).find(".sEMin").val();
        match = reemp.exec(val);
        if (!match && val != "") {
            iv.lists.formController.displayValidation("employee");
            return false;
        }
        val = $(sizeBucket).find(".sRMin").val();
        match = remin.exec(val);
        if (!match && val != "") {
            iv.lists.formController.displayValidation("revenue");
            return false;
        }
        val = $(sizeBucket).find(".sEMax").val();
        match = reemp.exec(val);
        if (!match && val != "") {
            iv.lists.formController.displayValidation("employee");
            return false;
        }
        val = $(sizeBucket).find(".sRMax").val();
        match = remax.exec(val);
        if (!match && val != "") {
            iv.lists.formController.displayValidation("revenue");
            return false;
        }
        return true;
    },
    doSubmitForm: function (tabState) {
        if (!iv.lists.formController.validateSizeBucket()) {
            return false;
        }
        if (tabState == "company" || tabState == "contact") {
            iv.lists.formController.tabState = tabState;
        }
//        if (iv.user.data.license === 0) {
//            if (iv.lists.formController.tabState === "company") {
//                iv.stopPoint.show("listBuildingCompany");
//            } else {
//                if (iv.lists.formController.tabState === "contact") {
//                    iv.stopPoint.show("listBuildingContact");
//                } else {
//                    iv.stopPoint.show("listBuildingCompany");
//                }
//            }
//            return false;
//        }
        var queryString = iv.lists.formController.tabState == "company" ? "vs=CR" : "vs=PR";
//        queryString = queryString + "?q=" + iv.lists.urlHasher.getShortValue(iv.lists.formController.createFormObject());
        queryString = queryString + "&q=" + iv.lists.formController.createFormObject();
        console.log("queryString="+queryString);
        if(iv.lists.formController.tabState == "company"){
        	$.ajax({
//        		url : "/ekb/buildList?vs=CR",
            	url : "/ekb/buildList?"+queryString,
            	type : "GET",
        	    contentType : "application/json",
        	    dataType: "json",
        	    success: function(result) {
        	    	iv.lists.renderer.init();
        	    	iv.lists.renderer.renderResultsCompany(result);
        	    }
            });
        }else{
        	$.ajax({
            	url : "/ekb/buildList?"+queryString,
            	type : "GET",
        	    contentType : "application/json",
        	    dataType: "json",
        	    success: function(result) {
        	    	iv.lists.renderer.init();
        	    	iv.lists.renderer.renderResultsPeople(result);
        	    }
            });
        }
        //        iv.lists.formController.publishChangeUrlEvent(queryString);
    },
    publishChangeUrlEvent: function (queryString) {
        iv.hub.publishEvent("CHANGE_URL", {
            queryString: queryString,
            path: "buildList"
        });
    },
    createFormObject: function () {
        var formObject = {};
        _.each($("form#search_main").find("input,select,textArea"), function (elem) {
            var name = $(elem).attr("name");
            var val = $(elem).val();
            if (typeof name != "undefined" && name != "" && typeof val != "undefined" && val != "" && val != null) {
                if (name === "compExcluded" || name === "excludedEmpIds") {
                    formObject[name] = val.split(",");
                } else {
                    formObject[name] = val;
                }
            }
        });
        console.log(formObject);
        console.log(JSON.stringify(formObject));
        return JSON.stringify(formObject);
//        return encodeURIComponent(JSON.stringify(formObject));
//        return formObject;
    }
};
registerNS("iv.lists.searchController");
iv.lists.searchController = {
    strictMode: false,
    strictMode: false,
    setStrictMode: function () {
        this.strictMode = true;
    },
    unSetStrictMode: function () {
        this.strictMode = false;
    },
    init: function () {
        iv.lists.searcher.init();
        iv.lists.formController.init(buildListMetaData);
        iv.lists.renderer.init();
        iv.lists.savedSearch.init();
    },
    defaultStateConfig: {
        "vs": "CF"
    },
    isLoadingUrlHashState: function (obj) {
        if (obj["vs"] === "CR" || obj["vs"] === "PR") {
            if (typeof obj["q"] !== "undefined") {
                return iv.lists.urlHasher.isShortenedUrl(obj["q"]);
            }
        }
        return false;
    },
    loadState: function (obj) {
        if (typeof obj === "undefined" || $.isEmptyObject(obj)) {
            obj = iv.lists.searchController.defaultStateConfig;
        } else {
            if (this.isLoadingUrlHashState(obj)) {
                if (iv.lists.urlHasher.isValudShortenedUrl(obj["q"])) {
                    obj["q"] = iv.lists.urlHasher.getUrlValue(obj["q"]);
                } else {
                    obj = iv.lists.searchController.defaultStateConfig;
                }
            }
        }
        if (obj["vs"] === "CF" || obj["vs"] === "PF") {
            iv.hub.publishEvent("UPDATE_FORM", obj);
            iv.hub.publishEvent("SHOW_RESULTS", obj);
        }
        if (obj["vs"] === "CR" || obj["vs"] === "PR") {
            iv.util.printToConsole("Searcher called with" + obj["vs"]);
            if (!this.strictMode) {
                iv.hub.publishEvent("SHOW_RESULTS", obj);
                iv.hub.publishEvent("UPDATE_FORM", obj);
            }
            if (this.strictMode) {
                obj["strictMode"] = true;
            }
            iv.hub.publishEvent("SEARCH_EVENT", obj);
        }
        this.unSetStrictMode();
    }
};
iv.processOnDomReady(function () {
    iv.lists.searchController.init();
});
registerNS("iv.lists.searcher");
iv.lists.searcher = {
    connections: {},
    screens: ["COMPANY", "PEOPLE"],
    screenURLs: {
        "COMPANY": "/iv/doCompanyListBuild.iv",
        "PEOPLE": "/iv/doContactListBuild.iv"
    },
    currentSearchParams: {},
    doSearch: function (data) {
        var searchParams = {
            "q": JSON.parse(decodeURIComponent(data.eventData.q))
        };
        this.currentSearchParams = searchParams;
        var obj = searchParams;
        obj.q = JSON.stringify(searchParams.q);
        if (typeof data.eventData.strictMode !== "undefined") {
            if (data.eventData.strictMode) {
                if (data.eventData.vs === "CR") {
                    this.doCompanySearch(obj);
                    return;
                } else {
                    if (data.eventData.vs === "PR") {
                        this.doPeopleSearch(obj);
                        return;
                    }
                }
            }
        }
        this.doCompanySearch(obj);
        this.doPeopleSearch(obj);
    },
    doCompanySearch: function (params) {
        params["formLog"] = true;
        iv.hub.publishEvent("FETCH_COMPANY_DATA", params);
    },
    doPeopleSearch: function (params) {
        params["formLog"] = true;
        iv.hub.publishEvent("FETCH_PEOPLE_DATA", params);
    },
    doPeopleSearchUpdate: function (excludeArr) {
        var searchParams = JSON.parse(JSON.stringify(this.currentSearchParams));
        var obj = JSON.parse(decodeURIComponent(searchParams.q));
        obj.compExcluded = excludeArr.eventData;
        searchParams.q = JSON.stringify(obj);
        this.doPeopleSearch(searchParams);
    },
    paginateCompany: function (pageNum) {
        var searchParams = JSON.parse(JSON.stringify(this.currentSearchParams));
        var obj = JSON.parse(decodeURIComponent(searchParams.q));
        obj.pageNum = pageNum;
        searchParams.q = JSON.stringify(obj);
        this.doCompanySearch(searchParams);
    },
    paginatePeople: function (pageNum, excludedIds) {
        var searchParams = JSON.parse(JSON.stringify(this.currentSearchParams));
        var obj = JSON.parse(decodeURIComponent(searchParams.q));
        obj.pageNum = pageNum;
        obj.compExcluded = excludedIds;
        searchParams.q = JSON.stringify(obj);
        this.doPeopleSearch(searchParams);
    },
    init: function () {
        iv.hub.subscribeToEvent("SEARCH_EVENT", this.doSearch, this);
        iv.hub.subscribeToEvent("UPDATE_PEOPLE_RESULTS", this.doPeopleSearchUpdate, this);
        this.connections = {};
        var $this = this;
        _.each(this.screens, function (key) {
            $this.connections[key] = new pipeClass({
                method: "POST",
                dataSource: $this.screenURLs[key],
                fetchDataEvents: [{
                    "key": "FETCH_" + key + "_DATA"
                }],
                publishDataEvents: ["DATA_RECEIVED_" + key]
            });
        });
    }
};
registerNS("iv.lists.renderer");
iv.lists.renderer = {
    activeTab: "CR",
    excludedIds: {
        "companyGrid": [],
        "peopleGrid": []
    },
    summaryMap: {
        sortOrder: "Sort Order",
        sortBy: "Sort By",
        subIndustries: "Sub Industries",
        companyStatus: "Company Status",
        industries: "Industries",
        companyType: "Company Type",
        countries: "Countries",
        location: "Location",
        revenue: "Revenue",
        employees: "Employees",
        connections: "Connections"
    },
    exportUrls: {
        "company": {
            "metadata": "/iv/getCompanyExportMetadata.iv",
            "data": "/iv/exportCompanies.iv"
        },
        "people": {
            "metadata": "/iv/getContactExportMetadata.iv",
            "data": "/iv/exportContacts.iv"
        }
    },
    connectionsMap: {},
    peopleGrid: {
        "obj": $("#peopleGrid"),
        "pagination": {
            "startIndex": 0,
            "count": 20,
            "total": 0,
            "activePage": 1
        },
        "sort": {
            "name": "",
            "order": "asc"
        },
        "search": {
            "keyword": ""
        },
        "extendedTemplate": '<div id="hide-<%=employmentId%>" style="color: rgb(153, 153, 153);" class="hide-row"><a href="javascript:void(0);" class="bluefont undo-link" style="">Undo remove</a></div>',
        "messages": {
            "emptyPage": "No results found."
        },
        "sorting": false,
        "paginating": false,
        "errorState": false
    },
    companyGrid: {
        "obj": $("#companyGrid"),
        "pagination": {
            "startIndex": 0,
            "count": 20,
            "total": 0,
            "activePage": 1
        },
        "sort": {
            "name": "Popularity",
            "order": "asc"
        },
        "search": {
            "keyword": ""
        },
        "extendedTemplate": '<div id="hide-<%=companyId%>" style="color: rgb(153, 153, 153);" class="hide-row"><a href="javascript:void(0);" class="bluefont undo-link" style="">Undo remove</a></div>',
        "messages": {
            "emptyPage": "No results found."
        },
        "sorting": false,
        "paginating": false,
        "errorState": false
    },
    saveSearchContext: null,
    removeSaveSearchContext: function (ev) {
        this.saveSearchContext = null;
    },
    setSaveSearchContext: function (ev) {
        this.saveSearchContext = ev.eventData;
    },
    hasSearchContext: function () {
        if (this.saveSearchContext === null) {
            return false;
        }
        return true;
    },
    init: function () {
        iv.hub.subscribeToEvent("SHOW_RESULTS", this.handleState, this);
        iv.hub.subscribeToEvent("DATA_RECEIVED_COMPANY", this.renderResultsCompany, this);
        iv.hub.subscribeToEvent("SET_SAVESEARCH_CONTEXT", this.setSaveSearchContext, this);
        iv.hub.subscribeToEvent("REMOVE_SAVESEARCH_CONTEXT", this.removeSaveSearchContext, this);
        iv.hub.subscribeToEvent("DATA_RECEIVED_PEOPLE", this.renderResultsPeople, this);
        this.initTabStructure();
        this.initGridStructure();
        this.attachDelegates();
    },
    searchCriteria: null,
    persistSearchCriteria: function (data) {
        this.searchCriteria = data;
        this.searchCriteria.q = JSON.parse(decodeURIComponent(data.q));
        if (typeof this.searchCriteria.q.compExcluded === "undefined") {
            this.searchCriteria.q["compExcluded"] = [];
        }
        if (typeof this.searchCriteria.q.excludedEmpIds === "undefined") {
            this.searchCriteria.q["excludedEmpIds"] = [];
        }
    },
    getAllExcludedIds: function (type) {
        var excludedIds = [];
        switch (type) {
            case "company":
                excludedIds = this.excludedIds.companyGrid.concat(iv.lists.formController.permanentExcludedIds.companyGrid);
                break;
            case "people":
                excludedIds = this.excludedIds.peopleGrid.concat(iv.lists.formController.permanentExcludedIds.peopleGrid);
                break;
        }
        return _.uniq(excludedIds);
    },
    addExcludedId: function (gridType, id) {
        this.excludedIds[gridType].push(id);
    },
    popper: function (array, value) {
        var filteredList = _.filter(array, function (a) {
            return (value !== a);
        });
        return filteredList;
    },
    removeExcludedId: function (gridType, id) {
        this.excludedIds[gridType] = this.popper(this.excludedIds[gridType], id);
    },
    purgeExcludedIds: function (gridType) {
        this.excludedIds[gridType] = [];
    },
    handleState: function (obj) {
        this.showResultTabInitialState();
        var viewSt = obj.eventData.vs;
        if (viewSt == "CF" || viewSt == "PF") {
            $("#results-view-container").hide();
            this.initGridStructure();
            if (!this.hasSearchContext()) {
                this.purgeExcludedIds("companyGrid");
                this.purgeExcludedIds("peopleGrid");
            }
        } else {
            if (viewSt == "CR" || viewSt == "PR") {
                var localObjRef = JSON.parse(JSON.stringify(obj));
                this.persistSearchCriteria(localObjRef.eventData);
                this.activeTab = viewSt;
                $(".listbuildPanel .pages,.listbuildPanel .header,.listbuildPanel .pagination").empty();
                $("#results-view-container").show();
                $(".autoscroll-backtop").click();
                var tab = viewSt === "CR" ? "company" : "people";
                $("#" + tab + "Results").click();
                if (!this[tab + "Grid"].sorting && !this[tab + "Grid"].paginating) {
                    this.showLoader();
                }
            }
        }
    },
    showLoader: function () {
        $("#results-view-container .tab_loader").show();
    },
    hideLoader: function () {
        $("#results-view-container .tab_loader").hide();
    },
    initTabStructure: function () {
        var config = {
            container: "#results-tab-container",
            tabClass: "secondaryNavListItems",
            tabPanelClass: "listbuildPanel",
            tabSelectedClass: "secondaryNavListItemSelected",
            loader: ".tab_loader",
            tabShowEventCallback: _.bind(function (resp) {
                this.handleTabPanelStates(resp);
            }, this),
            tabMapping: [{
                "tabId": "companyResults",
                "tabPanelId": "companyPanel",
                "source": "",
                "preLoaded": true,
                "preserveTabState": true,
                "sourceResponseType": "dummy WTF"
            }, {
                "tabId": "peopleResults",
                "tabPanelId": "peoplePanel",
                "source": "",
                "preLoaded": true,
                "sourceResponseType": "dummy - WTF",
                "preserveTabState": true
            }]
        };
        this.tabStructure = iv.widgets.tab.create(config);
    },
    handleTabPanelStates: function (data) {
        var tabObj = data["tab"];
        var gridObj;
        if (tabObj.attr("id") === "companyResults") {
            gridObj = this.companyGrid.obj;
        } else {
            gridObj = this.peopleGrid.obj;
        }
        if (gridObj.find(".header").find(".row").length != 0 && gridObj.find(".pages").html() != "") {
            this.hideLoader();
        } else {
            if (tabObj.attr("id") === "companyResults") {
                if (!iv.lists.renderer.companyGrid.errorState) {
                    this.showLoader();
                }
            } else {
                if (!iv.lists.renderer.peopleGrid.errorState) {
                    this.showLoader();
                }
            }
        }
        this.adjustGridCellHeight();
    },
    initGridStructure: function () {
        this.peopleGrid.obj.html(_.template(iv.ui.getTemplate("grid.structure"), {}));
        this.companyGrid.obj.html(_.template(iv.ui.getTemplate("grid.structure"), {}));
    },
    getUnConnectedString: function () {
        if (!iv.lists.renderer.unConnectedString || iv.lists.renderer.unConnectedString == "") {
            var filterObj = {
                "cCWF": "coWorkers",
                "cPCWF": "prevCoWorkers",
                "cPTCF": "previousTeamCoWorker",
                "cRAF": "refAccounts",
                "cEF": "education",
                "cPFDF": "personalFirstDegree",
                "cPSDF": "personalSecondDegree",
                "cPTF": "personalTeam"
            };
            var unConnectedElements = [];
            $.each(filterObj, function (index, element) {
                if (!iv.lists.formController.queryParams[index] || iv.lists.formController.queryParams[index] == "false") {
                    unConnectedElements.push(element);
                }
            });
            iv.lists.renderer.unConnectedString = unConnectedElements.join("_");
        }
    },
    setUnConnectedString: function () {
        if (iv.lists.renderer.unConnectedString === "") {
            return;
        }
        $(".connections a").each(function (index, element) {
            var currHref = $(element).attr("href");
            currHref = currHref + "&unconnected=" + iv.lists.renderer.unConnectedString;
            $(element).attr("href", currHref);
        });
    },
    processCompanyListData: function (responseData) {
        _.each(responseData, function (data) {
            if (typeof data.revenue != "undefined" && data.revenue) {
                if (data.revenue.match(/-[0-9.]*/)) {
                    data.revenue = "(" + iv.ui.getTemplate("localizedLabels.currencySymbol") + data.revenue.replace("-", "") + ")M";
                } else {
                    data.revenue = iv.ui.getTemplate("localizedLabels.currencySymbol") + data.revenue + "M";
                }
            } else {
                data.revenue = "N/A";
            }
            if (typeof data.employees == "undefined" || !data.employees) {
                data.employees = "N/A";
            }
        });
    },
    showError: function (resp, type) {
        switch (type) {
            case "company":
                $("#companyGrid").hide();
                $("#companyPanel .errorBox").show();
                $("#companyPanel .errorBox .errorText").html(resp.eventData.errorMessage);
                this.companyGrid.errorState = true;
                break;
            case "people":
                $("#peopleGrid").hide();
                $("#peoplePanel .errorBox").show();
                $("#peoplePanel .errorBox .errorText").html(resp.eventData.errorMessage);
                this.peopleGrid.errorState = true;
                break;
        }
    },
    hideError: function (type) {
        switch (type) {
            case "company":
                $("#companyGrid").show();
                $("#companyPanel .errorBox").hide();
                this.companyGrid.errorState = false;
                break;
            case "people":
                $("#peopleGrid").show();
                $("#peoplePanel .errorBox").hide();
                this.peopleGrid.errorState = false;
                break;
        }
    },
    renderResultsCompany: function (resp) {
        if (resp.error != true) {
            this.hideError("company");
            this.hideLoader();
            this.companyGrid.obj.find(".floaterImg").hide();
            this.companyGrid.obj.find(".floater").hide();
            this.processCompanyListData(resp.data.companyListResults);
            if (this.companyGrid.paginating) {
                this.companyGrid.paginating = false;
                this.companyGrid.pagination.startIndex = (this.companyGrid.pagination.activePage - 1) * 20;
            } else {
                this.companyGrid.pagination.activePage = 1;
            }
            var hasConnections = false;
            var config = {};
            if (typeof resp.data.companyCriteria.Connections != "undefined") {
                if (resp.data.companyCriteria.Connections != "") {
                    hasConnections = true;
                }
                this.getUnConnectedString();
            }
            if (typeof resp.data.totalCount != "undefined") {
                $("#cmpCount").hide();
                $("#companyCount").html("(" + resp.data.totalCount + ")");
                $("#export-company").removeClass("disabled");
                if (resp.data.totalCount == 0) {
                    $("#export-company").addClass("disabled");
                }
                this.companyGrid.pagination.total = resp.data.totalCount;
            }
            if (hasConnections) {
            	console.log("connect");
                config.columns = this.gridConfig.companyConnection;
            } else {
            	console.log("unconnect");
                config.columns = this.gridConfig.company;
            }
            this.companyGrid.sort.name = resp.data.companyCriteria["Sort By"];
            this.companyGrid.sort.order = resp.data.companyCriteria["Sort Order"] == "Ascending" ? "asc" : "desc";
            config.sort = this.companyGrid.sort;
            config.filterData = resp.data.companyListResults;
            config.search = this.companyGrid.search;
            config.messages = this.companyGrid.messages;
            config.extendedTemplate = this.companyGrid.extendedTemplate;
            config.pagination = this.companyGrid.pagination;
            $("#comheader").html(_.template(iv.ui.getTemplate("grid.header"), config));
            console.log("test");
            $("#compagination").html(_.template(iv.ui.getTemplate("grid.pagination.numbers"), config));
//            this.companyGrid.obj.find(".header").html(_.template(iv.ui.getTemplate("grid.header"), config));
//            this.companyGrid.obj.find(".pagination").html(_.template(iv.ui.getTemplate("grid.pagination.numbers"), config));
            config.pagination.startIndex = 0;
            config.uniqueId = "";
            $("#compages").html(_.template(iv.ui.getTemplate("grid.page"), config));
//            this.companyGrid.obj.find(".pages").text("<input value=''jjjj/>"+_.template(iv.ui.getTemplate("grid.page"), config));
            this.setSortInSummary(resp.data.companyCriteria, "company");
            this.highlightCompanyRemovedRows();
            if (hasConnections) {
                this.setUnConnectedString();
            }
            this.addCompanyFollowButtons();
            this.adjustGridCellHeight();
            if (resp.data.companyCriteria["Smart Agent"] || resp.data.companyCriteria["Keywords"]) {
                this.setHasSmartAgentsClass();
                this.setupCompanyAgents(resp.data.companyListResults);
            }
        } else {
            if (resp.error == true) {
                this.companyGrid.obj.find(".active").removeClass("active");
                var $this = this;
                if (typeof this.companyGrid.obj.find(".num") != "undefined") {
                    _.each(this.companyGrid.obj.find(".num"), function (row) {
                        if (parseInt($(row).text()) == $this.companyGrid.pagination.activePage) {
                            $(row).addClass("active");
                        }
                    });
                }
                this.hideLoader();
                $("#cmpCount").hide();
                $(".floater,.floaterImg").hide();
                this.showError(resp, "company");
            }
        }
    },
    getExecIdMap: function (data) {
        var execMap = {};
        _.each(data, function (execInfo) {
            execMap[execInfo.employmentId] = execInfo.executiveId;
        });
        return execMap;
    },
    renderResultsPeople: function (resp) {
        if (resp.error != true) {
            this.hideError("people");
            this.hideLoader();
            this.peopleGrid.obj.find(".floaterImg").hide();
            this.peopleGrid.obj.find(".floater").hide();
            if (this.peopleGrid.paginating) {
                this.peopleGrid.paginating = false;
                this.peopleGrid.pagination.startIndex = (this.peopleGrid.pagination.activePage - 1) * 20;
            } else {
                this.peopleGrid.pagination.activePage = 1;
            }
            var hasConnections = false;
            var config = {};
            if (typeof resp.data.contactCriteria.Connections != "undefined") {
                if (resp.data.contactCriteria.Connections != "") {
                    hasConnections = true;
                }
                this.getUnConnectedString();
            }
            if (typeof resp.data.totalCount != "undefined") {
                $("#pplCount").hide();
                $("#peopleCount").html("(" + resp.data.totalCount + ")");
                $("#export-people").removeClass("disabled");
                if (resp.data.totalCount == 0) {
                    $("#export-people").addClass("disabled");
                }
                this.peopleGrid.pagination.total = resp.data.totalCount;
            }
            if (hasConnections) {
                config.columns = this.gridConfig.peopleConnection;
            } else {
                config.columns = this.gridConfig.people;
            }
            this.peopleGrid.sort.name = resp.data.contactCriteria["People Sort By"];
            this.peopleGrid.sort.order = resp.data.contactCriteria["People Sort Order"] == "Ascending" ? "asc" : "desc";
            config.sort = this.peopleGrid.sort;
            config.filterData = resp.data.contactListResults;
            config.search = this.peopleGrid.search;
            config.messages = this.peopleGrid.messages;
            config.extendedTemplate = this.peopleGrid.extendedTemplate;
            config.pagination = this.peopleGrid.pagination;
//            this.peopleGrid.obj.find(".header").html(_.template(iv.ui.getTemplate("grid.header"), config));
//            this.peopleGrid.obj.find(".pagination").html(_.template(iv.ui.getTemplate("grid.pagination.numbers"), config));
            $("#peopleheader").html(_.template(iv.ui.getTemplate("grid.header"), config));
            $("#peoplepagination").html(_.template(iv.ui.getTemplate("grid.pagination.numbers"), config));
            config.pagination.startIndex = 0;
            config.uniqueId = "";
            $("#peoplepages").html(_.template(iv.ui.getTemplate("grid.page"), config));
            this.setCurrentSummaryObject(resp.data.contactCriteria);
            this.showSearchSummary(resp.data.contactCriteria, "people-search-summary");
            this.highlightPeopleRemovedRows();
            if (hasConnections) {
                this.setUnConnectedString();
            }
            this.addExecFollowButtons(this.getExecIdMap(resp.data.contactListResults));
            this.adjustGridCellHeight();
            if (resp.data.contactCriteria["Smart Agent"] || resp.data.contactCriteria["Keywords"]) {
                this.setHasSmartAgentsClass();
                this.setupPeopleAgents(resp.data.contactListResults);
            }
        } else {
            if (resp.error == true) {
                this.peopleGrid.obj.find(".active").removeClass("active");
                var $this = this;
                if (typeof this.peopleGrid.obj.find(".num") != "undefined") {
                    _.each(this.peopleGrid.obj.find(".num"), function (row) {
                        if (parseInt($(row).text()) == $this.peopleGrid.pagination.activePage) {
                            $(row).addClass("active");
                        }
                    });
                }
                this.hideLoader();
                $("#pplCount").hide();
                $(".floater,.floaterImg").hide();
                this.showError(resp, "people");
            }
        }
    },
    createModal: function (type) {
        require([iv.ui.getTemplate("commonRequires.modal")], function () {
            iv.modal.init({
                content: '<div class="exportList" ><div style="width: 350px;height: auto;text-align: center;margin: 50px 0;"><img src="' + iv.util.getThemedImageUrl("LoadingAnimation") + '"/></div></div>',
                events: {
                    render: function (event, api) {
                        iv.lists.renderer.getExportHTML(type);
                    },
                    hide: {
                        event: "click",
                        target: $(".close")
                    }
                }
            });
        });
    },
    getExportHTML: function (type) {
        var ref = this;
        iv.lists.renderer.searchCriteria.q.compExcluded = iv.lists.renderer.getAllExcludedIds("company");
        iv.lists.renderer.searchCriteria.q.excludedEmpIds = iv.lists.renderer.getAllExcludedIds("people");
        var params = {
            query: JSON.stringify(iv.lists.renderer.searchCriteria.q)
        };
        iv.api.userAction.doPost({
            resource: this.exportUrls[type]["metadata"],
            success: function (resp) {
                params.query = params.query.replace(/"/g, "&#34;");
                resp.type = type;
                resp.entity = type == "company" ? "companies" : "people";
                resp.action = ref.exportUrls[type]["data"];
                $("#exportIframe").remove();
                var html = _.template(iv.ui.getTemplate("listBuilding.exportSummary"), $.extend(true, resp, params));
                $(".ui-tooltip-content .exportList").html(html);
                $("body").append($("#exportIframe"));
                $(".ui-tooltip-content .exportList input.close").bind("click", function (event) {
                    iv.modal.remove();
                });
                $(".ui-tooltip-content .exportList input[type=submit]").bind("click", function (event) {
                    $(".ui-tooltip-content .exportList input[type=submit]").hide();
                    $(".ui-tooltip-content .exportList input.close").val("OK");
                    $(".ui-tooltip-content .exportList #export-summary .message").remove();
                    $(".ui-tooltip-content .exportList #export-summary .head").removeClass("head").addClass("message").text("Your file is downloading and should be finished shortly.");
                });
            },
            error: function (resp) {},
            responseType: "json",
            urlParams: params
        });
    },
    attachModalEvents: function () {},
    showResultTabInitialState: function () {
        iv.lists.renderer.purgeExcludedIds("companyGrid");
        iv.lists.renderer.purgeExcludedIds("peopleGrid");
        $("a#save-search").addClass("disabled");
        iv.lists.renderer.hideError("company");
        iv.lists.renderer.hideError("people");
        $("#companyGrid").hide();
        $("#peopleGrid").hide();
        iv.lists.renderer.unConnectedString = "";
        $("#peopleCount").html("");
        $("#companyCount").html("");
        $("#pplCount").show();
        $("#cmpCount").show();
        $("#people-search-summary").hide();
        $(window).scrollTop(0);
        iv.lists.renderer.companyGrid.pagination.startIndex = 0;
        iv.lists.renderer.companyGrid.pagination.activePage = 1;
        iv.lists.renderer.peopleGrid.pagination.startIndex = 0;
        iv.lists.renderer.peopleGrid.pagination.activePage = 1;
    },
    adjustGridCellHeight: function () {
        if (!$(".page:visible").hasClass("adjusted")) {
            $(".page:visible").addClass("adjusted");
            if (!$(".page:visible").hasClass("hasSmartAgents")) {
                $(".pages .page .row:visible").each(function (index, row) {
                    $(row).find(".cell").css("height", $(row).height());
                });
            } else {
                $(".pages .page .row:visible").each(function (index, row) {
                    $(row).find(".cell").css("height", $(row).height() - 20);
                });
            }
        }
    },
    setupCompanyAgents: function (companyList) {
        for (var i = 0; i < companyList.length; i++) {
            var curr = companyList[i];
            if (typeof curr.smartAgentInfo != "undefined" && curr.smartAgentInfo != null && curr.smartAgentInfo != "") {
                var url = iv.application.data.isStreamEnabled && curr.smartAgentInfo.keywords == null ? iv.application.data.cloudAppUrl + "loadArticlesInJSONListBuild.iv" : "/iv/launchCompanyNews.do";
                var callbackName = "displayCompanyAgents" + i;
                window[callbackName] = function (obj) {
                    return function (resp) {
                        iv.lists.renderer.displayCompanyAgents(resp, obj);
                    };
                }(curr);
                curr.smartAgentInfo.padding = callbackName;
                iv.api.getJSONP({
                    resource: url,
                    urlParams: curr.smartAgentInfo
                });
            }
        }
    },
    displayCompanyAgents: function (resp, curr) {
        if (typeof resp.error != "undefined" && resp.error) {
            return;
        }
        var data = resp.data;
        data.companyId = curr.companyId;
        var agentHtml = _.template(iv.ui.getTemplate("listBuilding.agentResults"), data);
        var appendElement = $("#company_" + curr.companyId).parents(".row");
        $(appendElement).append(agentHtml);
        $(appendElement).append('<div class="clearfix"></div>');
        iv.lists.renderer.attachAgentsEventHandlers(appendElement, data);
    },
    setupPeopleAgents: function (peopleList) {
        for (var i = 0; i < peopleList.length; i++) {
            var curr = peopleList[i];
            if (typeof curr.smartAgentInfo != "undefined" && curr.smartAgentInfo != null && curr.smartAgentInfo != "") {
                var url = iv.application.data.isStreamEnabled && curr.smartAgentInfo.keywords == null ? iv.application.data.cloudAppUrl + "loadArticlesInJSONListBuild.iv" : "/iv/launchCompanyNews.do";
                var callbackName = "displayPeopleAgents" + i;
                window[callbackName] = function (obj) {
                    return function (resp) {
                        iv.lists.renderer.displayPeopleAgents(resp, obj);
                    };
                }(curr);
                curr.smartAgentInfo.padding = callbackName;
                iv.api.getJSONP({
                    resource: url,
                    urlParams: curr.smartAgentInfo
                });
            }
        }
    },
    displayPeopleAgents: function (resp, curr) {
        if (typeof resp.error != "undefined" && resp.error) {
            return;
        }
        var data = resp.data;
        data.companyId = curr.companyId;
        data.employmentId = curr.employmentId;
        var agentHtml = _.template(iv.ui.getTemplate("listBuilding.agentResults"), data);
        var appendElement = $("#people_" + curr.employmentId).parents(".row");
        $(appendElement).append(agentHtml);
        $(appendElement).append('<div class="clearfix"></div>');
        iv.lists.renderer.attachAgentsEventHandlers(appendElement, data);
    },
    attachAgentsEventHandlers: function (targetEle, data) {
        targetEle.find(".agent-text").bind("click", iv.lists.renderer.toggleAgent);
        targetEleId = $(targetEle).find(".agent-container").attr("id");
        if (!iv.lists.renderer.smartAgentsMap) {
            iv.lists.renderer.smartAgentsMap = {};
        }
        iv.lists.renderer.smartAgentsMap[targetEleId] = data;
    },
    setArticleTooltip: function (container) {
        var id = $(container).attr("id");
        var data = iv.lists.renderer.smartAgentsMap[id];
        var targetEle = $(container);
        if (!_.isUndefined(data.results) && !_.isEmpty(data.results)) {
            for (var i = 0; i < data.results.length; i++) {
                var newsInfo = data.results[i];
                var url = "/iv/callout?isHttp=yes&mode=" + data.mode + "&id=" + newsInfo.articleId + "&selling_trigger_keywords=" + data.agentName + "&company_id=" + data.companyId;
                var id = newsInfo.articleId + "|" + data.mode + "|" + encodeURIComponent(data.agentName) + "|" + data.companyId;
                var elem = document.getElementById(id);
                if (elem) {
                    createTooltipObject(elem, url);
                }
            }
        }
        function createTooltipObject(elem, url) {
            var elem = elem;
            var url = url;
            var hasTooltipInit = false;
            $(elem).bind("mouseenter", initTooltip);

            function initTooltip() {
                if (hasTooltipInit == true) {
                    return;
                }
                hasTooltipInit = true;
                new ivTooltip({
                    "target": elem,
                    "timeOut": 200,
                    "width": 400,
                    "displayCallback": function (elem) {},
                    "prefetch": false,
                    "dataSource": url,
                    "smallerFrame": false
                });
                $(elem).trigger("mouseenter");
            }
        }
    },
    toggleAgent: function () {
        var container = $(this).parent();
        var containerId = $(container).attr("id");
        if (iv.lists.renderer.smartAgentsMap[containerId]) {
            iv.lists.renderer.setArticleTooltip(container);
            delete iv.lists.renderer.smartAgentsMap[containerId];
        }
        var image = container.find("img:first");
        var agentCont = container.find(".agent-result-cont");
        var agStyle = agentCont.css("display");
        if (agStyle === "block") {
            agentCont.hide();
            image.attr("src", "/iv/common/styles/images/icon_arrow_toggle_0.gif");
        } else {
            agentCont.show();
            image.attr("src", "/iv/common/styles/images/icon_arrow_toggle_1.gif");
        }
        return false;
    },
    setHasSmartAgentsClass: function () {
        $(".grid .pages .page").addClass("hasSmartAgents");
    },
    updatePeopleResults: function () {
        $("#peopleGrid .grid").find(".floater").show();
        $("#peopleGrid .grid").find(".floaterImg").show();
        $("#peopleGrid .grid").find(".active").removeClass("active");
        $("#peopleCount").html("");
        $("#pplCount").show();
        iv.hub.publishEvent("UPDATE_PEOPLE_RESULTS", iv.lists.renderer.getAllExcludedIds("company"));
    },
    highlightPeopleRemovedRows: function () {
        var $this = this;
        _.each(this.excludedIds["peopleGrid"], function (curr) {
            $("#people_" + curr).parents(".row").find(".deleteIcon").hide();
            $("#people_" + curr).parents(".row").find(".extended").show();
            $this.handleRemovedCount("peopleGrid");
        });
        if (this.excludedIds["peopleGrid"].length == 0) {
            $("#peopleGrid").find(".row").find(".extended").hide();
            $("#peopleGrid").find(".row").find(".deleteIcon").show();
        }
        $this.handleRemovedCount("peopleGrid");
    },
    highlightCompanyRemovedRows: function () {
        var $this = this;
        _.each(this.excludedIds["companyGrid"], function (curr) {
            $("#company_" + curr).parents(".row").find(".deleteIcon").hide();
            $("#company_" + curr).parents(".row").find(".extended").show();
        });
        if (this.excludedIds["companyGrid"].length == 0) {
            $("#companyGrid").find(".row").find(".extended").hide();
            $("#companyGrid").find(".row").find(".deleteIcon").show();
        }
        $this.handleRemovedCount("companyGrid");
    },
    getSearchSummaryHTML: function (data) {
        var html = "";
        var labelKey;
        var labelValue;
        _.each(data, function (value, key) {
            labelKey = key;
            if (typeof value == "object") {
                labelValue = value.toString();
            } else {
                labelValue = value;
            }
            if (key != "Companies Removed" && key != "People Removed") {
                html += _.template(iv.ui.getTemplate("listBuilding.searchSummary"), {
                    key: labelKey,
                    value: labelValue
                });
            }
        });
        _.each(["Companies", "People"], function (key) {
            html += _.template(iv.ui.getTemplate("listBuilding.removeTemplate"), {
                key: key
            });
        });
        return html;
    },
    currentSummaryObject: null,
    setCurrentSummaryObject: function (data) {
        this.currentSummaryObject = data;
    },
    getCurrentSummaryObject: function (data) {
        return this.currentSummaryObject;
    },
    showSearchSummary: function (data, type) {
        $("a#save-search").removeClass("disabled");
        if (!$("#people-search-summary").is(":visible")) {
            var htmlText = this.getSearchSummaryHTML(data);
            $("#" + type + " .details").html(htmlText);
            $("#" + type).show();
            $("#people-search-summary .details .sub-type").each(function (index, element) {
                if ($(element).html().match(/Company Sort By/)) {
                    $(element).next().attr("id", "companySortBy");
                }
                if ($(element).html().match(/People Sort By/)) {
                    $(element).next().attr("id", "peopleSortBy");
                }
                if ($(element).html().match(/Company Sort Order/)) {
                    $(element).next().attr("id", "companySortOrder");
                }
                if ($(element).html().match(/People Sort Order/)) {
                    $(element).next().attr("id", "peopleSortOrder");
                }
            });
        } else {
            this.setSortInSummary(data, "people");
        }
    },
    setSortInSummary: function (data, type) {
        if ($("#people-search-summary").is(":visible")) {
            switch (type) {
                case "company":
                    iv.lists.renderer.searchCriteria.q.compSB = data["Sort By"];
                    iv.lists.renderer.searchCriteria.q.compSO = data["Sort Order"];
                    iv.lists.renderer.currentSummaryObject["Company Sort By"] = data["Sort By"];
                    iv.lists.renderer.currentSummaryObject["Company Sort Order"] = data["Sort Order"];
                    $("#people-search-summary #companySortBy").html(data["Sort By"] + ";&nbsp;");
                    $("#people-search-summary #companySortOrder").html(data["Sort Order"] + ";&nbsp;");
                    break;
                case "people":
                    iv.lists.renderer.searchCriteria.q.contSB = data["People Sort By"];
                    iv.lists.renderer.searchCriteria.q.contSO = data["People Sort Order"];
                    iv.lists.renderer.currentSummaryObject["People Sort By"] = data["People Sort By"];
                    iv.lists.renderer.currentSummaryObject["People Sort Order"] = data["People Sort Order"];
                    $("#people-search-summary #peopleSortBy").html(data["People Sort By"] + ";&nbsp;");
                    $("#people-search-summary #peopleSortOrder").html(data["People Sort Order"] + ";&nbsp;");
                    break;
            }
        }
    },
    handleRemovedCount: function (gridId) {
        var gridWord = gridId.substring(0, gridId.length - 4);
        var key = iv.util.capitalize(gridWord);
        key = key == "Company" ? "Companies" : "People";
        if (this.excludedIds[gridId].length != 0) {
            $("." + key).find(".removeCount" + key).html(this.excludedIds[gridId].length);
            $(".search_summary").find("." + key).show();
        } else {
            $(".search_summary").find("." + key).hide();
        }
    },
    addCompanyFollowButtons: function () {
        $("#companyGrid .pages .row .cell.Location").append('<div class="follow"><div class="followButtonDiv"></div></div>');
        $("#companyGrid .pages .row").bind("mouseover", function () {
            $("#companyGrid .pages .row .cell.Location .text").show();
            $("#companyGrid .pages .row .cell.Location .follow").hide();
            if ($(this).find(".extended:visible").length == 0) {
                $(this).find(".cell.Location .text").hide();
                $(this).find(".cell.Location .follow").show();
            }
        });
        $("#companyGrid .pages .row").bind("mouseleave", function () {
            $(this).find(".cell.Location .text").show();
            $(this).find(".cell.Location .follow .menu ul").hide();
            $(this).find(".cell.Location .follow").hide();
        });
        var followMap = [];
        _.each($("#companyGrid .pages .row .Name .text a"), function (element) {
            var currentId = $(element).attr("id");
            var parameters = currentId.split("_");
            var config = {
                followType: "inline",
                entityType: "company",
                watchlistInfo: iv.user.data.genericWatchlistInfo,
                companyId: parameters[1],
                trackedByWatchlists: iv.util.getCompanyTrackedByWatchlist(parameters[1])
            };
            followMap.push({
                "selector": $(element).parents("#companyGrid .pages .row").find(".followButtonDiv"),
                "config": config
            });
        });
        iv.follow.manager.createWidgets(followMap);
        if ($.browser.msie && $.browser.version <= 7) {
            _.each($("#companyGrid .pages .row"), function (row) {
                var zIndex = $(row).find(".follow .menu").css("z-index");
                $(row).css("z-index", zIndex);
            });
        }
    },
    addExecFollowButtons: function (execMap) {
        $("#peopleGrid .pages .row .cell.Title").append('<div class="follow"><div class="followButtonDiv"></div></div>');
        $("#peopleGrid .pages .row").bind("mouseover", function () {
            $("#peopleGrid .pages .row .cell.Title .text").show();
            $("#peopleGrid .pages .row .cell.Title .follow").hide();
            if ($(this).find(".extended:visible").length == 0) {
                $(this).find(".cell.Title .text").hide();
                $(this).find(".cell.Title .follow").show();
            }
        });
        $("#peopleGrid .pages .row").bind("mouseleave", function () {
            $(this).find(".cell.Title .text").show();
            $(this).find(".cell.Title .follow .menu ul").hide();
            $(this).find(".cell.Title .follow").hide();
        });
        var followMap = [];
        _.each($("#peopleGrid .pages .row .Name .text a"), function (element) {
            var currentId = $(element).attr("id");
            var parameters = currentId.split("_");
            employmentId = parameters[1];
            var config = {
                followType: "inline",
                entityType: "person",
                watchlistInfo: iv.user.data.genericWatchlistInfo,
                executiveId: execMap[employmentId],
                employmentId: employmentId,
                trackedByWatchlists: iv.util.getExecTrackedByWatchlist(execMap[employmentId])
            };
            followMap.push({
                "selector": $(element).parents("#peopleGrid .pages .row").find(".followButtonDiv"),
                "config": config
            });
        });
        iv.follow.manager.createWidgets(followMap);
        if ($.browser.msie && $.browser.version <= 7) {
            _.each($("#peopleGrid .pages .row"), function (row) {
                var zIndex = $(row).find(".follow .menu").css("z-index");
                $(row).css("z-index", zIndex);
            });
        }
    },
    attachDelegates: function () {
        var $this = this;
        $(".listbuildPanel").delegate(".sortable", "click", function () {
            var gridContainer = $(this).parents(".grid");
            var gridId = gridContainer.parent().attr("id");
            $("#" + gridId + " .sortable").removeClass("sorted");
            $("#" + gridId + " .sortable").find(".ico").css("opacity", "0.4");
            $(this).find(".ico").css("opacity", "1");
            $this[gridId].sorting = true;
            var remove = $(this).hasClass("asc") == true ? "asc" : "desc";
            var add = $(this).hasClass("asc") == true ? "desc" : "asc";
            $(this).addClass(add).removeClass(remove).addClass("sorted");
            var sortOrder = add == "asc" ? "Ascending" : "Descending";
            var sortByValue = $(this).attr("name");
            gridContainer.find(".floater").show();
            gridContainer.find(".floaterImg").show();
            gridContainer.find(".active").removeClass("active");
            if (gridId == "companyGrid") {
                $this.companyGrid.sorting.name = sortByValue;
                iv.lists.formController.updateCompanySort(sortByValue, sortOrder);
            } else {
                iv.lists.formController.updatePeopleSort(sortByValue, sortOrder, $this.excludedIds.companyGrid.join(","));
            }
        });
        $(".listbuildPanel").delegate(".deleteIcon", "click", function () {
            var gridId = $(this).parents(".grid").parent().attr("id");
            $(this).hide();
            $(this).parents(".row").find(".extended").show();
            $(this).parents(".row").find(".cell.Title .text").show();
            $(this).parents(".row").find(".cell.Title .follow").hide();
            $(this).parents(".row").find(".cell.Location .text").show();
            $(this).parents(".row").find(".cell.Location .follow").hide();
            var targId = $(this).attr("id").split("_")[1];
            $this.addExcludedId(gridId, targId);
            $this.handleRemovedCount(gridId);
            if (gridId == "companyGrid") {
                $this.updatePeopleResults();
            }
            if (gridId == "companyGrid") {
                var excludedIds = iv.lists.renderer.getAllExcludedIds("company").length;
                var total = 0;
                if (typeof iv.lists.renderer.companyGrid != "undefined" && typeof iv.lists.renderer.companyGrid != null && typeof iv.lists.renderer.companyGrid.pagination != "undefined") {
                    total = iv.lists.renderer.companyGrid.pagination.total;
                }
                if (total == excludedIds) {
                    $("#export-company").removeClass("disabled").addClass("disabled");
                } else {
                    $("#export-company").removeClass("disabled");
                }
            } else {
                var excludedIds = iv.lists.renderer.getAllExcludedIds("people").length;
                var total = 0;
                if (typeof iv.lists.renderer.peopleGrid != "undefined" && typeof iv.lists.renderer.peopleGrid != null && typeof iv.lists.renderer.peopleGrid.pagination != "undefined") {
                    total = iv.lists.renderer.peopleGrid.pagination.total;
                }
                if (total == excludedIds) {
                    $("#export-people").removeClass("disabled").addClass("disabled");
                } else {
                    $("#export-people").removeClass("disabled");
                }
            }
        });
        $(".listbuildPanel").delegate(".undo-link", "click", function () {
            $(this).parents(".row").find(".deleteIcon").show();
            var gridId = $(this).parents(".grid").parent().attr("id");
            var hideId = $(this).parents(".hide-row").attr("id").split("-")[1];
            $(this).parents(".row").find(".extended").hide();
            $this.removeExcludedId(gridId, hideId);
            $this.handleRemovedCount(gridId);
            if (gridId == "companyGrid") {
                $this.updatePeopleResults();
            }
            if (gridId == "companyGrid") {
                var excludedIds = iv.lists.renderer.getAllExcludedIds("company").length;
                var total = 0;
                if (typeof iv.lists.renderer.companyGrid != "undefined" && typeof iv.lists.renderer.companyGrid != null && typeof iv.lists.renderer.companyGrid.pagination != "undefined") {
                    total = iv.lists.renderer.companyGrid.pagination.total;
                }
                if (total == excludedIds) {
                    $("#export-company").removeClass("disabled").addClass("disabled");
                } else {
                    $("#export-company").removeClass("disabled");
                }
            } else {
                var excludedIds = iv.lists.renderer.getAllExcludedIds("people").length;
                var total = 0;
                if (typeof iv.lists.renderer.peopleGrid != "undefined" && typeof iv.lists.renderer.peopleGrid != null && typeof iv.lists.renderer.peopleGrid.pagination != "undefined") {
                    total = iv.lists.renderer.peopleGrid.pagination.total;
                }
                if (total == excludedIds) {
                    $("#export-people").removeClass("disabled").addClass("disabled");
                } else {
                    $("#export-people").removeClass("disabled");
                }
            }
        });
        $(".listbuildPanel").delegate(".num", "click", function () {
            $(this).parents(".grid").find(".floater").show();
            $(this).parents(".grid").find(".floaterImg").show();
            $(this).parents(".grid").find(".active").removeClass("active");
            var gridId = $(this).parents(".grid").parent().attr("id");
            $this[gridId].paginating = true;
            $(this).addClass("active");
            var pageText = parseInt($(this).text());
            if (gridId == "companyGrid") {
                var pageNums = iv.lists.renderer.companyGrid.obj.find(".num");
                var startNum = parseInt($(pageNums[1]).text());
                var endNum = parseInt($(pageNums[$(pageNums).length - 2]).text());
                if ($(this).hasClass("next")) {
                    pageText = endNum + 1;
                } else {
                    if ($(this).hasClass("prev")) {
                        pageText = startNum - 10;
                    }
                }
                iv.lists.renderer.companyGrid.pagination.activePage = pageText;
                iv.lists.searcher.paginateCompany(pageText);
            } else {
                var pageNums = iv.lists.renderer.peopleGrid.obj.find(".num");
                var startNum = parseInt($(pageNums[1]).text());
                var endNum = parseInt($(pageNums[$(pageNums).length - 2]).text());
                if ($(this).hasClass("next")) {
                    pageText = endNum + 1;
                } else {
                    if ($(this).hasClass("prev")) {
                        pageText = startNum - 10;
                    }
                }
                iv.lists.renderer.peopleGrid.pagination.activePage = pageText;
                iv.lists.searcher.paginatePeople(pageText, iv.lists.renderer.getAllExcludedIds("company"));
            }
            $(window).scrollTop(0);
        });
        var $this = this;
        $("#save-search").bind("click", function () {
            if ($("#save-search").hasClass("disabled")) {
                return;
            }
            iv.lists.renderer.searchCriteria.q.compExcluded = iv.lists.renderer.getAllExcludedIds("company");
            iv.lists.renderer.searchCriteria.q.excludedEmpIds = iv.lists.renderer.getAllExcludedIds("people");
            iv.hub.publishEvent("DO_SAVE_SEARCH", {
                summaryHtml: $this.getSearchSummaryHTML($this.getCurrentSummaryObject()),
                summaryObj: $this.getCurrentSummaryObject(),
                criteria: $this.searchCriteria
            });
            return false;
        });
        $(".search_summary").delegate(".undoCompanies, .undoPeople", "click", function () {
            var type = $(this).hasClass("undoCompanies") == true ? "company" : "people";
            $this.purgeExcludedIds(type + "Grid");
            switch (type) {
                case "company":
                    $(".removeCountCompanies").html("");
                    $(".Companies").hide();
                    $this.highlightCompanyRemovedRows();
                    $this.updatePeopleResults();
                    break;
                case "people":
                    $(".removeCountPeople").html("");
                    $(".People").hide();
                    $this.highlightPeopleRemovedRows();
                    break;
            }
        });
        $("#exportHover").delegate(".export", "click", function () {
            if (!$(this).hasClass("disabled")) {
                var type = $(this).attr("id").split("-")[1];
                $this.createModal(type);
            }
        });
        $("body").delegate("#modify-criteria", "click", function () {
            var queryString = "";
            if ($("#companyPanel:visible").length > 0) {
                queryString = "vs=CF";
            } else {
                queryString = "vs=PF";
            }
            iv.hub.publishEvent("CHANGE_URL", {
                queryString: queryString,
                path: "loadListBuildPage.iv"
            });
        });
    },
    gridConfig: {
        "companyConnection": [{
            "name": "Name",
            "label": "Name",
            "sortable": true,
            "template": '<a class="company-hover bluefont" id="company_<%=companyId%>" name="FULL_<%=companyId%>" target="_blank" href="/iv/companyinfo.do?methodToCall=overview&id=<%=companyId%>"><%=companyName%></a>',
            "widthInPercent": 20
        }, {
            "name": "Location",
            "label": "Location",
            "template": "<%=location%>",
            "sortable": true,
            "widthInPercent": 20
        }, {
            "name": "Type",
            "label": "Type",
            "sortable": true,
            "template": "<%=type%>",
            "widthInPercent": 14
        }, {
            "name": "Revenue",
            "label": iv.ui.getTemplate("localizedLabels.revenue"),
            "sortable": true,
            "template": "<%=revenue%>",
            "widthInPercent": 14,
            "align": "right"
        }, {
            "name": "Employees",
            "label": "Employees",
            "sortable": true,
            "template": "<%=employees%>",
            "widthInPercent": 12,
            "align": "right"
        }, {
            "name": "smartAgentInfo",
            "label": "Connections",
            "sortable": false,
            "template": '<span class="connections"><a class="bluefont" target="insideview_connections" href="/iv/loadPeople.iv?id=<%=companyId%>"><%=connectionCount%></a> </span>',
            "widthInPercent": 12,
            "align": "right"
        }, {
            "name": "delete",
            "label": "Delete",
            "template": '<a class="deleteIcon" id="delete_<%=companyId%>" href="javascript:void(0);"><img src="/iv/common/styles/images/hide-row.png"/></a>',
            "widthInPercent": 7,
            "align": "center"
        }],
        "company": [{
            "name": "Name",
            "label": "名称",
            "sortable": true,
            "template": '<a class="company-hover bluefont companySearchResult" value="<%=companyId%>" id="company_<%=companyId%>" name="FULL_<%=companyId%>" href="#" onclick="javascript:clickSearchResult(<%=companyId%>);"><%=companyName%></a>',
            "widthInPercent": 24
        }, {
            "name": "Location",
            "label": "位置",
            "template": "<%=location%>",
            "sortable": true,
            "widthInPercent": 24
        }, {
            "name": "Type",
            "label": "类型",
            "template": "<%=type%>",
            "sortable": true,
            "widthInPercent": 14
        }, {
            "name": "Revenue",
            "label": iv.ui.getTemplate("localizedLabels.revenue"),
            "sortable": true,
            "template": "<%=revenue%>",
            "widthInPercent": 14,
            "align": "right"
        }, {
            "name": "Employees",
            "label": "雇员",
            "sortable": true,
            "template": "<%=employees%>",
            "widthInPercent": 14,
            "align": "right"
        }, {
            "name": "delete",
            "label": "删除",
            "template": '<a class="deleteIcon" id="delete_<%=companyId%>" href="javascript:void(0);"><img src="image/mainpage/hide-row.png"/></a>',
            "widthInPercent": 9,
            "align": "center"
        }],
        "people": [{
            "name": "Name",
            "label": "姓名",
            "sortable": true,
            "template": '<a id="people_<%=employmentId%>" target="_blank" class="contact-hover bluefont" name="FULL_<%=companyId%>_<%=employmentId%>" href="/iv/executiveinfo.do?methodToCall=overview&id=<%=employmentId%>"><%=fullName%></a>',
            "widthInPercent": 30
        }, {
            "name": "Title",
            "label": "头衔",
            "sortable": true,
            "template": '<span<%if(current == false){%> class="greyText"<%}%>><%=displayTitle%></span>',
            "widthInPercent": 35
        }, {
            "name": "companyName",
            "label": "公司",
            "sortable": true,
            "template": "<%if(current == true){%>" + '<a class="company-hover bluefont" name="FULL_<%=companyId%>" href="/iv/companyinfo.do?methodToCall=overview&id=<%=companyId%>"><%=companyName%></a>' + "<%}else{%>" + '<span class="greyText"><%=companyName%></span><span class="redText"> (Former)</span><%}%>',
            "widthInPercent": 25
        }, {
            "name": "delete",
            "label": "删除",
            "sortable": false,
            "template": '<a class="deleteIcon" id="delete_<%=employmentId%>" href="javascript:void(0);"><img src="image/mainpage/hide-row.png"/></a>',
            "widthInPercent": 9,
            "align": "center"
        }],
        "peopleConnection": [{
            "name": "Name",
            "label": "Name",
            "sortable": true,
            "template": '<a id="people_<%=employmentId%>" target="_blank" class="contact-hover bluefont" name="FULL_<%=companyId%>_<%=employmentId%>" href="/iv/executiveinfo.do?methodToCall=overview&id=<%=employmentId%>"><%=fullName%></a>',
            "widthInPercent": 24
        }, {
            "name": "Title",
            "label": "Title",
            "sortable": true,
            "template": '<span<%if(current == false){%> class="greyText"<%}%>><%=displayTitle%></span>',
            "widthInPercent": 29
        }, {
            "name": "companyName",
            "label": "Company",
            "sortable": true,
            "template": "<%if(current == true){%>" + '<a class="company-hover bluefont" name="FULL_<%=companyId%>" href="/iv/companyinfo.do?methodToCall=overview&id=<%=companyId%>"><%=companyName%></a>' + "<%}else{%>" + '<span class="greyText"><%=companyName%></span><span class="redText"> (Former)</span><%}%>',
            "widthInPercent": 25
        }, {
            "name": "Connections",
            "label": "Connections",
            "sortable": false,
            "template": '<span class="connections"><a class="bluefont" target="insideview_connections" href="/iv/loadPeople.iv?id=<%=companyId%>"><%=connectionCount%></a> </span>',
            "widthInPercent": 11,
            "align": "right"
        }, {
            "name": "delete",
            "label": "Delete",
            "sortable": false,
            "template": '<a class="deleteIcon" id="delete_<%=employmentId%>" href="javascript:void(0);"><img src="/iv/common/styles/images/hide-row.png"/></a>',
            "widthInPercent": 9,
            "align": "center"
        }]
    }
};
registerNS("iv.lists.savedSearch");
iv.lists.savedSearch = {
    config: {
        urls: {
            GET_SAVED_SEARCHES: "/iv/getSavedSearches.iv",
            UPDATE_SAVED_SEARCH: "/iv/updateSavedSearch.iv",
            DELETE_SAVED_SEARCH: "/iv/deleteSavedSearch.iv",
            ADD_SAVED_SEARCH: "/iv/saveSearch.iv"
        }
    },
    saveSearchTemplate: '<div class="crossButton"></div><div class="saveSearchForm">' + '<div class="heading"> <h1>Save Search</h1></div>' + '   <div class="summmary" >' + "<%=summaryHtml%>" + " </div>" + '<div id="overwrite-message">A search with this name already exists. Are you sure you want to overwrite it?</div>' + '<div id="save-search-errorMessage" style="display: none; width: 100%;margin-top: 10px;" class="yellowbox">' + '<span class="common_sprites error_ticker"></span>' + '<span class="errMsg" style="font-weight:bold; line-height:20px;"></span>' + "	</div>" + '<form action="saveSearch.iv" method="POST" id="save-search-form" onSubmit="iv.lists.savedSearch.doSaveSearchOperation();return false;"name="saveSearchForm">' + '<input type="hidden" value="" name="criteria" id="save-criteria"/><input type="hidden" id="save-search-id" value="" name="id" /> ' + '    <div class="fieldContainer" >' + '<label class="name-label">Name:</label><input type="text" name="name" id="save-name" value="" class="name-input" size="60" />' + '</div><div class="actionContainer" >' + '<input type="submit" class="primary_button_flat saveSearchButton" value="Save" id="save-search" style="margin-right:10px;">' + '<input type="button" class="secondary_button_flat" value="Cancel" id="cancel-save-search" style="margin-right:10px;"></div>' + "</form></div>",
    showErrorMessage: function (msg) {
        $("#save-search-errorMessage .errMsg").html(msg);
        $("#save-search-errorMessage").show();
    },
    runSaveSearchFormValidation: function () {
        if ($("#save-name").val() === "") {
            this.showErrorMessage("Please enter a name for the save search.");
            return false;
        }
        return true;
    },
    savedSearchList: {},
    init: function () {
        this.setupContainer();
        this.setupListEvents();
        this.getAllSavedSearches();
        this.getModalScript();
        iv.hub.subscribeToEvent("DO_SAVE_SEARCH", this.showSaveSearchForm, this);
        iv.hub;
    },
    setupListEvents: function () {
        var $this = this;
        this.listContainer.delegate(".savedSearchDelete", "click", function () {
            var id = $(this).attr("id").split("_")[1];
            $(this).parent().hide();
            $this.doDelete(id);
            return false;
        });
        this.listContainer.delegate(".savedSearchItem", "click", function () {
            if (iv.user.data.license === 0) {
                iv.stopPoint.show("listBuildingCompany");
                return false;
            }
            var target = $(this);
            targetId = target.attr("id").split("_")[1];
            $this.listContainer.find(".ssContainer").removeClass("selectedSavedSearch");
            target.parent().addClass("selectedSavedSearch");
            $this.triggerSaveSearch($this.savedSearchList[targetId]);
            return false;
        });
    },
    currentSaveSearch: null,
    hasSaveSearchContext: function () {
        if (this.currentSaveSearch === null) {
            return false;
        }
        return true;
    },
    triggerSaveSearch: function (saveSearchObject) {
        this.currentSaveSearch = saveSearchObject;
        iv.hub.publishEvent("SET_SAVESEARCH_CONTEXT", this.currentSaveSearch);
        var url = saveSearchObject.criteria();
        var query = iv.util.getURLParams(url);
        if (typeof query.q !== "undefined") {
            query.q = iv.lists.urlHasher.getShortValue(query.q);
        }
        var queryString = iv.util.convertToQueryString(query);
        var screenPath = url.split("?")[0];
        iv.hub.publishEvent("CHANGE_URL", {
            queryString: queryString,
            path: screenPath
        });
    },
    doDelete: function (id) {
        var $this = this;
        iv.api.getJson({
            resource: this.config.urls.DELETE_SAVED_SEARCH,
            urlParams: {
                "id": id
            },
            success: function (resp) {
                if (typeof resp.error !== "undefined") {
                    if (resp.error) {
                        $this.unableToDeleteRow(resp);
                    } else {
                        $this.removeDeletedRow(id);
                    }
                }
            },
            error: function (resp) {
                $this.unableToDeleteRow(resp);
            }
        });
    },
    unableToDeleteRow: function () {
        $("#" + id).show();
    },
    removeDeletedRow: function (id) {
        this.removeSaveSearchItem(id);
        $("#" + id).remove();
    },
    setupContainer: function () {
        if ($("#savedSearchList").length === 0) {
            $("#sideBar #ivSetup").after('<div id="savedSearchList" class="float_left" style="width:100%; padding: 0;"></div>');
        }
        this.listContainer = $("#savedSearchList");
    },
    getAllSavedSearches: function () {
        var $this = this;
        iv.api.getJson({
            resource: this.config.urls.GET_SAVED_SEARCHES,
            urlParams: {},
            success: function (resp) {
                if (typeof resp.error !== "undefined") {
                    if (resp.error) {
                        $this.unableToLoadSavedSearchList(resp);
                    } else {
                        $this.processSavedSearchList(resp.data);
                    }
                }
            },
            error: function (resp) {
                $this.unableToLoadSavedSearchList(resp);
            }
        });
    },
    listContainer: null,
    updateSavedSearchList: function (objHtml) {
        var h = '<div class="padded_4px"></div><div class="sideBarTitle">Saved Searches</div>' + '<img src="/iv/common/styles/images/sidebar-header-tip.png" style="margin-top:-1px;position:absolute;">' + '<div class="padded_8px"></div>' + objHtml;
        this.listContainer.html(h);
    },
    hasSaveSearches: false,
    processSavedSearchList: function (data) {
        if (data.length > 0) {
            var $this = this,
                h = "";
            _.each(data, function (d) {
                $this.savedSearchList[d.id] = $this.getSavedSearchObject(d);
                h += $this.savedSearchList[d.id].getViewHtml();
            });
            this.hasSaveSearches = true;
            this.updateSavedSearchList(h);
        }
    },
    removeSaveSearchItem: function (id) {
        delete this.savedSearchList[id];
        if (_.size(this.savedSearchList) <= 0) {
            this.hasSaveSearches = false;
            this.listContainer.html("");
        }
        if (this.currentSaveSearch.getId() === parseInt(id)) {
            this.currentSaveSearch = null;
            iv.hub.publishEvent("REMOVE_SAVESEARCH_CONTEXT", {});
        }
    },
    updateSaveSearchItem: function (id, name, criteria) {
        this.savedSearchList[id].setName(name);
        this.savedSearchList[id].setCriteria(criteria);
        var targetEle = $("#" + id).find(".savedSearchItem");
        targetEle.html(name);
        targetEle.attr("href", this.savedSearchList[id].criteria());
    },
    addNewSaveSearchItem: function (obj) {
        this.savedSearchList[obj.id] = this.getSavedSearchObject(obj);
        if (this.hasSaveSearches) {
            this.listContainer.append(this.savedSearchList[obj.id].getViewHtml());
        } else {
            this.updateSavedSearchList(this.savedSearchList[obj.id].getViewHtml());
            this.hasSaveSearches = true;
        }
    },
    unableToLoadSavedSearchList: function () {},
    getSavedSearchObject: function (data) {
        var savedSearch = function (data) {
            var id = data.id;
            var criteria = data.criteria;
            var name = data.name;
            var criteriaLink = "loadListBuildPage.iv?" + criteria;
            this.getName = function () {
                return name;
            };
            this.getId = function () {
                return id;
            };
            this.getTrimmedName = function () {
                var trimmedName = this.getName();
                if (trimmedName.length > 20) {
                    trimmedName = trimmedName.substr(0, 20) + "...";
                }
                return trimmedName;
            };
            this.criteria = function () {
                return criteriaLink;
            };
            this.setCriteria = function (crit) {
                criteria = crit;
                criteriaLink = "loadListBuildPage.iv?" + criteria;
            };
            this.setName = function (n) {
                name = n;
            };
            this.getViewHtml = function () {
                var template = '<div id="<%=id%>" class="ssContainer"><a href="#/<%=link%>" id="ss_<%=id%>" class="savedSearchItem" title="<%=name%>"><%=trimmedName%></a>' + '<a href="#" id="del_<%=id%>" class="savedSearchDelete" >X</a></div>';
                var h = _.template(template, {
                    "id": id,
                    "link": criteriaLink,
                    "name": name,
                    "trimmedName": this.getTrimmedName()
                });
                return h;
            };
        };
        return new savedSearch(data);
    },
    modalScriptAvailable: false,
    getModalScript: function (cb) {
        var initCB = function () {
            $this.modalScriptAvailable = true;
            if (typeof cb !== "undefined") {
                cb();
            }
        };
        if (this.modalScriptAvailable) {
            if (typeof cb !== "undefined") {
                cb();
            }
        } else {
            var $this = this;
            require([iv.ui.getTemplate("commonRequires.modal")], initCB);
        }
    },
    getModalHtml: function () {
        return _.template(this.saveSearchTemplate, {
            summaryHtml: this.currentSummaryHtml
        });
    },
    currentSummaryObject: null,
    currentSummaryHtml: "",
    currentCriteria: {},
    getCriteriaQuery: function () {
        var searchQueryParam = JSON.stringify(this.currentCriteria.q);
        var qObj = {
            vs: encodeURIComponent(this.currentCriteria["vs"]),
            q: encodeURIComponent(searchQueryParam)
        };
        return (iv.util.convertToQueryString(qObj));
    },
    showSaveSearchForm: function (ev) {
        this.currentSummaryHtml = ev.eventData.summaryHtml;
        this.currentSummaryObject = ev.eventData.summaryObj;
        this.currentCriteria = ev.eventData.criteria;
        var $this = this;
        this.getModalScript(function () {
            $this.showSaveSearchModal();
        });
    },
    saveInProgress: false,
    doSaveSearchOperation: function () {
        if ($(".saveSearchForm input#save-search").hasClass("disabled")) {
            return false;
        }
        if (this.saveInProgress) {
            return false;
        }
        if (!this.runSaveSearchFormValidation()) {
            return false;
        }
        $("#save-search-errorMessage").hide();
        var type = "save";
        var id = $("#save-search-id").val();
        if (id !== "") {
            type = "update";
        }
        var searchName = $("#save-name").val();
        var searchCriteria = $("#save-criteria").val();
        var overwriteSavedSearch = this.isOverwriteSavedSearch(searchName);
        if (type == "update" && this.currentSaveSearch != null && searchName.toLowerCase() !== this.currentSaveSearch.getName().toLowerCase()) {
            if (overwriteSavedSearch != null) {
                $("#save-search-form").attr("action", this.config.urls.UPDATE_SAVED_SEARCH);
                $("#save-search-id").val(overwriteSavedSearch.getId());
                $("#save-name").val(searchName);
                type = "update";
                if ($("#save-search-form #save-search").val() != "Yes") {
                    this.showOverwriteState();
                    return;
                }
            } else {
                $("#save-search-form").attr("action", this.config.urls.ADD_SAVED_SEARCH);
                $("#save-search-id").val("");
                type = "save";
            }
        } else {
            if (type == "save" && overwriteSavedSearch != null) {
                $("#save-search-form").attr("action", this.config.urls.UPDATE_SAVED_SEARCH);
                $("#save-search-id").val(overwriteSavedSearch.getId());
                $("#save-name").val(searchName);
                type = "update";
                if ($("#save-search-form #save-search").val() != "Yes") {
                    this.showOverwriteState();
                    return;
                }
            }
        }
        if (type == "update" && this.currentSaveSearch != null && searchName.toLowerCase() == this.currentSaveSearch.getName().toLowerCase()) {
            $("#save-search-id").val(this.currentSaveSearch.getId());
        }
        var $this = this;
        $this.saveInProgress = true;
        iv.api.submitForm({
            form: $("#save-search-form"),
            success: function (data) {
                $this.saveInProgress = false;
                if (type === "save") {
                    $this.saveSearchOperationCallback(data);
                } else {
                    if (type === "update") {
                        $this.updateSaveSearchOperationCallback(data, {
                            name: searchName,
                            criteria: searchCriteria
                        });
                    }
                }
                return false;
            }
        });
        $("#save-name").attr("disabled", "true");
        $("#saveSearchButton").attr("disabled", "true");
    },
    isOverwriteSavedSearch: function (name) {
        name = $.trim(name);
        for (var i in this.savedSearchList) {
            var savedSearch = this.savedSearchList[i];
            var name1 = name.toLowerCase();
            var name2 = savedSearch.getName().toLowerCase();
            if (name1 == name2) {
                return savedSearch;
            }
        }
        return null;
    },
    showOverwriteState: function () {
        var form = $(".saveSearchForm");
        form.find(".fieldContainer").hide();
        form.find(".summmary").hide();
        form.find("#overwrite-message").show();
        form.find("#save-search").val("Yes");
        form.find("#cancel-save-search").val("No");
    },
    hideOverWriteState: function () {
        var form = $(".saveSearchForm");
        form.find("#overwrite-message").hide();
        form.find(".fieldContainer").show();
        form.find(".summmary").show();
        form.find("#save-search-id").val("");
        form.find("#save-search").val("Save");
        form.find("#cancel-save-search").val("Cancel");
    },
    updateSaveSearchOperationCallback: function (data, persistedData) {
        var respObj = JSON.parse(data.responseText);
        if (respObj.error) {
            this.saveSearchErrorResponse(respObj);
            return false;
        }
        this.updateSaveSearchItem(respObj.data.updatedId, persistedData.name, persistedData.criteria);
        iv.modal.closeModalBox();
    },
    saveSearchOperationCallback: function (data) {
        var respObj = JSON.parse(data.responseText);
        if (respObj.error) {
            this.saveSearchErrorResponse(respObj);
            return false;
        }
        this.addNewSaveSearchItem(respObj.data);
        iv.modal.closeModalBox();
    },
    saveSearchErrorResponse: function (resp) {
        $("#save-name").attr("disabled", "");
        $("#saveSearchButton").attr("disabled", "");
        this.showErrorMessage(resp.errorMessage);
    },
    initSaveSearchModal: function () {
        var ref = this;
        $("#save-criteria").val(this.getCriteriaQuery());
        $("#cancel-save-search").click(function () {
            var val = $(this).val();
            if (val == "No") {
                ref.hideOverWriteState();
            } else {
                iv.modal.closeModalBox();
            }
        });
        if (this.hasSaveSearchContext()) {
            $("#save-name").val(this.currentSaveSearch.getName());
            $("#save-search-id").val(this.currentSaveSearch.getId());
            $("#save-search-form").attr("action", this.config.urls.UPDATE_SAVED_SEARCH);
        } else {
            $("#save-search-form").attr("action", this.config.urls.ADD_SAVED_SEARCH);
        }
        var control = $("input#save-search");
        control.addClass("disabled");
        $(".saveSearchForm input[type=text]").bind("keyup blur focus", function () {
            var $this = $(this);
            var val = $.trim($this.val());
            var placeholder = $.trim($this.attr("placeholder"));
            control.removeClass("disabled");
            if (val == "" || val == placeholder) {
                control.removeClass("disabled").addClass("disabled");
            }
        });
        $(".saveSearchForm .undoPeople").remove();
        $(".saveSearchForm .undoCompanies").remove();
        $(".saveSearchForm .removeCountCompanies").html(iv.lists.savedSearch.currentCriteria.q.compExcluded.length);
        $(".saveSearchForm .removeCountCompanies").css("margin-right", "5px");
        $(".saveSearchForm .removeCountPeople").html(iv.lists.savedSearch.currentCriteria.q.excludedEmpIds.length);
        $(".saveSearchForm .removeCountPeople").css("margin-right", "5px");
    },
    showSaveSearchModal: function () {
        var $this = this;
        iv.modal.init({
            content: this.getModalHtml(),
            events: {
                render: function (event, api) {
                    $this.initSaveSearchModal($this.currentSummaryObject);
                },
                visible: function () {
                    $("#save-name").focus();
                }
            }
        });
    }
};
registerNS("iv.lists.urlHasher");
iv.lists.urlHasher = {
    storage: {},
    charLimit: 700,
    counter: (new Date()).getTime(),
    prefix: "~LIST~",
    getShortValue: function (value) {
        if (value.length > this.charLimit) {
            return this.setValue(value);
        }
        return value;
    },
    isShortenedUrl: function (value) {
        var a = value.split("_");
        if (a[0] === this.prefix) {
            return true;
        }
        return false;
    },
    isValudShortenedUrl: function (value) {
        if (this.isShortenedUrl(value)) {
            if (this.checkHash(value)) {
                return true;
            }
        }
        return false;
    },
    getUrlValue: function (value) {
        var a = value.split("_");
        if (a[0] === this.prefix) {
            if (this.checkHash(value)) {
                return this.getValue(value);
            } else {
                return value;
            }
        }
        return value;
    },
    setValue: function (value) {
        var hash = this.prefix + "_" + this.counter++;
        this.storage[hash] = value;
        return hash;
    },
    checkHash: function (key) {
        if (typeof this.storage[key] !== "undefined") {
            return true;
        }
        return false;
    },
    getValue: function (key) {
        return this.storage[key];
    }
};
