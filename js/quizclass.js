class Quiz{
    #arrayQuestionsGone
    #arrayAlternativesGone
    #alternativesArea
    #currentQuestion
    #buttonStartQuiz
    #buttonClose
    #buttonConfirm
    #buttonNext
    #score
    constructor(quizzes, quizActive, buttonStartQuiz, buttonClose, buttonConfirm, buttonNext){
        this.quizzes = quizzes;
        this.quizActive = quizActive;     
        this.#buttonStartQuiz = buttonStartQuiz;   
        this.#buttonClose = buttonClose;
        this.#buttonConfirm = buttonConfirm;
        this.#buttonNext = buttonNext;
        this.#alternativesArea = [];
        this.#arrayQuestionsGone = []; 
        this.#arrayAlternativesGone = [];
        this.#currentQuestion = "";
        this.#score = 0;

        this.#buttonStartQuiz.addEventListener("click", () => {
            if(this.#arrayQuestionsGone.length === this.getCurrentQuiz().perguntas.length)
                quiz.generateStructure(); 
        });
        this.#buttonNext.addEventListener("click", () => this.nextQuestion());
        this.#buttonConfirm.addEventListener("click", () => this.confirmAlternative());
        this.#buttonClose.addEventListener("click", () => this.closeModal());
        this.quizzes.forEach(quiz => {
            quiz.addEventListener("click", (event) => this.selectQuiz(event.target));
        });
    }
    selectQuiz(quizTarget){
        this.quizzes.forEach(quiz => quiz.classList.remove("active"));
        quizTarget.classList.add("active");
        this.quizActive = quizTarget;
        this.resetScore();
        this.resetArrayQuestionsGone();
        this.generateStructure();
    }
    generateStructure(randomQuestion = this.generateNewRandomQuestion()){
        this.insertNameQuiz();
        this.insertQuestion(randomQuestion);
        this.insertAlternatives(this.getCurrentArrayAlternatives(randomQuestion));
        this.removeWarning();
    }
    insertNameQuiz(){
        const quizTitle = document.querySelector(".quizTitle");
        const modalHeaderTitle = document.querySelector(".modal-title");
        quizTitle.innerHTML = this.quizActive.innerHTML;
        modalHeaderTitle.innerHTML = this.quizActive.innerHTML;
    }
    insertQuestion(randomQuestion){
        const questionArea = document.querySelector(".modal-question");
        questionArea.innerHTML = randomQuestion;
    }
    insertAlternatives(arrayAlternatives){
        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = "";

        arrayAlternatives.forEach(() => {
            const alternativeArea = document.createElement("div");
            let alternative = this.generateNewRandomAlternative();

            alternativeArea.classList.add("alternative");
            alternativeArea.innerHTML = alternative;
            alternativeArea.addEventListener("click", (event) => this.clickAlternative(event.target));

            modalBody.insertAdjacentElement("beforeend", alternativeArea);
            this.#alternativesArea.push(alternativeArea);
        });
    }
    getCurrentQuiz(){
        const currentQuiz = quizJson[this.quizActive.getAttribute("data-index")];
        return currentQuiz;
    }
    getCurrentArrayAlternatives(){
        const currentQuiz = this.getCurrentQuiz();
        const indexCurrentQuestion = currentQuiz.perguntas.indexOf(this.#currentQuestion);
        const currentArrayAlternatives = currentQuiz.respostas[indexCurrentQuestion].alternativas; 
        return currentArrayAlternatives;
    }
    getCurrentAlternativeCorrect(){
        const currentQuiz = this.getCurrentQuiz();
        const indexCurrentQuestion = currentQuiz.perguntas.indexOf(this.#currentQuestion);
        const currentAlternativeCorrect = currentQuiz.respostas[indexCurrentQuestion].correta;
        return currentAlternativeCorrect;
    }
    generateNewRandomQuestion(){
        const currentQuiz = this.getCurrentQuiz();
        const randomIndex = Math.round(Math.random() * (currentQuiz.perguntas.length - 1));
        let randomQuestion = currentQuiz.perguntas[randomIndex];

        if(this.#arrayQuestionsGone.length < currentQuiz.perguntas.length) {
            while(this.#arrayQuestionsGone.includes(randomQuestion))
                randomQuestion = currentQuiz.perguntas[randomIndex];
        } else {
            this.resetArrayQuestionsGone();
        }

        this.#arrayQuestionsGone.push(randomQuestion);
        this.#currentQuestion = randomQuestion;
        return randomQuestion;
    }
    generateNewRandomAlternative(randomQuestion){
        const currentArrayAlternatives = this.getCurrentArrayAlternatives(randomQuestion);
        const randomIndex = Math.round(Math.random() * (currentArrayAlternatives.length - 1));
        let randomAlternative = currentArrayAlternatives[randomIndex];

        if(this.#arrayAlternativesGone.length < currentArrayAlternatives.length) {
            while(this.#arrayAlternativesGone.includes(randomAlternative))
                randomAlternative = currentArrayAlternatives[randomIndex];
        } else {
            this.resetArrayAlternativesGone();
        }

        this.#arrayAlternativesGone.push(randomAlternative);
        return randomAlternative;
    }
    selectAlternative(alternativeChosen){
        this.#alternativesArea.forEach(alternative => alternative.classList.remove("chosen"));
        alternativeChosen.classList.add("chosen");
    }
    deselectAlternative(alternativeChosen){
        if(alternativeChosen !== null && alternativeChosen.matches(".chosen"))
            alternativeChosen.classList.remove("chosen");
    }
    clickAlternative(alternativeChosen){
        if(!alternativeChosen.matches(".chosen"))
            this.selectAlternative(alternativeChosen);
        else
            this.deselectAlternative(alternativeChosen);

        this.verifyConfirmButton();
    }
    verifyConfirmButton(){
        const verify = this.#alternativesArea.some(alternative => alternative.matches(".chosen"));
        if(verify)
            this.#buttonConfirm.classList.remove("disabled");
        else
            this.#buttonConfirm.classList.add("disabled");
    }
    habilityNextButton(){
        this.#buttonNext.classList.remove("disabled");
    }
    resetScore(){
        this.#score = 0;
    }
    addScore(){
        this.#score++;
    }
    resetArrayQuestionsGone(){
        this.#arrayQuestionsGone = [];
    }
    resetArrayAlternativesGone(){
        this.#arrayAlternativesGone = [];
    }
    createWarning(warningText, warningType){
        const warning = document.createElement("div");
        const warningDismiss = document.createElement("a");
        
        warningDismiss.innerHTML = "&times;";
        warningDismiss.classList.add("close");
        warningDismiss.setAttribute("data-dismiss", "alert");
        
        warning.innerHTML = warningText;
        warning.classList.add("alert");
        warning.classList.add("fade");
        warning.classList.add("show");
        warning.classList.add(warningType);
        warning.insertAdjacentElement("beforeend", warningDismiss);
        
        return warning;
    }
    showRight(){
        const rightText = "Parabéns você acertou!";
        const rightClass = "alert-success";
        
        const right = this.createWarning(rightText, rightClass);
        return right;
    }
    showError(){
        const errorText = "Resposta errada";
        const errorClass = "alert-danger";
        
        const error = this.createWarning(errorText, errorClass);
        return error;
    }
    removeWarning(){
        const warnings = document.querySelectorAll(".alert");
        if(warnings != null)
            warnings.forEach(warning => warning.remove());
    }
    showAnswers(){
        this.#alternativesArea.forEach((alternative) => {
            if(alternative.innerHTML === this.getCurrentAlternativeCorrect())
                alternative.classList.add("correct");
            else
                alternative.classList.add("incorrect");
        });
    }
    showScore(){
        const scoreText = `Você fez ${this.#score} ponto(s)`;
        const scoreClass = "alert-info";   
        const score = this.createWarning(scoreText, scoreClass);
        return score;
    }
    closeModal(){
        const alternativeChosen = document.querySelector(".alternative.chosen");
        this.#buttonClose.click();
        this.deselectAlternative(alternativeChosen);
    }
    confirmAlternative(){
        if(!this.#buttonConfirm.matches(".disabled")){
            const selectedAlternative = document.querySelector(".alternative.chosen");
            const modalFooter = document.querySelector(".modal-footer");

            selectedAlternative.classList.remove("chosen");

            if(selectedAlternative.innerHTML === this.getCurrentAlternativeCorrect()) {
                const correctWarning = this.showRight();
                modalFooter.insertAdjacentElement("afterbegin", correctWarning);
                this.addScore();
            } else {
                const incorrectWarning = this.showError();
                modalFooter.insertAdjacentElement("afterbegin", incorrectWarning);
            }
            this.showAnswers();
            this.habilityNextButton();
            this.verifyConfirmButton();

        }
    }
    nextQuestion(){
        if(!this.#buttonNext.matches(".disabled")){
            if(this.#arrayQuestionsGone.length < this.getCurrentQuiz().perguntas.length) {
                this.removeWarning();
                this.generateStructure();
                if(this.#arrayQuestionsGone.length === this.getCurrentQuiz().perguntas.length)
                    this.#buttonNext.innerHTML = "Ver pontuação!";
            } else {
                const scoreWarning = this.showScore();
                const container = document.querySelector(".container");
                this.closeModal();
                container.insertAdjacentElement("beforeend", scoreWarning);
                this.#buttonNext.innerHTML = "Próxima";
            }
            this.#buttonNext.classList.add("disabled");
        }
    }
}