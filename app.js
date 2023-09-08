let quiz = document.querySelector('.quiz-data')
const apiUrl = 'https://opentdb.com/api.php?amount=10'
const button = document.querySelector('.quizButton')
let pageCounter = 1
let answerCounter = 0


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

    console.log(correct_answer)

    let allQuestions = [correct_answer, ...allIncorrectAnswers]
    console.log(allQuestions)



    for (i = allQuestions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let memory = allQuestions[i]
        allQuestions[i] = allQuestions[j]
        allQuestions[j] = memory
    }

    let correctIndex = allQuestions.indexOf(correct_answer)
    console.log(`correctIndex ${correctIndex}`)

    let view = `<ul>  ${question}`

    for (question of allQuestions) {
        view += `<li>${question}</li>`
    }

    view += `</ul>`
    quiz.innerHTML = view

    checkAnswer(correctIndex)

}

function checkAnswer(correctIndex) {
    quiz.addEventListener('click', (e) => {

        let selectedItem = e.target.closest('li')
        let allItems = document.querySelectorAll('li')

        let answers = [...document.querySelectorAll('li')]
        let selectedIndex = answers.indexOf(selectedItem)
        console.log(`selecteIndex ${selectedIndex}`)
        console.log(selectedIndex === correctIndex)


        if (selectedIndex === correctIndex) {
            selectedItem.classList.add('correct-answer')
            answerCounter += 1
            updateCounter(answerCounter, '.answer-counter')
        }

        else { selectedItem.classList.add('incorrect-answer') }


        allItems.forEach(item => {
            item.classList.add('not-allowed')
        })

    })

}

let nextSlide = (data) => {
    button.addEventListener('click', () => {
        if (pageCounter < 11) {
            pageCounter += 1

            renderQuestions(data.results[pageCounter])
            updateCounter(pageCounter, '.page-counter')
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
