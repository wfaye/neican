registerNS("iv.globalSearch");
iv.globalSearch = {
	init : function() {
		if (typeof globalSearchConfig !== "undefined"
				&& globalSearchConfig.globalResultsPage) {
			this.fetchSearchResults(globalSearchConfig.resources);
		} else {
			if ($("#company_results_table").length > 0) {
				this.setCompanyFollowButtons();
			} else {
				if ($("#people_results_table").length > 0) {
					this.setExecFollowButtons();
				}
			}
		}
	},
	setCompanyFollowButtons : function() {
		_
				.each(
						$("#company_results_table .rows"),
						function(row) {
							var col = $(row).find(".data")[1];
							$(col)
									.append(
											'<div class="follow"><div class="followButtonDiv"></div></div>');
							$(col).height($(row).height());
						});
		var followMap = [];
		_.each($("#company_results_table .rows a.comp_name_class"), function(
				element) {
			var currentId = $(element).attr("name");
			var parameters = currentId.split("_");
			var config = {
				followType : "inline",
				entityType : "company",
				watchlistInfo : iv.user.data.genericWatchlistInfo,
				companyId : parameters[1],
				trackedByWatchlists : iv.util
						.getCompanyTrackedByWatchlist(parameters[1])
			};
			followMap.push({
				"selector" : $(element).parents(".rows").find(
						".followButtonDiv"),
				"config" : config
			});
		});
		iv.follow.manager.createWidgets(followMap);
		$(".follow").parent(".data").addClass("followSet");
		if ($.browser.msie && $.browser.version <= 7) {
			_.each($("#company_results_table .rows"), function(row) {
				var zIndex = $(row).find(".follow .menu").css("z-index");
				$(row).css("z-index", zIndex);
			});
		}
	},
	setExecFollowButtons : function() {
		_
				.each(
						$("#people_results_table .rows"),
						function(row) {
							var col = $(row).find(".data")[1];
							$(col)
									.append(
											'<div class="follow"><div class="followButtonDiv"></div></div>');
							$(col).height($(row).height());
						});
		var followMap = [];
		_.each($("#people_results_table .rows .title"), function(element) {
			var currentId = $(element).attr("id");
			var parameters = currentId.split("_");
			var config = {
				followType : "inline",
				entityType : "person",
				watchlistInfo : iv.user.data.genericWatchlistInfo,
				executiveId : parameters[0],
				employmentId : parameters[1],
				trackedByWatchlists : iv.util
						.getExecTrackedByWatchlist(parameters[0])
			};
			followMap.push({
				"selector" : $(element).parents(".rows").find(
						".followButtonDiv"),
				"config" : config
			});
		});
		iv.follow.manager.createWidgets(followMap);
		$(".follow").parent(".data").addClass("followSet");
		if ($.browser.msie && $.browser.version <= 7) {
			_.each($("#people_results_table .rows"), function(row) {
				var zIndex = $(row).find(".follow .menu").css("z-index");
				$(row).css("z-index", zIndex);
			});
		}
	},
	fetchSearchResults : function(data) {
		_.each(data, function(value, key, list) {
			if (key === "company") {
				iv.api.getHtmlContent({
					target : $("#company_results"),
					success : function() {
						iv.globalSearch.setCompanyFollowButtons();
					},
					resource : value
				});
			} else {
				if (key === "contact") {
					iv.api.getHtmlContent({
						target : $("#people_results"),
						success : function() {
							iv.globalSearch.setExecFollowButtons();
						},
						resource : value
					});
				} else {
					if (key === "news") {
						iv.api.getHtmlContent({
							target : $("#news_results"),
							success : function() {
							},
							resource : value
						});
					}
				}
			}
		});
	},
	showSuggestion : function(html) {
		$(".suggest").html(html);
	}
};
iv.processOnDomReady(function() {
	iv.globalSearch.init();
});
function showSpinner() {
	var a = document.getElementById("rotator");
	if (hs.onClickCounter == 5) {
		a.style.display = "inline";
	}
	if (hs.onClickCounter > 5) {
		a.style.display = "none";
	}
	return;
}
function submitform(searchString) {
	document.forms.showPageForm.searchString.value = searchString;
	document.forms.showPageForm.submit();
}
function addJigsawCompany(jigsawCompId) {
	document.getElementById("rotator_" + jigsawCompId).style.display = "inline";
}
registerNS("iv.follow.manager");
iv.follow.manager = {
	processItems : function(list) {
		var $this = this;
		_.each(list, function(item) {
			$this.createFollowWidgetItem(item.selector, item.config);
		});
	},
	createWidgets : function(list) {
		this.processItems(list);
		iv.initMenus();
	},
	createFollowWidgetItem : function(selector, config) {
		var elem = $(selector);
		elem.setupFollow(config);
	}
};
(function($) {
	var ivFollow = function(elem, options) {
		this.followContainer = elem;
		this.clickedElem = null;
		this.isActionActive = false;
		this.uid = options.uid;
		this.followId = options.followId;
		this.config = {
			entityType : "company",
			followType : "inline",
			trackedByWatchlists : [],
			urls : {
				"follow" : "/iv/followEntityInWatchlist.iv",
				"unfollow" : "/iv/unfollowEntityFromWatchlist.iv"
			},
			/*menuHeaderTemplate : '<div id="add_<~%=current%~>"> <ul class="menu follow-menu '
					+ "<~% if(trackedByWatchlists.length != 0) { %~>"
					+ "following-type-<~%=followType%~> "
					+ "<~% } else { %~>"
					+ "follow-type-<~%=followType%~> "
					+ "<~% } %~>"
					+ ' ieOverride" id="wlAddMenu_<~%=uid%~>">'
					+ "<li>"
					+ "<~% if(trackedByWatchlists.length != 0) { %~>"
					+ '<a class="<~% if(followType == "inline"){%~> hover-button<~% } %~>" href="javascript:void(0);">'
					+ '<div title="Add <~%=entityType%~> to your Watchlist" class="following-<~%=followType%~>-<~%=entityType%~>">'
					+ '<div class="new-follow-sprite followingSymbol"></div>'
					+ '<span class="textHook float_left">Following</span>'
					+ '<span class="new-follow-sprite track-arw-<~%=followType%~>"></span> '
					+ "<~% } else { %~>"
					+ ' <a class="<~% if(followType == "inline"){%~> hover-button<~% } %~>" href="javascript:void(0);">'
					+ '<div title="Add <~%=entityType%~> to your Watchlist" class="follow-<~%=followType%~>-<~%=entityType%~>">'
					+ '<div class="new-follow-sprite followSymbol"></div>'
					+ '<span class="textHook float_left">Follow</span> '
					+ '<span class="new-follow-sprite float_left track-arw-<~%=followType%~>"></span> '
					+ "<~% } %~>"
					+ "</div>"
					+ '<div style="clear: both; height: 0px; width: 0px;"></div></a>',
			menuBodyTemplate : "<ul>"
					+ "<~%_.each(watchlistInfo , function(wlObj){%~>"
					+ '<li style="clear:both;">'
					+ '<~% if(wlObj["type"] == 2) { %~>'
					+ '<~% if($.inArray(wlObj["id"],trackedByWatchlists) > -1 || $.inArray(wlObj["id"],trackedByWatchlists) != -1) { %~>'
					+ '<a class="following-<~%=entityType%~>-freq following-entity freq-viewed-wl" id="<~%=wlObj["id"]%~>" rel="<~%=wlObj["id"]%~>"><img src="<~%=iv.util.getThemedImageUrl(\'checked2\')%~>" height="16" width="16" align="absmiddle" style="visibility:visible"/>&nbsp;'
					+ '<span><~%=wlObj["name"]%~></span></a>'
					+ "<~%}else{%~>"
					+ '<span class="dynamic follow" title="Frequently Viewed Watchlist - cannot add '
					+ " <~% entityType == \"company\" ? 'companies' : 'people'; %~>"
					+ ' manually."><img width="16" height="16" align="absmiddle" style="visibility:hidden;"  src="<~%=iv.util.getThemedImageUrl(\'checked2\')%~>">Frequently Viewed</span>'
					+ "<~%}%~>"
					+ '<~%}else if(wlObj["type"] == 0){%~>'
					+ '<~% if($.inArray(wlObj["id"],trackedByWatchlists) > -1 || $.inArray(wlObj["id"],trackedByWatchlists) != -1) { %~>'
					+ '<a rel="<~%=wlObj["id"]%~>" href="javascript:void(0);" class="following-entity">'
					+ '<img src="<~%=iv.util.getThemedImageUrl(\'checked2\')%~>" height="16" width="16" align="absmiddle"/>&nbsp;'
					+ "<~%}else{%~>"
					+ '<a rel="<~%=wlObj["id"]%~>" href="javascript:void(0);" class="follow-entity">'
					+ '<img src="<~%=iv.util.getThemedImageUrl(\'checked2\')%~>" height="16" width="16" align="absmiddle" style="visibility:hidden"/>&nbsp;'
					+ "<~%}%~>"
					+ '<~% if(wlObj["name"].length > 17){ wlObj["name"] = wlObj["name"].substring(0,14) + "..."; %~>'
					+ "<~%}%~>"
					+ '<span><~%=wlObj["name"]%~></span></a>'
					+ '<~%}else if(wlObj["type"] == 1){%~>'
					+ '<span class="dynamic follow" title="Automated Watchlist - cannot add '
					+ "<~% entityType == \"company\" ? 'companies' : 'people'; %~> manually.\">"
					+ '<img src="<~%=iv.util.getThemedImageUrl(\'checked2\')%~>" height="16" width="16" align="absmiddle" '
					+ '<~% if($.inArray(wlObj["id"],trackedByWatchlists) == -1) { %~>'
					+ 'style="visibility:hidden"'
					+ "<~%}%~>  />&nbsp;"
					+ '<img align="absmiddle" src="<~%=iv.ui.getTemplate(\'versionedImages.SalesforceLogo\')%~>" style="width:16px;height:16px;padding-right:5px;"/>'
					+ '<~% if(wlObj["name"].length > 17){ wlObj["name"] = wlObj["name"].substring(0,14) + "..."; %~>'
					+ "<~%}%~>"
					+ '<~%=wlObj["name"]%~></span></li>'
					+ "<~%}});%~>"
					+ "<~% if(dynamicCreateWL != false) { %~>"
					+ '<li class="createAutomatedWL">'
					+ '<~% if(dynamicCreateWL == "enabled") { %~>'
					+ '<a href="/iv/watchlist.iv?dynamicWatchlistEnabled=true&newSFDCWatchList=true" target="insideview">'
					+ "<span>Create Automated Watchlist</span></a>"
					+ "<~%} else {%~>"
					+ '<span class="dynamic">Create Automated Watchlist</span>'
					+ "<~%}%~>" + "</li>" + "<~%}%~>" + "</ul></li></ul></div>"*/
		};
		if (typeof options != "undefined") {
			$.extend(true, this.config, options);
		}
		if (this.config.entityType == "company") {
			this.entityParams = {
				type : "company",
				companyId : this.config.companyId
			};
			this.config.currentId = this.config.companyId;
		} else {
			if (this.config.entityType == "person") {
				this.entityParams = {
					type : "person",
					employmentId : this.config.employmentId,
					executiveId : this.config.executiveId
				};
				this.config.currentId = this.config.executiveId;
			}
		}
		this.showFollowMenu();
		this.attachDelegates();
	};
	ivFollow.prototype.showFollowMenu = function() {
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
		_.each(this.config.trackedByWatchlists, function(watchlistId) {
			if (watchlistId != "") {
				trackedByWatchlists.push(parseInt(watchlistId));
			}
		});
		this.config.trackedByWatchlists = trackedByWatchlists;
		html += _.template(this.config.menuHeaderTemplate, {
			trackedByWatchlists : this.config.trackedByWatchlists,
			followType : this.config.followType,
			current : this.config.currentId,
			entityType : this.config.entityType,
			uid : this.uid
		});
		var html2 = _.template(this.config.menuBodyTemplate, {
			trackedByWatchlists : this.config.trackedByWatchlists,
			watchlistInfo : this.config.watchlistInfo,
			followType : this.config.followType,
			current : this.config.currentId,
			entityType : this.config.entityType,
			dynamicCreateWL : dynamicCreateWL
		});
		this.followContainer.html(html + html2);
	};
	ivFollow.prototype.attachDelegates = function() {
		var $this = this;
		if ($("body").hasClass("follow-entity-init")) {
			return;
		}
		$("body").delegate(
				"a",
				"click",
				function() {
					var target = $(this);
					if (!target.hasClass("follow-entity")
							&& !target.hasClass("following-entity")) {
						return;
					}
					var targEntity = iv.user.followMetaData[target.parents(
							".follow-menu").attr("id").split("_")[1]];
					if (target.hasClass("follow-entity")
							&& !targEntity.isActionActive) {
						targEntity.isActionActive = true;
						target.css("opacity", "0.5");
						var wId = target.attr("rel");
						targEntity.clickedElem = target.find("span");
						target.removeClass("follow-entity").addClass(
								"following-entity");
						$.extend(targEntity.entityParams, {
							watchlistId : wId
						});
						targEntity.followAction("follow");
					} else {
						if (target.hasClass("following-entity")
								&& !targEntity.isActionActive) {
							targEntity.isActionActive = true;
							target.css("opacity", "0.5");
							var wId = target.attr("rel");
							targEntity.clickedElem = target.find("span");
							$.extend(targEntity.entityParams, {
								watchlistId : wId
							});
							if (target.hasClass("following-"
									+ targEntity.config.entityType + "-freq")) {
								target.removeClass(
										"following-" + $this.config.entityType
												+ "-freq")
										.css("opacity", "0.5");
								target.css("cursor", "normal");
								target.removeClass("following-entity");
							} else {
								target.removeClass("following-entity")
										.addClass("follow-entity");
							}
							targEntity.followAction("unfollow");
						}
					}
				});
		$("body").addClass("follow-entity-init");
	};
	ivFollow.prototype.actionCallback = function(resp) {
		this.isActionActive = false;
		if (resp.error == false) {
			iv.hub.publishEvent("REFRESH_SETUP", "followCompanies");
			var menuId = "wlAddMenu_" + this.uid;
			var spanText = $("#" + menuId).find(".textHook");
			if ($(this.clickedElem).parent("a").find("img").css("visibility") == "hidden") {
				$(this.clickedElem).parent("a").find("img").css("visibility",
						"visible");
				$(this.clickedElem).parent("a").css("opacity", "1");
				this.config.trackedByWatchlists.splice(0, 0,
						this.entityParams.watchlistId);
				var watchlistId = $(this.clickedElem).parent("a").attr("rel");
				if (this.config.entityType == "company") {
					iv.user.data.genericWatchlistInfo[watchlistId]["companies"]
							.push(this.followId);
				} else {
					iv.user.data.genericWatchlistInfo[watchlistId]["executives"]
							.push(this.followId);
				}
				if (spanText.text() == "Follow") {
					$("#" + menuId).removeClass(
							"follow-type-" + this.config.followType).addClass(
							"following-type-" + this.config.followType);
					spanText.text("Following");
					$("#" + menuId).find("div.new-follow-sprite").removeClass(
							"followSymbol").addClass("followingSymbol");
					spanText.parent("div").removeClass(
							"follow-" + this.config.followType + "-"
									+ this.config.entityType).addClass(
							"following-" + this.config.followType + "-"
									+ this.config.entityType);
				}
			} else {
				$(this.clickedElem).parent("a").find("img").css("visibility",
						"hidden");
				if ($(this.clickedElem).parent("a").hasClass("freq-viewed-wl")) {
					$(this.clickedElem).parent("a").css("opacity", "0.5");
				} else {
					$(this.clickedElem).parent("a").css("opacity", "1");
				}
				var index = $.inArray(this.entityParams.watchlistId,
						this.config.trackedByWatchlists);
				this.config.trackedByWatchlists.splice(index, 1);
				var watchlistId = $(this.clickedElem).parent("a").attr("rel");
				if (this.config.entityType == "company") {
					iv.user.data.genericWatchlistInfo[watchlistId]["companies"] = _
							.without(
									iv.user.data.genericWatchlistInfo[watchlistId]["companies"],
									this.followId);
				} else {
					iv.user.data.genericWatchlistInfo[watchlistId]["executives"] = _
							.without(
									iv.user.data.genericWatchlistInfo[watchlistId]["executives"],
									this.followId);
				}
				if (spanText.text() == "Following"
						&& this.config.trackedByWatchlists.length == 0) {
					$("#" + menuId).removeClass(
							"following-type-" + this.config.followType)
							.addClass("follow-type-" + this.config.followType);
					spanText.text("Follow");
					$("#" + menuId).find("div.new-follow-sprite").removeClass(
							"followingSymbol").addClass("followSymbol");
					spanText.parent("div").removeClass(
							"following-" + this.config.followType + "-"
									+ this.config.entityType).addClass(
							"follow-" + this.config.followType + "-"
									+ this.config.entityType);
				}
			}
		} else {
			if (resp.error == true) {
				this.isActionActive = false;
				if ($(this.clickedElem).parent("a")
						.hasClass("following-entity")) {
					$(this.clickedElem).parent("a").removeClass(
							"following-entity").addClass("follow-entity");
				} else {
					$(this.clickedElem).parent("a")
							.removeClass("follow-entity").addClass(
									"following-entity");
				}
				$(this.clickedElem).parent("a").css("opacity", "1");
				if (resp.errorType = "WatchlistLimitError") {
					iv.stopPoint.show("addRecordsToWatchlist");
				}
			}
		}
	};
	ivFollow.prototype.followAction = function(followtype) {
		var $this = this;
		iv.api.userAction.getJson({
			resource : this.config.urls[followtype],
			urlParams : this.entityParams,
			success : function(resp) {
				$this.actionCallback(resp);
			},
			error : function(resp) {
				$this.actionCallback(resp);
			}
		});
	};
	$.fn.setupFollow = function(options) {
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
registerNS("iv.partnersCompany");
iv.partnersCompany = {
	data : null,
	jigsawGrid : false,
	corteraGrid : false,
	initLoad : function(data) {
		this.data = data;
		if (this.data.onLoad) {
			var html = _
					.template(
							iv.ui
									.getTemplate("addCompany.searchCompanyPartnerTemplate"),
							{});
			$("#results-inside-view").after(html);
			$("#togglePartners").bind("click",
					iv.partnersCompany.toggleCompanyPartnerResults);
			if (this.data.isMashup) {
			}
		} else {
			this.fetchCorteraMatchResult();
		}
	},
	toggleCompanyPartnerResults : function() {
		if ($("#partners-text").css("display") == "none") {
			$("#togglePartners img").attr("src",
					$("#togglePartners img").attr("src").replace("_1", "_0"));
			$("#partners-text").show();
			$("#partners-header").hide();
			$("#partner-results").css({
				"border-bottom" : "1px solid #ccc",
				"padding-bottom" : "10px"
			});
			iv.generateCompany.hideGenerateCompanyBox();
		} else {
			$("#togglePartners img").attr("src",
					$("#togglePartners img").attr("src").replace("_0", "_1"));
			$("#partners-text").hide();
			$("#partners-header").show();
			iv.partnersCompany.fetchCorteraMatchResult(iv.partnersCompany.data);
		}
	},
	fetchCorteraMatchResult : function() {
		$("#partner-results").css({
			"border" : "none",
			"padding-bottom" : "0px"
		});
		if (!this.corteraGrid) {
			this.corteraGrid = true;
			var html = _.template(iv.ui
					.getTemplate("addCompany.partnerResultHeader"), {});
			$("#partners-header").html(html);
			iv.api.userAction.getJson({
				resource : "/iv/searchCortera.do",
				success : iv.partnersCompany.corteraResultsCallBack,
				error : iv.partnersCompany.errorHandle,
				urlParams : {
					call : "searchCompany",
					companyName : this.data.companyName
				}
			});
			if (this.data.searchPage) {
				$("#corteraSummary").css({
					"font-size" : "12px",
					"font-weight" : "bold"
				});
			}
		} else {
			$("#partners-header").show();
			$("#results-cortera").show();
		}
		iv.generateCompany.createGenerateCompanyBox();
	},
	corteraResultsCallBack : function(resp) {
		var data = [];
		data = resp.data;
		$("#partner-results").css({
			"border" : "none",
			"padding-bottom" : "0px"
		});
		var resultTxt = "";
		if (data.totalHits == 1) {
			resultTxt = "1 Result";
		} else {
			if (data.totalHits > 1) {
				resultTxt = data.totalHits + " Results";
			} else {
				resultTxt = "<span>0 Results</span>";
			}
		}
		$("#corteraResultText").html(resultTxt);
		if (iv.partnersCompany.data.searchPage) {
			$("#corteraCount").html("(" + data.totalHits + ")");
		}
		$("#npset").html('<div id="results-cortera"></div>');
		iv.partnersCompany.setupCorteraGrid(data);
	},
	errorHandle : function(resp) {
		if (typeof resp.errorMessage != "") {
			var html = '<div class="yellowbox" style="display:block"><span class="common_sprites error_ticker"></span><span style="font-weight:bold;">'
					+ resp.errorMessage + "</span></div>";
			$("#corteraResultSet").before(html);
		}
	},
	setupCorteraGrid : function(data) {
		var columns = [];
		columns[columns.length] = {
			name : "companyName",
			displayName : "Name",
			widthInPercent : 27,
			sortable : false,
			template : '<a class="bluefont" '
					+ ((typeof this.data.isMashup != "undefined" && this.data.isMashup) ? 'href="/iv/searchCortera.do?call=addCompanyFromMashup&corteraCompanyId=<~%=vendorId%~>'
							+ "&crm_account_id="
							+ this.data.crm_account_id
							+ "&crm_lead_id="
							+ this.data.crm_lead_id
							+ "&crm_object_id="
							+ this.data.crm_object_id
							+ "&crm_context="
							+ this.data.crm_context
							+ "&crm_account_name="
							+ this.data.crm_account_name
							+ '"'
							: 'href="/iv/searchCortera.do?call=addCompany&corteraCompanyId=<~%=vendorId%~>" ')
					+ "><~%=name%~></a>"
		};
		columns[columns.length] = {
			name : "address",
			displayName : "Location",
			widthInPercent : 31,
			defaultValue : "&nbsp;",
			sortable : false,
			template : "<~%=address%~>"
		};
		columns[columns.length] = {
			name : "revenue",
			displayName : iv.ui.getTemplate("localizedLabels.revenue"),
			widthInPercent : 25,
			defaultValue : "&nbsp;",
			sortable : false,
			template : "<~%=revenue%~>"
		};
		columns[columns.length] = {
			name : "employees",
			displayName : "Employees",
			widthInPercent : 13,
			defaultValue : "&nbsp;",
			sortable : false,
			template : "<~%=employeeCount%~>"
		};
		$("#corteraResultSet").setupIvGrid({
			gridType : "static",
			gridClass : "partners",
			colConfig : columns,
			filter : false,
			pager : {
				resultsPerPage : data.companies.length
			},
			data : data.companies
		});
		$("#corteraResultSet").find(
				".rows-header .not-sortable:last .header-text").css("float",
				"right");
		$("#corteraResultSet").find(".rows-header .not-sortable .header-text ")
				.filter(function(index) {
					return (index + 1) % 3 == 0;
				}).css("float", "right");
		$("#corteraResultSet").find(".rows-header .not-sortable .header-text")
				.filter(function(index) {
					return (index + 1) % 4 == 1;
				}).css("margin-left", "0");
		$("#corteraResultSet").find(".dataSet .rows .data").filter(
				function(index) {
					return (index + 1) % 4 == 0;
				}).css("text-align", "right");
		$("#corteraResultSet").find(".dataSet .rows .data").filter(
				function(index) {
					return (index + 1) % 4 == 3;
				}).css("text-align", "right");
		$("#corteraResultSet").find(".dataSet .rows .data .row-text").filter(
				function(index) {
					return (index + 1) % 4 == 1;
				}).css("padding-left", "0");
		$("#corteraResultSet a.bluefont").click(function(event) {
			var elem = $(this);
			if (elem.hasClass("clicked")) {
				event.stopPropagation();
				return false;
			} else {
				elem.addClass("clicked");
				$("#corteraResultSet a.bluefont").each(function() {
					if ($(this).attr("href") != elem.attr("href")) {
						$(this).attr("href", "javascript:void(0);");
					}
				});
			}
		});
	}
};
iv.processOnDomReady(function() {
	iv.partnersCompany.initLoad(companyMatcherData);
});
(function($) {
	$.fn.roundBox = function(options) {
		return this
				.each(function() {
					var $this = $(this);
					if (typeof options !== "undefined"
							&& typeof options.width !== "undefined"
							&& typeof options.content !== "undefined") {
						var html = "";
						html += '<div class="round-container">';
						html += '	<div class="round-top-right">';
						html += '		<div class="round-top-left">';
						html += '			<div class="round-top-center"></div>';
						html += "		</div>";
						html += "   </div>";
						html += '	<div class="round-container-content">';
						html += options.content;
						html += "   </div>";
						html += '   <div class="round-bottom-right">';
						html += '		<div class="round-bottom-left">';
						html += '			<div class="round-bottom-center"></div>';
						html += "		</div>";
						html += "   </div>";
						html += "</div>";
						$this.append(html);
						$this.find(".round-container").css({
							width : options.width,
							"background-color" : "#F3F3F3"
						});
						$this
								.find(".round-top-right")
								.css(
										{
											background : "url(/iv/common/styles/images/grey-top-right.gif) no-repeat 100% 90%",
											height : "8px"
										});
						$this
								.find(".round-top-left")
								.css(
										{
											background : "url(/iv/common/styles/images/grey-top-left.gif) no-repeat 0% 90%",
											height : "8px"
										});
						$this.find(".round-top-center").css({
							"border-top" : "1px solid #CCC",
							margin : "0 10px"
						});
						$this
								.find(".round-bottom-right")
								.css(
										{
											background : "url(/iv/common/styles/images/grey-bottom-right.gif) no-repeat top right",
											height : "9px"
										});
						$this
								.find(".round-bottom-left")
								.css(
										{
											background : "url(/iv/common/styles/images/grey-bottom-left.gif) no-repeat -1px 0px",
											height : "9px"
										});
						$this.find(".round-bottom-center").css({
							"border-bottom" : "1px solid #CCC",
							margin : "0px 10px 0px 9px",
							"padding-top" : "8px"
						});
						$this.find(".round-container-content").css({
							"border-left" : "1px solid #CCC",
							"border-right" : "1px solid #CCC",
							padding : "0px 10px",
							"margin-right" : "1px"
						});
					}
				});
	};
})(jQuery);
registerNS("iv.generateCompany");
iv.generateCompany = {
	url : "",
	templates : {
		generateBox : '<div class="generate-box">'
				+ '			<div class="gen-prof-main-left">'
				+ '			    <span class="gen_prof_text_red">Not here?</span>'
				+ '				<a class="bluefont show-generate-company-form" style="text-decoration: underline;"  href="#">Add Company</a>'
				+ '				<span class="generate-box-message">Generate a company record to find social media buzz and news.</span>'
				+ "			</div>"
				+ '			<div class="gen-prof-main-right" style="width:240px;" >'
				+ '				<div class="logos">'
				+ '					<div style="float: left; margin-left: 8px;"      >'
				+ '						<span class="twitterLogo"></span>'
				+ '						<span class="newsLogo"></span>'
				+ '						<span class="linkedInLogo2"></span>'
				+ "					</div>"
				+ "				</div>"
				+ '				<input type="button" value="Add Company" class="primary_button_flat right-controls show-generate-company-form" style="float:right;margin-top: 11px;">'
				+ "			</div>" + '			<div style="clear: both;"></div>'
				+ "</div>",
		generateForm : '<div class="header">'
				+ '	<div class="headerText">Generate a new Company for <~%=name%~></div>'
				+ '	<div class="logos">'
				+ '		<div style="float: left; margin-left: 8px;">'
				+ '			<span class="twitterLogo"></span>'
				+ '			<span class="newsLogo"></span>'
				+ '			<span class="linkedInLogo2"></span>'
				+ "		</div>"
				+ "	</div>"
				+ "</div>"
				+ '<div class="description">Complete the following information to find social media buzz and news for this company.</div>'
				+ '<div style="clear:both"></div>'
				+ '<form method="POST" action="/iv/generateCompanyProfile.do" onSubmit="iv.generateCompany.submitForm();return false;">'
				+ '<div class="part-50">'
				+ '	<label>Company: <span class="required reqdField">*</span></label><input name="companyName" type="text" class="text-field" tabindex="1"/><br/>'
				+ '	<label>URL: <span class="required reqdField">*</span></label><input name="website" type="text" class="text-field" tabindex="2"/><br/>'
				+ '	<label>Phone: </label><input name="phone" type="text" class="text-field" tabindex="3"/><br/>'
				+ "</div>"
				+ '<div class="part-50"></div>'
				+ '<div style="clear:both"></div>'
				+ '<div class="address">'
				+ '<label>Address:</label><input name="street" type="text" class="text-field" tabindex="4"/><br/>'
				+ "</div>"
				+ '<div class="part-50">'
				+ '	<label>City:</label><input name="city" type="text" class="text-field" tabindex="5"/><br/>'
				+ '	<label>Zip / Postal: </label><input name="zip" type="text" class="text-field" tabindex="7"/><br/>'
				+ "</div>"
				+ '<div class="part-50 extra-padding">'
				+ '	<div><label>State / Province:</label><input name="state" type="text" class="text-field" tabindex="6"/></div>'
				+ '	<div><label class="country">Country: </label>'
				+ '		<select class="country" name="country" tabindex="8">'
				+ '		<option value="" selected>Choose a country</option>'
				+ "		<~% _.each(countries, function(country) {%~>"
				+ '		<option value="<~%=country.value%~>"><~%=country.label%~></option>'
				+ "		<~% });%~>"
				+ "	</select></div>"
				+ '	<div style="clear:both"></div>'
				+ "</div>"
				+ '<div style="clear:both"></div>'
				+ '<div class="footer"><span class="required reqdField">*</span> Required fields</div>'
				+ "</form>"
				+ '<div class="buttons">'
				+ '	<div style="float:right;"><input type="button" value="Add Company" id="submitGenerateCompany" class="primary_button_flat" tabindex="9"></div>'
				+ '	<div style="float:left;"><input type="button" value="&laquo; Back to results" id="backToCompanyMatches" class="secondary_button_flat" tabindex="10"></div>'
				+ "</div>"
				+ '<div class="white-overlay" id="hide-generate-company" style="display: none;">'
				+ '<center>	<img src="<~%=iv.util.getThemedImageUrl(\'LoadingAnimation\')%~>" class="marginTop"><h1 style="padding-left:0px;">Loading...</h1></center></div>'
	},
	data : {
		isMashup : false
	},
	init : function(config) {
		$.extend(this.data, config, true);
	},
	attachEventHandlers : function() {
	},
	createGenerateCompanyBox : function() {
		$("#generate-company-box").html("");
		$("#generate-company-box").roundBox({
			width : "100%",
			content : this.templates.generateBox,
			background : "#F6F6F6"
		}).show();
		if ($("#generate-company-box").width() < 700) {
			$("#generate-company-box .gen-prof-main-left")
					.css("width", "330px");
		}
		$("#generate-company-box .show-generate-company-form").bind("click",
				function(e) {
					iv.generateCompany.showForm(e);
					iv.util.logUserActivity("Company-Generate-Form-Show");
					return false;
				});
	},
	hideGenerateCompanyBox : function() {
		$("#generate-company-box").hide();
	},
	showForm : function() {
		var form = $("#generate-company-form");
		if (jQuery.trim(form.html()) == "") {
			var companyName = "";
			if (this.data.isMashup) {
				companyName = $("input[name=searchString]").val();
			} else {
				var params = iv.util.getURLParams(window.location.toString());
				companyName = typeof params.gs_searchString != "undefined" ? decodeURIComponent(
						params.gs_searchString).replace("+", " ")
						: "";
			}
			var html = _.template(this.templates.generateForm, {
				name : companyName,
				countries : this.data.countries
			});
			$("#generate-company-form").html(html);
			if (!(typeof this.data.isMashup != "undefined" && this.data.isMashup)) {
				$("#generate-company-form .header").addClass("global-search");
			}
			$("#backToCompanyMatches").live("click", this.hideForm);
			$("#generate-company-form input")
					.keyup(
							function(e) {
								var requiredElements = $(
										"#generate-company-form input:visible")
										.filter(
												function() {
													return $(this).prev().find(
															".required").length > 0;
												});
								$("#submitGenerateCompany").parent().css(
										"opacity", "1");
								for ( var i = 0; i < requiredElements.length; i++) {
									if (jQuery.trim($(requiredElements[i])
											.val()) == "") {
										$("#submitGenerateCompany").parent()
												.css("opacity", "0.5");
									}
								}
								if (e.keyCode === 13) {
									iv.generateCompany.submitForm();
									return false;
								}
							});
			$("#generate-company-form input")
					.unbind()
					.bind(
							"focus",
							function() {
								var elem = $(this);
								var timerID = window
										.setInterval(
												function() {
													var requiredElements = $(
															"#generate-company-form input:visible")
															.filter(
																	function() {
																		return $(
																				this)
																				.prev()
																				.find(
																						".required").length > 0;
																	});
													$("#submitGenerateCompany")
															.parent().css(
																	"opacity",
																	"1");
													for ( var i = 0; i < requiredElements.length; i++) {
														if (jQuery
																.trim($(
																		requiredElements[i])
																		.val()) == "") {
															$(
																	"#submitGenerateCompany")
																	.parent()
																	.css(
																			"opacity",
																			"0.5");
														}
													}
												}, 100);
								elem.data("timerID", timerID);
							}).bind("blur", function() {
						var elem = $(this);
						var timerID = elem.data("timerID");
						window.clearInterval(timerID);
					});
			$("input[name=phone]").addClass("default").bind("change",
					function() {
						var val = $(this).val();
						if (jQuery.trim(val) == "") {
							$(this).val("555-555-5555").addClass("default");
						} else {
							$(this).removeClass("default");
						}
					}).bind(
					"click",
					function() {
						var val = $(this).val();
						if (jQuery.trim(val) == "555-555-5555"
								&& $(this).hasClass("default")) {
							$(this).val("").removeClass("default");
						}
					}).bind("blur", function() {
				var val = $(this).val();
				if (jQuery.trim(val) == "" && !$(this).hasClass("default")) {
					$(this).val("555-555-5555").addClass("default");
				}
			}).val("555-555-5555");
			var $this = this;
			$("#submitGenerateCompany").bind("click", function() {
				if ($(this).parent().css("opacity") > 0.5) {
					$this.submitForm();
				}
			});
			var requiredElements = $("#generate-company-form input:visible")
					.filter(function() {
						return $(this).prev().find(".required").length > 0;
					});
			$("#submitGenerateCompany").parent().css("opacity", "0.5");
		}
		if (this.data.isMashup) {
			$(".results-container form").slideUp("slow");
			$("#generate-company-form").slideDown("slow");
		} else {
			$(".results-container").slideUp("slow");
			$("#generate-company-form").slideDown("slow");
		}
	},
	hideForm : function() {
		var $this = iv.generateCompany;
		if ($this.data.isMashup) {
			$("#generate-company-form").slideUp("slow");
			$(".results-container form").slideDown("slow");
		} else {
			$("#generate-company-form").slideUp("slow");
			$(".results-container").slideDown("slow");
		}
		iv.util.logUserActivity("Company-Generate-Form-Hide");
	},
	validateForm : function() {
		var isValid = true;
		var requiredFields = $("label .required");
		for ( var i = 0; i < requiredFields.length; i++) {
			var elem = $(requiredFields[i]).parent().next();
			if (jQuery.trim(elem.val()) == "" || elem.hasClass("default")
					&& elem.is(":visible")) {
				alert("One or more required fields are empty");
				isValid = false;
				break;
			}
		}
		return isValid;
	},
	submitForm : function() {
		if (this.validateForm()) {
			$("#hide-generate-company").show();
			iv.api.userAction.submitForm({
				form : $("#generate-company-form form"),
				success : this.submitFormCallback,
				error : this.submitFormCallback
			});
		}
	},
	submitFormCallback : function(xhr) {
		var resp = xhr.responseText;
		if (typeof resp == "string") {
			resp = JSON.parse(resp);
		}
		if (typeof resp != "undefined" && typeof resp.error != "undefined"
				&& resp.error) {
			alert(resp.errorMessage);
			$("#hide-generate-company").hide();
		} else {
			var companyId = resp.data.companyId;
			if (iv.generateCompany.data.isMashup) {
				company.match.doMatchAccount(companyId);
			} else {
				window.location = "/iv/companyinfo.do?methodToCall=overview&id="
						+ companyId;
			}
		}
	}
};
iv.processOnDomReady(function() {
	iv.generateCompany.init(companyMatcherData);
});