export default class QuizView {
    constructor() {
        this.quizData = document.querySelector('.quiz-data')
        this.button = document.querySelector('.quizButton')
        this.timer = document.querySelector('.timer')
        this.rankButton = document.querySelector('.rank')
        this.quizContainer = document.querySelector('.quiz')
        this.rankContainer = document.querySelector('.rank-container')

        this.button.addEventListener('click', () => {
            this.controller.nextButtonHandler()
        })

        this.rankButton.addEventListener('click', () => {
            this.quizContainer.classList.add('hidden')
            this.rankContainer.classList.remove('hidden')
        })
    }

    renderView({ question, difficulty, answers }) {
        this.quizData.innerHTML = ""
        const questionItem = document.createElement('h3')
        questionItem.textContent = question
        const questionLevel = document.createElement('h3')
        questionLevel.textContent = difficulty
        this.quizData.append(questionItem)
        this.quizData.append(questionLevel)

        for (let key in answers) {
            let answerItem = document.createElement('li')
            answerItem.textContent = answers[key].answer
            this.quizData.append(answerItem)

            answerItem.addEventListener('click', () => {
                this.controller.checkAnswear(answers[key].isCorrect, difficulty, answerItem)
            })
        }
    }

    checkAnswearView(isCorrect, answerItem) {
        if (isCorrect) {
            answerItem.classList.add('correct-answer')
        } else {
            answerItem.classList.add('incorrect-answer')
        }
        const answersList = document.querySelectorAll('li')

        answersList.forEach((item) => {
            item.classList.add('not-allowed')
        })
    }

    showRank(sortedRank) {
        const rankRow = document.createElement('tr')
        const rankCol1 = document.createElement('td')
        const rankCol2 = document.createElement('td')
        rankCol1.textContent = 'Numer'
        rankCol2.textContent = 'Liczba punktów'
        rankRow.append(rankCol1)
        rankRow.append(rankCol2)
        this.rankContainer.append(rankRow)

        sortedRank.forEach((item, index) => {
            const rankItemRow = document.createElement('tr')
            const rankItemCol1 = document.createElement('td')
            const rankItemCol2 = document.createElement('td')
            rankItemCol1.textContent = index + 1
            rankItemCol2.textContent = item
            rankItemRow.append(rankItemCol1)
            rankItemRow.append(rankItemCol2)
            this.rankContainer.append(rankItemRow)
        })
    }

    showTimer(count) {
        this.timer.innerHTML = `${count} s`
    }

    updateTimer(count) {
        this.timer.innerHTML = `${count} s`
    }

    updateCounter(counter, counterContainer) {
        const counterElement = document.querySelector(counterContainer)

        if (counterElement) {
            counterElement.textContent = counter
        }
    }

    displayFinishQuiz() {
        this.quizData.innerHTML = `<h2> Quiz finished.Your score is </h2>`
        this.button.classList.add('hidden')
        this.timer.classList.add('hidden')
    }

    displayTimesOut() {
        this.quizData.innerHTML = ""
        this.timer.innerHTML = `<h2>Time's out </h2>`
    }
}

