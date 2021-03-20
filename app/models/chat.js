const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	chatId: Number,
	owner: String,
	invited: Boolean,
});

module.exports = mongoose.model('Chat', chatSchema);
