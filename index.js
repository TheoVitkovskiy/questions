const inquirer = require('inquirer');
const questions = [
    {
        'id' : 1,
        'parent_id' : null,
        'value' : 'Should one aim to eliminate one\'s own suffering',
        'time_spent' : 0,
        'active' : true
    },
    {
        'id' : 2,
        'parent_id' : 1,
        'value' : 'Or is it better to focus on the suffering of others',
        'time_spent' : 0,
        'active' : true
    },
    {
        'id' : 3,
        'parent_id' : null,
        'value' : 'Why is the pursuit of personal comfort a dead end',
        'time_spent' : 0,
        'active' : true
    }
];

const CHOICE_RANDOM_QUESTION = 'random question';
const CHOICE_RANDOM_SUB_QUESTION = 'random sub question';
const CHOICE_ADD_QUESTION = 'add question';
const CHOICE_ADD_SUB_QUESTION = 'add sub question';


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

const getQuestion = id => questions.filter(q => q.active).find(q => q.id == id);

const getRndQuestion = () => {
    console.log(questions);
    return randomItemFromArr(questions.filter(q => q.active));    
}

const getRndSubQuestion = (id) => {
    return randomItemFromArr(getSubQuestions[id]);
}

const randomItemFromArr = (items) => {
    console.log(items);
    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}

const getSubQuestions = id => questions.filter(q => q.active).filter(q => q.parent_id == id);

let currQuestion = null;
let lastTimeStamp = null;

function init() {
    next();
}

function next() {
    console.clear();
    console.log(questions);
    if (currQuestion == null) {
        currQuestion = getRndQuestion();
    }

    lastTimeStamp = Date.now();

    currQuestion.active = false;

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'next',
                message: currQuestion.value + '?',
                choices: [CHOICE_RANDOM_QUESTION, CHOICE_RANDOM_SUB_QUESTION],
            }
        ])
        .then(answers => {
            // add time spent to the prev question
            if (lastTimeStamp && currQuestion) {
                currQuestion.time_spent += Date.now() - lastTimeStamp; 
            }


            switch(answers.next) {
                case CHOICE_RANDOM_QUESTION:
                    currQuestion = getRndQuestion();
                case CHOICE_RANDOM_SUB_QUESTION:
                    currQuestion = getRndSubQuestion();
            }

            if (currQuestion == undefined) {
                resetQuestions();
            } else {
                next();
            }
        });
}

function resetQuestions() {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'reset',
                message: 'Hit ENTER to reset all the questions',
            }
        ])
        .then(answers => {
            if (answers.reset) {
                questions.forEach(q => q.active = true);   
                next();
            } else {
                console.log('Thank you for having contemplated all the questions!');
            }
        });
}

init();
