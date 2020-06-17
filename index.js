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

const CHOICE_NEXT_MOST_LOVED_QUESTION = 'next most loved question';
const CHOICE_RANDOM_QUESTION = 'random question';
const CHOICE_RANDOM_SUB_QUESTION = 'random sub question';
const CHOICE_ADD_QUESTION = 'add question';
const CHOICE_ADD_SUB_QUESTION = 'add sub question';
const CHOICE_EXIT = 'back to real life';

const getQuestion = id => questions.filter(q => q.is_active).find(q => q.id == id);

const getRndQuestion = () => {
    return randomItemFromArr(questions.filter(q => q.is_active));    
}

const getRndSubQuestion = (id) => {
    return randomItemFromArr(getSubQuestions(id));
}

const getMostTimeSpentQuestion = () => {
    return questions
        .filter(q => q.is_active)
        .sort((q1, q2) => q2.time_spent - q1.time_spent)[0];
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
    nextPrompt();
}

function nextPrompt(choices = [
    CHOICE_RANDOM_QUESTION, 
    CHOICE_RANDOM_SUB_QUESTION, 
    CHOICE_NEXT_MOST_LOVED_QUESTION,
    CHOICE_EXIT
], message = null) {
    console.clear();
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
                message: message || promptMessage(),
                choices: choices
            }
        ])
        .then(answers => {
            console.clear();
            // add time spent to the prev question
            if (lastTimeStamp && currQuestion) {
                currQuestion.time_spent += Date.now() - lastTimeStamp; 
            }

            let choices = [];
            let infoMessage = null;

            switch(answers.next) {
                case CHOICE_RANDOM_QUESTION:
                    currQuestion = getRndQuestion();
                    break;
                case CHOICE_RANDOM_SUB_QUESTION:
                    currQuestion = getRndSubQuestion(currQuestion.id);
                    if (currQuestion == undefined) {
                        infoMessage = 'You exhausted this question chain. Let me give you a new one instead!';
                        currQuestion = getRndQuestion();
                    }
                    break;
                case CHOICE_NEXT_MOST_LOVED_QUESTION:
                    currQuestion = getMostTimeSpentQuestion(); 
                    break;
                case CHOICE_ADD_QUESTION:
                    addQuestion(); 
                    break;
                case CHOICE_EXIT:
                    currQuestion = null;
                    choices = [];
                    infoMessage = 'Come back anytime! :)';
                    break;
            }


            if (currQuestion == undefined) {
                resetQuestionsPrompt();
            } else {
                nextPrompt(choices, promptMessage(infoMessage));
            }
        });
}

const promptMessage = (infoMessage) => (infoMessage ? infoMessage + '\n' : '') + (currQuestion ? '||| ' + currQuestion.value + '? |||' : '');

function resetQuestionsPrompt() {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'reset',
                message: 'You exhausted all the questions. Hit ENTER to reset.',
            }
        ])
        .then(answers => {
            if (answers.reset) {
                questions.forEach(q => q.is_active = true);   
                nextPrompt();
            } else {
                logPrompt('Thank you for having contemplated all the questions!');
            }
        });
}

const ui = new inquirer.ui.BottomBar();

function test() {
    const arr = [1, 5, 3];
    console.log(arr.sort((a,b) => a - b));
}
//test();
init();
