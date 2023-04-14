import {Quiz} from "./Quiz";

const backgroundElement = document.querySelector(".bg") as HTMLElement

async function loadQuestions() {
    const res = await fetch("./data/questions.json");

    if(!res.ok) {
        throw new Error("Can't load questions")
    }

    return await res.json();
}

async function startQuiz() {
    const data = await loadQuestions();

    new Quiz(data, backgroundElement);
}

startQuiz();