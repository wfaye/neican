$(function(){
	var dynamicWatchListEnabled = false;

	var selectWlTemplate = null;  
	var staticWlTemplate = null;
	var selectWlDialog = new modal();
	var staticWlDialog = new modal();

	function showStaticWatchList()
	{
		selectWlDialog.hideModal();
		/*
		 * Initialize the template.
		 */
		if (null == staticWlTemplate)
		{
			staticWlTemplate = "<div id='add_watchlist'  style='text-align:left;'><h1 class='head18darkgrey' style='width:100%'>Watchlist Details</h1><hr size='1' class='header_line_dashed clearfix'><b>Name:</b> <input type='text' name='watchlist_name' id='watchlist_name' size='45'/><hr size='1' class='hr_line_dashed clearfix'><div style='float:right;'><input type=button name='cancel' value='Cancel' class='secondary_button search-button' onClick='hideModal();'/>&nbsp;<input type=button onclick='addWL();' class='primary_button search-button' name='save_watchlist' value='Save'/></div><div class='padded_8px'></div> <div class='padded_4px'></div>"; 
	    	staticWlTemplate += "<div id='error_msg' style='font-size:11px;color:#990000;display:none;'> Watchlist name cannot be empty</div></div>";
	    	staticWlDialog.initModalDialog({
				metrics :{width:400,height:120},
				content : staticWlTemplate,
				callback :function(){}
			});	
		}
		staticWlDialog.displayModal();
	}

	function addWatchlist(callbackFunction)
	{	
		/*
		 * Initialize the template.
		 */
		if (dynamicWatchListEnabled)
		{
			if (null == selectWlTemplate)
			{
				if (typeof callbackFunction != 'function')
				{
					callbackFunction = hookSelectWlType;
				}		
				selectWlTemplate = Spry.$('selectWatchlist-template').innerHTML;
				Spry.$('selectWatchlist-template').innerHTML = '';	
				selectWlDialog.initModalDialog({
					metrics : {	width : 670	},
					content : selectWlTemplate,
					callback : callbackFunction
				});	
			}
			selectWlDialog.displayModal();		
		}
		else
		{
			showStaticWatchList();		
		} 		
	iv.util.setDefaultFocus($("#modal-content"));
	}

	function hookSelectWlType()
	{
		Spry.Utils.addEventListener('static-option', 'click', function(event) {
			showStaticWatchList();		
		}, false);
		Spry.Utils.addEventListener('dynamic-option', 'click', function(event) {
			window.location.href = "/iv/watchlist.iv?newSFDCWatchList=true";		
		}, false);
		Spry.Utils.addEventListener('static-option', 'mouseover', function() {
			Spry.Utils.addClassName('static-option',
					'modal-container-grey-redborder');
		}, false);
		Spry.Utils.addEventListener('dynamic-option', 'mouseover', function() {
			Spry.Utils.addClassName('dynamic-option',
					'modal-container-grey-redborder');
		}, false);
		Spry.Utils.addEventListener('static-option', 'mouseout', function() {
			Spry.Utils.removeClassName('static-option',
					'modal-container-grey-redborder');
		}, false);
		Spry.Utils.addEventListener('dynamic-option', 'mouseout', function() {
			Spry.Utils.removeClassName('dynamic-option',
					'modal-container-grey-redborder');
		}, false);
		Spry.Utils.addEventListener('cancel-select-type', 'click', function() {
			selectWlDialog.hideModal();
		}, false);
	}

	function addWL()
	{
	    var url = "/iv/createWatchlist.iv?watchlistName=";
	    var watchlistName = document.getElementById("watchlist_name").value;
	    if(watchlistName == "")
	        document.getElementById("error_msg").style.display = "block";
	    else {
	    	var createWLForm = document.createElement("form");
	    	createWLForm.method="post" ;
	    	createWLForm.action = "/iv/createWatchlist.iv" ;
		    var watchlistNameInputField = document.createElement("input") ;
		    watchlistNameInputField.setAttribute("name", "watchlistName") ;
		    watchlistNameInputField.setAttribute("value", watchlistName);
		    createWLForm.appendChild(watchlistNameInputField) ;
	    	document.body.appendChild(createWLForm) ;
	    	createWLForm.submit() ;
	    	document.body.removeChild(createWLForm) ;
	    }
	}

	function hideModal()
	{
		document.getElementById("overlay").style.display = "none";
		document.getElementById("container").style.display = "none";
	}

	$('#tabWatchlist > a').bind('click',function(event) {
	    $('#watchlist_ul').toggleClass('MenuBarSubmenuVisible');
	    event.stopPropagation();
	    return false;
	});
});