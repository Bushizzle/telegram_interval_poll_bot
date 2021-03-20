const mongoose = require('mongoose');

const {
	Chat,
	User,
} = require('../models/');

const {

} = require('../constants/answers');

const groupChat = async (msg, reply, user) => {
	const {
		from: {
			username,
		},
		command,
		group: {
			id: chatId,
			title: chatName,
		}
	} = msg;

}

module.exports = groupChat
