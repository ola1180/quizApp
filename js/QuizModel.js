
export default class QuizModel {
    constructor() {
        this.dataModel = null
        this.pointsCounter = 0
        this.questionIndex = 0
        this.localStoragePoints = 0
        this.timerCountdown = null
        this.rankPointsList = []
        this.localStoragePointsKey = 'quiz-points'
        this.localStorageRankPointsKey = 'rank-points'
        this.timerInterval = 10

        this.weightMap = {
            "easy": 1,
            "medium": 2,
            "hard": 3
        }
    }

    prepareDataToRender() {
        this.mixAnswears()
    }

    mixAnswears() {
        this.dataModel.map((item, index) => {
            this.answersMixed = this.dataModel[index].answers

            for (let i = this.answersMixed.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1))
                let memory = this.answersMixed[i]
                this.answersMixed[i] = this.answersMixed[j]
                this.answersMixed[j] = memory
            }
            return this.dataModel[index].answers = this.answersMixed
        })
    }

    sortRank() {
        this.rankPointsList.sort().reverse()
    }
}
