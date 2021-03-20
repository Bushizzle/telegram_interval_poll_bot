const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: String,
});

// new User({
// 	_id: mongoose.Types.ObjectId(),
// 	username: ''
// }).save().then((res) => console.log(res));

module.exports = mongoose.model('User', userSchema);
