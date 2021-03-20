const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	owner: String,
	chatId: String,
	chatName: String,
	question: String,
	answers: Array,
	weekDays: Array,
	pollTime: Array,
});

module.exports = mongoose.model('Poll', pollSchema);
