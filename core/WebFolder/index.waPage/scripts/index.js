
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
	var selectedConnectorEvent = {};	// @dataSource
	var button1 = {};	// @Button
	var fileUpload1 = {};	// @fileUpload
	var dataGrid1 = {};	// @dataGrid
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// Add your code here
		
		console.log('sources.account.connectors: %o', sources.account.ListConnectors());
	};// @lock

	selectedConnectorEvent.onAttributeChange = function selectedConnectorEvent_onAttributeChange (event)// @startlock
	{// @endlock
		
		var details = sources.account.GetConnectorDetails(selectedConnector);
		console.log('selected Connector : %o', details);
		
		if (details.display) {
			var markup = ' ';
			for(var item in details.display) {
				console.log('display item: %o', details.display[item]);
				var element =  details.display[item];
				switch(item) {
					case 'link':
						markup += '<a href="' +  element.ref + '" target="_blank">' + element.text + '</a>';
					break;
					default:
					break;
				}
			} 
			console.log('markup:: %s', markup);
			$('#detailsBox').html(markup);
		}
	};// @lock

	button1.action = function button1_action (event)// @startlock
	{// @endlock
		// Add your code here
		if ( sources.account.ResetConnector(selectedConnector).error ){
			$('#detailsBox').html('Reset Failed'); 
		}
		else {
			sources.selectedConnector.sync();
		}
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
			$('#detailsBox').append(message);
		}
	};// @lock

	dataGrid1.onRowClick = function dataGrid1_onRowClick (event)// @startlock
	{// @endlock
		selectedConnector = event.data.row.cells[0].value;
		sources.selectedConnector.sync();
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("selectedConnector", "onAttributeChange", selectedConnectorEvent.onAttributeChange, "WAF");
	WAF.addListener("button1", "action", button1.action, "WAF");
	WAF.addListener("fileUpload1", "filesUploaded", fileUpload1.filesUploaded, "WAF");
	WAF.addListener("dataGrid1", "onRowClick", dataGrid1.onRowClick, "WAF");
// @endregion
};// @endlock
