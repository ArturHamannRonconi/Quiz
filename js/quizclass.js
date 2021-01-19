class Quiz{
    #arrayQuestionsGone
    #arrayAlternativesGone
    #alternativesArea
    #currentQuestion
    #buttonClose
    #buttonConfirm
    #buttonNext
    #score
    constructor(quizzes, quizActive, buttonClose, buttonConfirm, buttonNext){
        this.quizzes = quizzes;
        this.quizActive = quizActive;        
        this.#buttonClose = buttonClose;
        this.#buttonConfirm = buttonConfirm;
        this.#buttonNext = buttonNext;
        this.#alternativesArea = [];
        this.#arrayQuestionsGone = []; 
        this.#arrayAlternativesGone = [];
        this.#currentQuestion = "";
        this.#score = 0;

        this.#buttonNext.addEventListener("click", () => {
            this.nextQuestion();
        });
        this.#buttonConfirm.addEventListener("click", () => {
            this.confirmAlternative();
        });
        this.#buttonClose.addEventListener("click", () => {
            this.closeModal();
        });
        this.quizzes.forEach(quiz => {
            quiz.addEventListener("click", (event) => {
                this.selectQuiz(event.target);
            });
        });
    }
    selectQuiz(quizTarget){
        this.quizzes.forEach(quiz => {
            quiz.classList.remove("active");
        })
        quizTarget.classList.add("active");
        this.quizActive = quizTarget;
        this.resetScore();
        this.generateStructure();
    }
    generateStructure(randomQuestion = this.generateNewRandomQuestion()){
        this.insertNameQuiz();
        this.insertQuestion(randomQuestion);
        this.insertAlternatives(this.getCurrentArrayAlternatives(randomQuestion));
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
            alternativeArea.addEventListener("click", (event) => {
                this.clickAlternative(event.target);
            });

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
        const currentAlternativeCorrect = currentQuiz.respostas[currentQuiz.perguntas.indexOf(this.#currentQuestion)].correta;
        return currentAlternativeCorrect;
    }
    generateNewRandomQuestion(){
        const currentQuiz = this.getCurrentQuiz();
        let randomQuestion = currentQuiz.perguntas[Math.round(Math.random() * (currentQuiz.perguntas.length - 1))];
        if(this.#arrayQuestionsGone.length < currentQuiz.perguntas.length){
            while(this.#arrayQuestionsGone.includes(randomQuestion)){
                randomQuestion = currentQuiz.perguntas[Math.round(Math.random() * (currentQuiz.perguntas.length - 1))];
            }
        }else{
            this.#arrayQuestionsGone = [];
        }
        this.#arrayQuestionsGone.push(randomQuestion);
        this.#currentQuestion = randomQuestion;
        return randomQuestion;
    }
    generateNewRandomAlternative(randomQuestion){
        const currentQuiz = this.getCurrentQuiz();
        const currentArrayAlternatives = this.getCurrentArrayAlternatives(randomQuestion);
        let randomAlternative = currentArrayAlternatives[Math.round(Math.random() * (currentArrayAlternatives.length - 1))];
        if(this.#arrayAlternativesGone.length < currentArrayAlternatives.length){
            while(this.#arrayAlternativesGone.includes(randomAlternative)){
                randomAlternative = currentArrayAlternatives[Math.round(Math.random() * (currentArrayAlternatives.length - 1))];
            }
        }else{
            this.#arrayAlternativesGone = [];
        }
        this.#arrayAlternativesGone.push(randomAlternative);
        return randomAlternative;
    }
    selectAlternative(alternativeChosen){
        this.#alternativesArea.forEach(alternative => alternative.classList.remove("chosen"));
        alternativeChosen.classList.add("chosen");
    }
    deselectAlternative(alternativeChosen){
        if(alternativeChosen !== null){
            if(alternativeChosen.matches(".chosen")){
                alternativeChosen.classList.remove("chosen");
            }
        }
    }
    clickAlternative(alternativeChosen){
        if(!alternativeChosen.matches(".chosen")){
            this.selectAlternative(alternativeChosen);
        }else{
            this.deselectAlternative(alternativeChosen);
        }

        this.verifyConfirmButton();
    }
    verifyConfirmButton(){
        const verify = this.#alternativesArea.some(alternative => alternative.matches(".chosen"));
        if(verify){
            this.#buttonConfirm.classList.remove("disabled");
        }else{
            this.#buttonConfirm.classList.add("disabled");
        }
    }
    verifyNextButton(){
        this.#buttonNext.classList.remove("disabled");
    }
    getScore(){
        return this.#score;
    }
    addScore(){
        this.#score++;
    }
    resetScore(){
        this.#score = 0;
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
        const warning = document.querySelector(".alert");
        warning.remove();
    }
    showAnswers(){
        this.#alternativesArea.forEach((alternative) => {
            if(alternative.innerHTML === this.getCurrentAlternativeCorrect()){
                alternative.classList.add("correct");
            }else{
                alternative.classList.add("incorrect");
            }
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

            if(selectedAlternative.innerHTML === this.getCurrentAlternativeCorrect()){
                const correctWarning = this.showRight();
                modalFooter.insertAdjacentElement("afterbegin", correctWarning);
                this.addScore();
            }else{
                const incorrectWarning = this.showError();
                modalFooter.insertAdjacentElement("afterbegin", incorrectWarning);
            }
            this.showAnswers();
            this.verifyNextButton();
            this.verifyConfirmButton();

        }
    }
    nextQuestion(){
        if(!this.#buttonNext.matches(".disabled")){
            if(this.#arrayQuestionsGone.length < 5){
                if(this.#arrayQuestionsGone.length === 4){
                    this.#buttonNext.innerHTML = "Ver pontuação!";
                }
                this.removeWarning();
                this.generateStructure();
            }else{
                const scoreWarning = this.showScore();
                const container = document.querySelector(".container");
                this.closeModal();
                container.insertAdjacentElement("beforeend", scoreWarning);
            }
            this.#buttonNext.classList.add("disabled");
        }
    }
}