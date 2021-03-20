const mongoose = require('mongoose');
require('dotenv').config();

const {
	Chat,
	Poll,
} = require('../models/');

const {
	checkChatAvailability,
	sendPoll,
	PollData,
	getNumStrArr,
	convertPollData,
	getPollsList,
	getChatsList,
	getMe,
} = require('../helpers');

const {
	DAYS_OPTIONS,
	DAYS_VOCABULARY,
} = require('../constants/defaults');

const {
	TXT_HELP,
	TXT_COMMAND_ERR,
	TXT_NEWPOLL,
	TXT_NEWPOLL_ERR,
	TXT_STEP0_ERR,
	TXT_STEP0_OK,
	TXT_STEP1_OK,
	TXT_STEP2_OK1,
	TXT_STEP2_OK2,
	TXT_STEP3_OK,
	TXT_STEP3_ERR,
	TXT_STEP4_OK,
	TXT_STEP4_ERR,
	TXT_STEP5_OK,
	TXT_STEP5_ERR1,
	TXT_STEP5_ERR2,
	TXT_DAYS_SELECT,
	TXT_POLLSENT,
	TXT_POLLCANCELLED,
	TXT_CHAT_PLACEHOLDER,
	TXT_REMOVEPOLL,
	TXT_REMOVEPOLL_OK,
	TXT_REMOVEPOLL_ERR1,
	TXT_REMOVEPOLL_ERR2,
	TXT_REMOVEPOLL_ERR3,
	TXT_REMOVEPOLL_CANCEL,
	TXT_NO_POLLS
} = require('../constants/answers');

const commandsHandler = (msg, reply, creatingPoll, apiKey) => {
	const {
		from: {
			username,
		},
		command,
		context: {
			pollsCreatingBuffer,
			pollsRemovingBuffer,
		},
	} = msg;

	if (command === 'help') {
		reply.text(TXT_HELP);
		return;
	}

	if (creatingPoll) {
		switch (command) {
			case 'nextStep' : {

				return;
			}
			case 'sendImmediate' : {
				sendPoll(apiKey, convertPollData(creatingPoll)).then((res) => {
					reply.text(TXT_POLLSENT);
				});
				pollsCreatingBuffer.splice(pollsCreatingBuffer.indexOf(creatingPoll), 1);
				return;
			}
			case 'setPollSchedule' : {
				const daysKeyboard = DAYS_OPTIONS.map(({label}) => label);
				reply.keyboard(daysKeyboard, true, true).text(TXT_DAYS_SELECT);
				creatingPoll.next();
				return;
			}
			case 'cancelPoll' : {
				pollsCreatingBuffer.splice(pollsCreatingBuffer.indexOf(creatingPoll), 1);
				reply.text(TXT_POLLCANCELLED);
				return;
			}
			default : {
				reply.text(TXT_COMMAND_ERR);
			}
		}
	}
	else {
		switch (command) {
			case 'myPolls' : {
				Poll.find({ owner: username })
					.then((polls) => {
						if (polls.length) {
							reply.text(getPollsList(polls));
						}
						else {
							reply.text(TXT_NO_POLLS);
						}
					})
				return;
			}
			case 'newPoll' : {
				Chat
					.find({owner: username, invited: true})
					.then((chats) => {
						if (chats.length) {

							reply.keyboard(getNumStrArr(chats.length, 1), true, true).text(`${TXT_NEWPOLL}\n${getChatsList(chats)}`);

							const newPoll = new PollData(username);
							newPoll.chats = chats;

							pollsCreatingBuffer.push(newPoll);
						}
						else {
							reply.text(TXT_NEWPOLL_ERR);
						}
					})

				return;
			}
			case 'removePoll' : {
				Poll.find({owner:username}).then((polls) => {
					if (polls.length) {

						var keyboard = polls.map((_, i) => `${i + 1}`);

						reply.keyboard(keyboard, true, true).text(`${TXT_REMOVEPOLL}\n${getPollsList(polls)}`);

						pollsRemovingBuffer.push({
							username,
							polls,
						})

					}
					else {
						reply.text(TXT_REMOVEPOLL_ERR1);
					}
				})
				return;
			}
			default : {
				reply.text(TXT_COMMAND_ERR);
			}
		}
	}
}

const pollCreationHandler = (msg, reply, creatingPoll, apiKey) => {
	const {
		text,
		context: {
			pollsCreatingBuffer,
		},
	} = msg;

	switch (creatingPoll.step) {
		case 0 : {
			const { chatId, name: chatName } = creatingPoll.chats[text - 1]
			checkChatAvailability(apiKey, chatId)
				.then(({ok}) => {
					if (ok) {
						creatingPoll.set('chatId', chatId);
						creatingPoll.set('chatName', chatName);
						creatingPoll.next();
						reply.text(TXT_STEP0_OK);
					} else {
						reply.text(TXT_STEP0_ERR);
					}
				});
			return;
		}
		case 1 : {
			creatingPoll.set('question', text);
			creatingPoll.next();
			reply.text(TXT_STEP1_OK);
			return;
		}
		case 2 : {
			creatingPoll.answers.push(text);

			if (creatingPoll.answers.length < 2) {
				reply.text(TXT_STEP2_OK1);
			}
			else {
				reply.text(TXT_STEP2_OK2);
			}

			return;
		}
		case 3 : {
			const selectedDay = DAYS_OPTIONS.find(({label}) => label === text);
			if (selectedDay) {
				creatingPoll.weekDays = selectedDay.value;
				reply.keyboard(getNumStrArr(24), true, true).text(TXT_STEP3_OK);
				creatingPoll.next();
			}
			else {
				reply.text(TXT_STEP3_ERR);
			}

			return;
		}
		case 4 : {
			if (!isNaN(+text) && +text > -1 && +text < 24) {
				creatingPoll.pollTime[0] = +text;
				reply.keyboard(getNumStrArr(60), true, true).text(TXT_STEP4_OK);
				creatingPoll.next();
			}
			else {
				reply.text(TXT_STEP4_ERR);
			}

			return
		}
		case 5 : {
			if (!isNaN(+text) && +text > -1 && +text < 60) {
				creatingPoll.pollTime[1] = +text;

				const {
					chatId,
					question,
					answers,
					weekDays,
					pollTime,
					owner,
					chatName,
				} = creatingPoll;

				new Poll({
					_id: mongoose.Types.ObjectId(),
					chatId,
					question,
					answers,
					weekDays,
					pollTime,
					owner,
					chatName,
				}).save().then(
					(res) => {
						const pollCuccessText =
							`Чат:${chatName}\nВопрос: ${question}\nОтветы:\n ${answers.join(';\n')}\nВремя: ${pollTime.join(':')}\n` +
							`Дни недели: ${weekDays.map((day) => DAYS_VOCABULARY[day]).join(', ')}\n\n` +
							`Чтобы посмотреть все твои опросы жми /myPolls\nДругие команды - /help`;

						reply.text(`${TXT_STEP5_OK}\n\n${pollCuccessText}`);
						pollsCreatingBuffer.splice(pollsCreatingBuffer.indexOf(creatingPoll), 1);
					}
				)
			}
			else {
				reply.text(TXT_STEP5_ERR1);
			}

			return;
		}
	}
}

const pollRemovingHandler = (msg, reply, removingPoll) => {
	const {
		command,
		text,
		context: {
			pollsRemovingBuffer,
		},
	} = msg;

	if (command && command === 'cancelRemove') {
		pollsRemovingBuffer.splice(pollsRemovingBuffer.indexOf(removingPoll, 1));
		reply.text(TXT_REMOVEPOLL_CANCEL);
		return false;
	}

	const { _id } = removingPoll.polls[text - 1] || {};
	if (_id) {
		Poll.find({_id}).deleteOne({_id}).then(() => {
			reply.text(TXT_REMOVEPOLL_OK);
			pollsRemovingBuffer.splice(pollsRemovingBuffer.indexOf(removingPoll, 1));
		});
	}
	else {
		reply.text(TXT_REMOVEPOLL_ERR2);
	}
}

const smallTalkHandler = (msg, reply) => {
	reply.text(TXT_CHAT_PLACEHOLDER);
}

const adminChat = (msg, reply, apiKey) => {
	const {
		from: {
			username,
		},
		command,
		context: {
			pollsCreatingBuffer,
			pollsRemovingBuffer,
		},
	} = msg;

	const removingPoll = pollsRemovingBuffer.find((item) => item.username === username);

	if (removingPoll) {
		pollRemovingHandler(msg, reply, removingPoll);
		return false;
	}

	const creatingPoll = pollsCreatingBuffer.find(({ owner }) => owner === username);

	if (command) {
		commandsHandler(msg, reply, creatingPoll, apiKey);
	}
	else {
		if (creatingPoll) {
			pollCreationHandler(msg, reply, creatingPoll, apiKey);
		}
		else {
			smallTalkHandler(msg, reply);
		}
	}
}

module.exports = adminChat;
