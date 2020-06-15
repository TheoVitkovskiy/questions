const inquirer = require('inquirer');
const questions = [
    {
        'id' : 1,
        'parent_id' : null,
        'value' : 'Should one aim to eliminate one\'s own suffering',
        'time_spent' : 0,
        'is_active' : true
    },
    {
        'id' : 2,
        'parent_id' : 1,
        'value' : 'Or is it better to focus on the suffering of others',
        'time_spent' : 0,
        'is_active' : true
    },
    {
        'id' : 3,
        'parent_id' : null,
        'value' : 'Why is the pursuit of personal comfort a dead end',
        'time_spent' : 0,
        'is_active' : true
    }
];

const CHOICE_RANDOM_QUESTION = 'random question';
const CHOICE_RANDOM_SUB_QUESTION = 'random sub question';
const CHOICE_ADD_QUESTION = 'add question';
const CHOICE_ADD_SUB_QUESTION = 'add sub question';

const addQuestion = (question = null) => {

}

const getQuestion = id => questions.filter(q => q.is_active).find(q => q.id == id);

const getRndQuestion = () => {
    return randomItemFromArr(questions.filter(q => q.is_active));    
}

const getRndSubQuestion = (id) => {
    return randomItemFromArr(getSubQuestions(id));
}

const randomItemFromArr = (items) => {
    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}

const getSubQuestions = id => questions.filter(q => q.is_active).filter(q => q.parent_id == id)

let currQuestion = null;
let lastTimeStamp = null;

function init() {
    next();
}

function next() {
    if (currQuestion == null) {
        currQuestion = getRndQuestion();
    }

    lastTimeStamp = Date.now();

    currQuestion.is_active = false;

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
            console.clear();
            // add time spent to the prev question
            if (lastTimeStamp && currQuestion) {
                currQuestion.time_spent += Date.now() - lastTimeStamp; 
            }

            switch(answers.next) {
                case CHOICE_RANDOM_QUESTION:
                    currQuestion = getRndQuestion();
                    break;
                case CHOICE_RANDOM_SUB_QUESTION:
                    currQuestion = getRndSubQuestion(currQuestion.id);
                    if (currQuestion == undefined) {
                        console.log('You exhausted this question chain. Let me give you a new one instead!');
                        currQuestion = getRndQuestion();
                    }
                    break;
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
                questions.forEach(q => q.is_active = true);   
                next();
            } else {
                console.log('Thank you for having contemplated all the questions!');
            }
        });
}

init();
