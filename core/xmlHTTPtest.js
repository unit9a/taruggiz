/*
var stmod = require(File(FileSystemSync("taruPlugins"), 'SmartThingsv01').path);

stmod.taruConnect({
	connector: ds.Connector('D62FB70C1EC9FE4C9D26C1F7C56CBA29') ,
	endpoint: ds.EndPoint('7708BE36B45F6A439B2100F301DA8F3C')
});

var protocol = require(File(FileSystemSync("taruPlugins"), fileName).path).taruInfo.connection.protocol

var endPointType = 'http';
ds.SystemWorker.find(
	'plugin.taruInfo.connection.protocol == :1', endPointType
	//'taruInfo.connection.protocol != null'
);
ds.Connector.all();
//ds.Connector.remove();
	*/	
ds.Plugin('67522C93B57ADD4A8A5E6B1EDBD131A3').Module().StartWorker();