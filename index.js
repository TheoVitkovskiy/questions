const questions = [
    {
        'id' : 1,
        'parent_id' : null,
        'value' : 'Should one aim to eliminate one\'s own suffering',
        'time_spent' : 0
    },
    {
        'id' : 2,
        'parent_id' : 1,
        'value' : 'Or is it better to focus on the suffering of others',
        'time_spent' : 0 
    },
    {
        'id' : 3,
        'parent_id' : null,
        'value' : 'Why is the pursuit of personal comfort a dead end',
        'time_spent' : 0 
    }
];

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addQuestion = (question = null) => {

}

const getQuestion = id => questions.find(q => q.id == id);

const getRndQuestion = () => getQuestion(getRandomInt(1, questions.length));

const getDirectSubQuestions = id => questions.filter(q => q.parent_id == id);

const contemplateQuestion = id => {
     
}

function init() {
    const directSubQuestions = getDirectSubQuestions(2);
    console.log(directSubQuestions);
//    const rndQuestion = getRndQuestion();
//    console.log(rndQuestion.value + '?');
}
init();
