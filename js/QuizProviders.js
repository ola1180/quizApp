export default class TriviaQuizProvider {
    constructor(apiUrl) {
        this.apiUrl = apiUrl
    }

    async fetchQuizDataFromApi() {
        try {
            const response = await fetch(this.apiUrl)

            if (response.status !== 200) {
                throw new Error('There is problem with displaying data')
            }

            const jsonResponse = await response.json()
            return this.parseQuziApiData(jsonResponse.results)
        } catch (error) {
            console.log(error)
        }
    }

    parseQuziApiData(data) {

        return data.map(({ question, difficulty, correct_answer, incorrect_answers }) => {
            let answersList = [correct_answer, ...incorrect_answers]
            answersList = answersList.map((item, index) => {
                return { answer: item, isCorrect: index === 0 }
            })

            return { question, difficulty, answers: answersList }
        })
    }
}