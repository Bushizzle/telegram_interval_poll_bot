const DAYS_VOCABULARY = ['вс', 'пн', 'вт' ,'ср', 'чт', 'пт', 'сб'];
const DAYS_OPTIONS = [
	{
		label: 'Каждый день',
		value: [0,1,2,3,4,5,6],
	},
	{
		label: 'В рабочие дни',
		value: [1,2,3,4,5],
	},
	{
		label: 'В выходные',
		value: [6,0],
	},
];

module.exports = {
	DAYS_OPTIONS,
	DAYS_VOCABULARY,
};
