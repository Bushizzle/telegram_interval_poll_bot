const botgram = require('botgram');
require('dotenv').config();

const mongoose = require('mongoose');
const {
	User,
	Chat,
} = require('./models/');

const adminChat = require('./msgHandlers/admin');
const strangerChat = require('./msgHandlers/stranger');
const groupChat = require('./msgHandlers/group');
const actionHandler = require('./msgHandlers/action');

const {
	setPollsWatcher,
} = require('./helpers');

const apiKey = process.env.API_KEY;

if(!apiKey) {
	console.log('Error! No telegram api key provided, check your .env file');
}

const bot = botgram(apiKey);

bot.context({
	pollsCreatingBuffer: [],
	pollsRemovingBuffer: [],
});

mongoose.connect(
	'mongodb://localhost/polls_db',
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
	},
);

bot.all(
	async (msg, reply) => {
		const {
			chat: {
				type: chatType,
			},
			from: {
				username,
			},
			action,
		} = msg;

		// Chat.find().then(res => console.log(res));

		const user = await User.findOne({ username });

		if (action) {
			actionHandler(msg, reply, user);
			return false;
		}

		if(chatType === 'user') {
			if (user) {
				adminChat(msg, reply, apiKey);
			} else {
				strangerChat(msg, reply);
			}
		}
		else if (chatType === 'group') {
			groupChat(msg, reply, user);
		}

	}
)

setPollsWatcher(apiKey);
