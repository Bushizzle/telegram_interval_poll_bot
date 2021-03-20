const mongoose = require('mongoose');
require('dotenv').config();

const {
	Chat,
	User,
} = require('../models/');

const {
	getMe,
} = require('../helpers');


const actionHandler = async (msg, reply, user) => {
	const {
		from: {
			username,
		},
		group: {
			id: chatId,
			title: chatName,
		},
		action,
		subject,
		type,
		member={},
		members=[],

	} = msg;

	const { id: botId } = await getMe(process.env.API_KEY).then(({result}) => result);

	if (subject === 'member') {
		const existingChat = await Chat.findOne({chatId});

		switch (action) {
			case 'new' : {
				if (members.find(({id}) => id === botId)) {

					if (existingChat){

						Chat.updateOne({_id: existingChat._id}, { $set: { invited: true } })
							.then(() => {
								reply.text('Привет снова');
							});

					}
					else {

						const newChat = new Chat({
							_id: mongoose.Types.ObjectId(),
							name: chatName,
							owner: username,
							invited: true,
							chatId,
						})

						if (!user) {

							new User({
								_id: mongoose.Types.ObjectId(),
								username,
							}).save()
								.then(() => {
									console.log(`Зарегистрирован новй пользователь ${username}`)
									return newChat.save();
								})
								.then(() => reply.text('Всем привет'));

						} else {
							newChat.save().then(() => reply.text('Всем привет'));
						}
					}
					return;

				}
				return;
			}
			case 'leave' : {
				if (member.id === botId) {

					if (existingChat) {

						console.log(existingChat);

						Chat.updateOne({_id: existingChat._id}, { $set: { invited: false } })
							.then(() => {
								console.log(`Меня удалили из чата "${existingChat.name}", ID ${existingChat.chatId}`)
							});

					}
					else {

						const newChat = new Chat({
							_id: mongoose.Types.ObjectId(),
							name: chatName,
							owner: username,
							invited: false,
							chatId
						});

						newChat.save().then(() => console.log(`Меня удалили из чата ${chatName}, в который я непонятно как попал. ID ${chatId}`));

					}
					return;

				}
				return;
			}
		}
	}
}

module.exports = actionHandler;
