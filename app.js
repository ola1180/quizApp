let quiz = document.querySelector('.quiz-data')
const apiUrl = 'https://opentdb.com/api.php?amount=10'
const button = document.querySelector('.quizButton')
let pageCounter = 0
let answerCounter = 0
let correctIndex = 0



async function init(apiUrl) {

    fetch(apiUrl)
        .then(response => {

            if (response.status === 200) {
                return response.json()
            }
            throw new Error()
        })
        .then((dataFromApi) => {
            renderQuestions(dataFromApi.results[pageCounter])
            nextSlide(dataFromApi)
        })
        .catch((error) => showError())

}



function renderQuestions({ question, correct_answer, incorrect_answers: [...allIncorrectAnswers] }) {


    let allQuestions = [correct_answer, ...allIncorrectAnswers]



    for (i = allQuestions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let memory = allQuestions[i]
        allQuestions[i] = allQuestions[j]
        allQuestions[j] = memory
    }


    let correctIndex = allQuestions.indexOf(correct_answer)

    let view = `<ul>  ${question}`

    for (question of allQuestions) {
        view += `<li>${question}</li>`
    }

    view += `</ul>`
    quiz.innerHTML = view

    checkAnswer(correctIndex)

}

function checkAnswer(correctIndex) {
    quiz.removeEventListener('click', answerClickHandler);
    quiz.addEventListener('click', answerClickHandler);
}

function answerClickHandler(e) {
    let selectedItem = e.target.closest('li');
    if (!selectedItem) return;

    let allItems = document.querySelectorAll('li');
    let answers = [...document.querySelectorAll('li')];
    let selectedIndex = answers.indexOf(selectedItem);

    let checkAnswer = selectedIndex === correctIndex;

    if (checkAnswer) {
        selectedItem.classList.add('correct-answer');
        answerCounter += 1;
        updateCounter(answerCounter, '.answer-counter');
    } else {
        selectedItem.classList.add('incorrect-answer');
    }

    allItems.forEach(item => {
        item.classList.add('not-allowed');
    });
}


let nextSlide = (data) => {
    button.addEventListener('click', () => {

        if (pageCounter < 10) {

            pageCounter += 1
            updateCounter(pageCounter, '.page-counter')
            renderQuestions(data.results[pageCounter])
        }

    })



}

let showError = () => {
    quiz.innerHTML = `<div class='error'>Data not found or thera are server problem</div>`
}

let updateCounter = (counter, counterContainer) => {
    let counterElement = document.querySelector(counterContainer)
    if (counterElement) {
        counterElement.textContent = `${counter} / 10`;
    }

}


init(apiUrl)
