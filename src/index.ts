import {Quiz} from "./Quiz";
import {Question} from "./types/Question";

const backgroundElement = document.querySelector(".bg") as HTMLElement

async function loadQuestions(): Promise<Question[]> {
    const res = await fetch("./data/music.json");

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