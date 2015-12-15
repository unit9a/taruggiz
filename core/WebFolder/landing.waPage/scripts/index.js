
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var menuItem2 = {};	// @menuItem
	var dataGrid1 = {};	// @dataGrid
	var fileUpload1 = {};	// @fileUpload
	var menuItem1 = {};	// @menuItem
// @endregion// @endlock

// eventHandlers// @lock

	menuItem2.click = function menuItem2_click (event)// @startlock
	{// @endlock
		arrInstalledProtocols = sources.Plugin.ListAdaptersProtocols();
        sources.arrInstalledProtocols.sync(); // Synchronization
		
	};// @lock

	dataGrid1.onRowClick = function dataGrid1_onRowClick (event)// @startlock
	{// @endlock
		var details = sources.account.GetPluginDetails(event.data.row.cells[0].value);
		console.log('adapter grid: %o', details);
		$('#adapterDetails').html(details.html);
	};// @lock

	fileUpload1.filesUploaded = function fileUpload1_filesUploaded (event)// @startlock
	{// @endlock
		console.log(event);
		var response = event.response;
		if (event.response) {
			$('#uploadResults').html('');
			event.response.forEach( function (uploadItem){
				if (uploadItem.saved) {
					var result = sources.account.AddPlugin(uploadItem.filename);
					$('#uploadResults').append(result.log.join('<br>'));
				}
			});
			//sources.adapters.sync();
		}
		else {
			var message = 'no responser from server for file upload attempt';
			$('#uploadResults').append(message);
		}
		
	};// @lock

	menuItem1.click = function menuItem1_click (event)// @startlock
	{// @endlock
		var userAdapters = localStorage.getItem('taruggizUser').adapters;
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("dataGrid1", "onRowClick", dataGrid1.onRowClick, "WAF");
	WAF.addListener("fileUpload1", "filesUploaded", fileUpload1.filesUploaded, "WAF");
	WAF.addListener("menuItem1", "click", menuItem1.click, "WAF");
// @endregion
};// @endlock
