const quiz = document.querySelector('.quiz-data')
const apiUrl = 'https://opentdb.com/api.php?amount=10'
const button = document.querySelector('.quizButton')
let pageCounter = 1
let answerCounter = 0
let slideIndex = 0
const localStoragePointsKey = 'quiz-points'
let localStoragePoints = 0

async function init(apiUrl) {

    fetch(apiUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            throw new Error()
        })
        .then((dataFromApi) => {
            getPointsFromLocalStorage()
            renderQuestions(dataFromApi.results[slideIndex])
            nextSlide(dataFromApi)
        })
        .catch((error) => showError())

}

let renderQuestions = ({ question, correct_answer, incorrect_answers: [...allIncorrectAnswers] }) => {

    allAnswers = [correct_answer, ...allIncorrectAnswers]

    allAnswers.forEach((item, index) => {

        (index === 0) ? allAnswers[index] = { answer: item, isCorrect: true } : allAnswers[index] = { answer: item, isCorrect: false }

    })


    for (i = allAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let memory = allAnswers[i]
        allAnswers[i] = allAnswers[j]
        allAnswers[j] = memory
    }

    let questionItem = document.createElement('h3')
    questionItem.textContent = question

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

let checkAnswer = (isCorrect, answerItem) => {

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
        else {
            quiz.innerHTML = `<h2>Quiz finished. Your score is ${answerCounter} / 10</h2>`
            updateLocalStorage(answerCounter)
            button.classList.add('hidden')
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

let updateLocalStorage = (points) => {
    localStoragePoints += points
    localStorage.setItem(localStoragePointsKey, localStoragePoints)
}

let getPointsFromLocalStorage = () => {
    let pointsFromLocalStorage = localStorage.getItem(localStoragePointsKey)
    pointsFromLocalStorage === null ? pointsFromLocalStorage = 0 : localStoragePoints = parseInt(pointsFromLocalStorage)

}



init(apiUrl)
