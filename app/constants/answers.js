const TXT_HELP = `
	/newPoll - создать новое голосование
	/cancelPoll - отменить создание голосования
	/myPolls - показать список голосований
	/removePoll - удалить голосование
`;

// const TXT_HELP = `
// 	В группе:
// 	/initPollBot - включить бота в этой группе
// 	/stopPollBot - выключить бота в этой группе (в разработке)
//
// 	В личном чате:
// 	/newPoll - создать новое голосование
// 	/cancelPoll - перестать создавать голосование
// 	/sendImmediate - отправить голосование прямо сейчас (если хватает данных)
// 	/setPollSchedule - запланировать периодическую отправку (если хватает данных)
// `;

const TXT_COMMAND_ERR = `Не сработало. Либо я этого не умею, либо сейчас этого сделать нельзя`;

const TXT_NEWPOLL = `Выбери чат:`;
const TXT_NEWPOLL_ERR = `
	Так не пойдет, сначала добавь меня в группу`;

const TXT_STEP0_ERR =`Что-то пошло не так, у меня нет доступа к чату`;
const TXT_STEP0_OK = `Ок! Теперь напиши мне вопрос для голосования`;

const TXT_STEP1_OK = `Интересный вопрос. Теперь напиши первый вариант ответа`;

const TXT_STEP2_OK1 = `Отлично. Напиши следующий вариант ответа (их должно быть минимум два)`;

const TXT_STEP2_OK2 = `
	Супер. Пиши следующий вариант ответа. Если больше вариантов нет - нажми /setPollSchedule , `+
	`чтобы установить регулярное голосование, или /sendImmediate чтобы отправить его прямо сейчас. ` +
	`Если расхотелось - жми /cancelPoll и я удалю это голосование
`;

const TXT_DAYS_SELECT = `Отличное голосование. В какие дни будем его отправлять?`;


const TXT_STEP3_OK = `Ок, дни выбрали. Часы:`;
const TXT_STEP3_ERR = `Что-то не так с этим ответом. Попробуй нажать кнопочку на клавиатуре снизу`;


const TXT_STEP4_OK = `Молодец! Теперь минуты:`;
const TXT_STEP4_ERR = `Это либо неподходящее число, либо и вовсе не число. Попробуй нажать кнопочку на клавиатуре снизу`;

const TXT_STEP5_OK = `Отлично, мы создали голосование`;
const TXT_STEP5_ERR1 = `Это либо неподходящее число, либо и вовсе не число. Попробуй нажать кнопочку на клавиатуре снизу`;
const TXT_STEP5_ERR2 = `Что-то пошло не так когда я пытался сохранить твое голосование. Извини, у меня не получилось. Пни @bushizzle`;


const TXT_POLLSENT = `Ок, голосование отправлено`;
const TXT_POLLCANCELLED = `Ок, я все удалил`;

const TXT_REMOVEPOLL = `Какой опрос удаляем? Можешь нажать /cancelRemove если расхотелось`;
const TXT_REMOVEPOLL_OK = `Ок, опрос удален`;
const TXT_REMOVEPOLL_ERR1 = `У тебя нет активных опросов, мне нечего удалять`;
const TXT_REMOVEPOLL_ERR2 = `Нет. Попробуй лучше нажать одну из предложенных кнопок. Или жми /cancelRemove если расхотелось`;
const TXT_REMOVEPOLL_ERR3 = `Что-то пошло не так с удалением опроса`;
const TXT_REMOVEPOLL_CANCEL = `Ок, ничего не удаляем`;

const TXT_NO_POLLS = `Я не нашел запланированных опросов. Го /newPoll ?`;


const TXT_CHAT_PLACEHOLDER = `Да, мастер`;

module.exports = {
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
	TXT_NO_POLLS,
};
