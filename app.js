let quiz = document.querySelector('.quiz-data')
const apiUrl = 'https://opentdb.com/api.php?amount=10'
const button = document.querySelector('.quizButton')
let pageCounter = 1
let answerCounter = 0
let slideIndex = 0

async function init(apiUrl) {

    fetch(apiUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            throw new Error()
        })
        .then((dataFromApi) => {
            renderQuestions(dataFromApi.results[slideIndex])
            nextSlide(dataFromApi)
        })
        .catch((error) => showError())

}

function renderQuestions({ question, correct_answer, incorrect_answers: [...allIncorrectAnswers] }) {

    allAnswers = [correct_answer, ...allIncorrectAnswers]

    allAnswers.forEach((item, index) => {
        // (index === 0) ? { answer: item, isCorrect: true } : { answer: item, isCorrect: false }

        if (index === 0) {
            return allAnswers[index] = {
                answer: item,
                isCorrect: true
            }
        }
        else {
            return allAnswers[index] = {
                answer: item,
                isCorrect: false
            }
        }

    })

    for (i = allAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let memory = allAnswers[i]
        allAnswers[i] = allAnswers[j]
        allAnswers[j] = memory
    }

    let questionItem = document.createElement('h3')
    questionItem.textContent = question
    console.log(questionItem)

    quiz.append(questionItem)

    allAnswers.forEach(({ answer, isCorrect }) => {
        let answerItem = document.createElement('li')
        answerItem.textContent = answer
        quiz.append(answerItem)
        answerItem.addEventListener('click', () => {
            checkAnswer(isCorrect, answerItem)
        })
    })

}

function checkAnswer(isCorrect, answerItem) {

    if (isCorrect) {
        answerItem.classList.add('correct-answer');
        answerCounter += 1;
        updateCounter(answerCounter, '.answer-counter');
    }
    else {
        answerItem.classList.add('incorrect-answer');
    }

    let answersList = document.querySelectorAll('li')

    answersList.forEach((item) => {
        item.classList.add('not-allowed')
    })

}

let nextSlide = (data) => {
    button.addEventListener('click', () => {

        quiz.innerHTML = ""

        if (pageCounter < 10) {
            pageCounter += 1
            updateCounter(pageCounter, '.page-counter')
            renderQuestions(data.results[slideIndex++])
        }
        else { quiz.innerHTML = `<h2>Quiz finished. Your score is ${answerCounter} / 10</h2>` }

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
