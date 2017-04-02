
model.DataClass1.entityMethods.GetInfo = function() {
	/* return object with:
	init date
	nubmer of child nodes
	time of last update
	*/
	return {};
};
model.SubProcess.entityMethods.Log = function() {
	/* add a transation record to log class 
	for ANY updates to this or it's children
	*/
};