quizJson.forEach((quiz) => {
    const createLi = document.createElement("li");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    
    if(quiz.categoria === "Variedades"){
        createLi.classList.add("active")
    }
    createLi.classList.add("dropdown-item");
    createLi.setAttribute("data-index", quizJson.indexOf(quiz));
    createLi.innerHTML = `Quiz de ${quiz.categoria}`;
    
    dropdownMenu.insertAdjacentElement("beforeend", createLi);
});

const buttonStartQuiz = document.querySelector("#buttonStartQuiz");
const buttonClose = document.querySelector(".btn-danger");
const buttonConfirm = document.querySelector(".btn-info");
const buttonNext = document.querySelector(".btn-success");
const quizzes = document.querySelectorAll(".dropdown-item");
const quizActive = document.querySelector(".dropdown-item.active");

const quiz = new Quiz(quizzes, quizActive, buttonStartQuiz, buttonClose, buttonConfirm, buttonNext);

quiz.generateStructure();
