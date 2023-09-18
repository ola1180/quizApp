import TriviaQuizProvider from './js/QuizProviders.js'
import QuizModel from './js/QuizModel.js'
import QuizView from './js/QuizView.js'
export default class QuizController {
    constructor(quizProvider, quizModel, quizView) {
        this.quizProvider = quizProvider
        this.quizModel = quizModel
        this.quizView = quizView
        this.quizView.controller = this
    }

    async startQuiz() {
        this.getPointsFromLocalStorage()
        this.quizModel.dataModel = await this.quizProvider.fetchQuizDataFromApi()
        this.quizModel.prepareDataToRender()
        this.renderQuestion()
        this.rankDataHandler()
    }

    renderQuestion() {
        this.startTimer()
        this.quizView.renderView(this.quizModel.dataModel[this.quizModel.questionIndex])
    }

    checkAnswear(isCorrect, level, answerItem) {
        this.quizView.checkAnswearView(isCorrect, answerItem)

        if (isCorrect) {
            this.weight = this.quizModel.weightMap[level] ?? 1
            this.quizModel.pointsCounter += this.weight
            this.quizView.updateCounter(this.quizModel.pointsCounter, '.answer-counter')
        }
    }

    nextButtonHandler() {
        this.quizModel.lastIndex = this.quizModel.dataModel.length - 1

        if (this.quizModel.questionIndex < this.quizModel.lastIndex) {
            this.quizModel.questionIndex += 1
            this.quizView.updateCounter(this.quizModel.questionIndex + 1, '.page-counter')
            this.renderQuestion()
        } else {
            clearInterval(this.quizModel.timerCountdown)
            this.updateLocalStorage(this.quizModel.pointsCounter)
            this.quizView.displayFinishQuiz()
        }
    }

    updateLocalStorage(points) {
        this.quizModel.localStoragePoints = points
        localStorage.setItem(this.quizModel.localStoragePointsKey, this.quizModel.localStoragePoints)
        this.quizModel.rankPointsList.push(points)
        localStorage.setItem(this.quizModel.localStorageRankPointsKey, this.quizModel.rankPointsList)
    }

    getPointsFromLocalStorage() {
        this.quizModel.pointsFromLocalStorage = localStorage.getItem(this.quizModel.localStoragePointsKey) ?? 0
        this.quizModel.localStoragePoints = parseInt(this.quizModel.pointsFromLocalStorage)
        this.quizModel.rankPointsLocalStorage = localStorage.getItem(this.quizModel.localStorageRankPointsKey)

        if (this.quizModel.rankPointsLocalStorage === null) {
            this.quizModel.rankPointsList = []
        } else {
            let splitedPoints = this.quizModel.rankPointsLocalStorage.split(',')
            splitedPoints = splitedPoints.map((item) => {
                const parsedItem = parseInt(item)
                return this.quizModel.rankPointsList.push(parsedItem)
            })
        }
    }

    rankDataHandler() {
        this.quizModel.sortRank()
        this.quizView.showRank(this.quizModel.rankPointsList)
    }

    startTimer() {
        clearInterval(this.quizModel.timerCountdown)
        this.interval = this.quizModel.timerInterval
        this.quizView.showTimer(this.interval)
        this.quizModel.timerCountdown = setInterval(() => {
            this.interval--
            this.quizView.showTimer(this.interval)

            if (this.interval <= 0) {
                this.quizView.displayTimesOut()
                clearInterval(this.quizModel.timerCountdown)
            }
        }, 1000)
    }
}

const quizProvider = new TriviaQuizProvider('https://opentdb.com/api.php?amount=10')
const quizModel = new QuizModel()
const quizView = new QuizView()
const quizController = new QuizController(quizProvider, quizModel, quizView)
quizController.startQuiz()
