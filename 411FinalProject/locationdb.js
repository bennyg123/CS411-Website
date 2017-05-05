var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
	locationname: String,
    locationdata: Object
});

module.exports = {
	getModel: function getModel(connection) {
		return connection.model("locationModel", 
							locationSchema);
	}
}
