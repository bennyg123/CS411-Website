var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String
});

module.exports = {
	getModel: function getModel(connection) {
		return connection.model("UserModel", 
							userSchema);
	}
}
