const fetch = require('node-fetch');

const {
	Poll,
} = require('../models/');

const {
	HOUR,
	MINUTE,
} = require('../constants/');
const {
	DAYS_VOCABULARY,
} = require('../constants/defaults');

function getDate(offset) {
	const d = new Date();
	const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	return new Date(utc + (3600000*offset));
}

function PollData (username) {
	this.owner = username;
	this.step = 0;
	this.chatName = undefined;
	this.chatId = undefined;
	this.question = undefined;

	this.weekDays = [];
	this.answers = [];
	this.pollTime = [0,0];

	this.set = (key, val) => this[key] = val;
	this.next = () => this.step++;

	return this;
}

const getNumStrArr = (size, from = 0) => (new Array(size)).fill(0).map((_, i) => `${i + from}`);

const sendPoll = (apiKey, pollData) => fetch(`https://api.telegram.org/bot${apiKey}/sendPoll`, {
	method: 'post',
	body:    JSON.stringify(pollData),
	headers: { 'Content-Type': 'application/json' },
})
	.then(res => res.json());

const getMe = (apiKey) => fetch(`https://api.telegram.org/bot${apiKey}/getMe`)
	.then(res => res.json());

const checkChatAvailability = (apiKey, chat_id) => fetch(`https://api.telegram.org/bot${apiKey}/sendChatAction`, {
	method: 'post',
	body:    JSON.stringify({
		chat_id,
		action: "typing"
	}),
	headers: { 'Content-Type': 'application/json' },
})
	.then(res => res.json());

const convertPollData = ({chatId, question, answers}) => ({
	chat_id: chatId,
	question: question,
	options: answers,
	is_anonymous: true,
	is_closed: false,
	type: 'regular',
});

const getPollsList = (polls) => polls.reduce((txt, {question, pollTime, chatName, weekDays}, i) =>
	`${txt}\n${i + 1}:  ${question}\nВремя: ${pollTime.join(':')}\n` +
	`Чат:${chatName}\nДни недели: ${weekDays.map((day) => DAYS_VOCABULARY[day]).join(', ')}\n`,
	''
);

getChatsList = (chats) => chats.reduce((txt, {name}, i) => `${txt}${i+1}: ${name}\n`, '');

const checkPolls = (apiKey) => {
	Poll.find().then((polls) => {
		const now = getDate(3);
		const day = now.getDay();
		const time = `${now.getHours()}:${now.getMinutes()}`;

		polls.forEach((data) => {
			const { weekDays, pollTime: [hr, min] } = data;

			if (weekDays.includes(day) && `${hr}:${min}` === time){
				sendPoll(apiKey, convertPollData(data));
			}
		});
	});
};

const setPollsWatcher = (apiKey) => {
	// console.log(getDate(3));
	checkPolls(apiKey);

	setTimeout(()=>{
		checkPolls(apiKey);
		setInterval(()=> checkPolls(apiKey), MINUTE);
	}, MINUTE);
};

module.exports = {
	PollData,
	sendPoll,
	checkChatAvailability,
	convertPollData,
	setPollsWatcher,
	getNumStrArr,
	getPollsList,
	getChatsList,
	getMe,
}
