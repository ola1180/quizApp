const quiz = document.querySelector('.quiz-data')
const apiUrl = 'https://opentdb.com/api.php?amount=10'
const button = document.querySelector('.quizButton')
let answerCounter = 0
let slideIndex = 0
const localStoragePointsKey = 'quiz-points'
let localStoragePoints = 0
const timer = document.querySelector('.timer')
let countdown = null
let rankPoints = []
let quizData = null
const localStorageRankPoints = 'rank-points'
rankButton = document.querySelector('.rank')
quizContainer = document.querySelector('.quiz')
rankContainer = document.querySelector('.rank-container')
const weightMap = {
    "easy": 1,
    "medium": 2,
    "hard": 3
}

async function init() {
    let response = await fetch(apiUrl)

    if (response.status !== 200) {
        throw new Error()
    }

    const jsonResponse = await response.json()
    quizData = jsonResponse

    getPointsFromLocalStorage()
    timerStart()
    renderQuestions(jsonResponse.results[slideIndex])
    rankRendering()
}

const renderQuestions = ({ question, correct_answer, difficulty, incorrect_answers: [...allIncorrectAnswers] }) => {
    const allAnswers = ([correct_answer, ...allIncorrectAnswers]).map((item, index) => {
        return { answer: item, isCorrect: (index === 0), level: difficulty }
    })

    for (i = allAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let memory = allAnswers[i]
        allAnswers[i] = allAnswers[j]
        allAnswers[j] = memory
    }

    const questionItem = document.createElement('h3')
    questionItem.textContent = question
    const questionLevel = document.createElement('h3')
    questionLevel.textContent = difficulty
    quiz.append(questionItem)
    quiz.append(questionLevel)

    allAnswers.forEach(({ answer, isCorrect, level }) => {
        const answerItem = document.createElement('li')
        answerItem.textContent = answer
        quiz.append(answerItem)
        answerItem.addEventListener('click', () => {
            checkAnswer(isCorrect, answerItem, level)
        })
    })
}

const checkAnswer = (isCorrect, answerItem, level) => {
    if (isCorrect) {
        answerItem.classList.add('correct-answer');
        const weight = weightMap[level] ?? 1
        answerCounter += weight
        updateCounter(answerCounter, '.answer-counter');
    } else {
        answerItem.classList.add('incorrect-answer');
    }

    const answersList = document.querySelectorAll('li')
    answersList.forEach((item) => {
        item.classList.add('not-allowed')
    })
}

button.addEventListener('click', () => {
    quiz.innerHTML = ""

    if (slideIndex < (quizData.results.length - 1)) {
        timerStart()
        slideIndex += 1
        updateCounter(slideIndex + 1, '.page-counter')
        renderQuestions(quizData.results[slideIndex])
    } else {
        clearInterval(countdown)
        quiz.innerHTML = `<h2>Quiz finished. Your score is ${answerCounter} / 10</h2>`
        updateLocalStorage(answerCounter)
        button.classList.add('hidden')
        timer.classList.add('hidden')
    }
})

const showError = () => {
    quiz.innerHTML = `<div class='error'>Data not found or thera are server problem</div>`
}

const updateCounter = (counter, counterContainer) => {
    const counterElement = document.querySelector(counterContainer)

    if (counterElement) {
        counterElement.textContent = `${counter} / 10`;
    }
}

const updateLocalStorage = (points) => {
    localStoragePoints += points
    localStorage.setItem(localStoragePointsKey, localStoragePoints)

    rankPoints.push(points)
    localStorage.setItem(localStorageRankPoints, rankPoints)
}

const getPointsFromLocalStorage = () => {
    const pointsFromLocalStorage = localStorage.getItem(localStoragePointsKey) ?? 0
    localStoragePoints = parseInt(pointsFromLocalStorage)
    const rankPointsLocalStorage = localStorage.getItem(localStorageRankPoints)

    if (rankPointsLocalStorage === null) {
        rankPoints = []
    } else {
        let splitedPoints = rankPointsLocalStorage.split(',')
        splitedPoints = splitedPoints.map((item) => {
            const parsedItem = parseInt(item)
            return rankPoints.push(parsedItem)
        })
    }
}

const timerStart = () => {
    clearInterval(countdown)
    let count = 10
    timer.innerHTML = `${count} s`

    countdown = setInterval(() => {
        count--
        timer.innerHTML = `${count} s`

        if (count <= 0) {
            clearInterval(countdown)
            quiz.innerHTML = `<h2>Times out</h2>`
        }
    }, 1000)
}

const rankRendering = () => {
    sortedArray = rankPoints.sort().reverse()
    let rankRow = document.createElement('tr')
    let rankCol1 = document.createElement('td')
    let rankCol2 = document.createElement('td')
    rankCol1.textContent = 'Numer'
    rankCol2.textContent = 'Liczba punktów'
    rankRow.append(rankCol1)
    rankRow.append(rankCol2)
    rankContainer.append(rankRow)

    sortedArray.forEach((item, index) => {
        let rankItemRow = document.createElement('tr')
        let rankItemCol1 = document.createElement('td')
        let rankItemCol2 = document.createElement('td')
        rankItemCol1.textContent = index + 1
        rankItemCol2.textContent = item
        rankItemRow.append(rankItemCol1)
        rankItemRow.append(rankItemCol2)
        rankContainer.append(rankItemRow)

    })
}

rankButton.addEventListener('click', () => {
    quizContainer.classList.add('hidden')
    rankContainer.classList.remove('hidden')
})

init()