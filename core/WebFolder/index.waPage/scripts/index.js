
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var login1 = {};	// @login
// @endregion// @endlock

// eventHandlers// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		var sessionObject = WAF.directory.currentUser();
		console.log(sources);
		ds.Account.query("ID = :1", { 
			onSuccess: function(event) {
				//sessionObject.account=event.entity; // the result is an entity 
			            // it would have been in event.entityCollection for the query() method
			            // here you can handle attribute values using getValue() and setValue()
			    //sessionObject.adapters = event.entity.adapters.meta;
			},
			params:[sessionObject.ID] 
		});
		
		localStorage.setItem('taruggizUser', sessionObject);
		window.location = "landing";
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("login1", "login", login1.login, "WAF");
// @endregion
};// @endlock
