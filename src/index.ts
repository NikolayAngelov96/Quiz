import {Quiz} from "./Quiz";
import {Question} from "./interfaces/Question";
import {QuestionBuilder} from "./QuestionBuilder";

const backgroundElement = document.querySelector(".bg") as HTMLElement

async function loadQuestions(): Promise<Question[]> {
    const res = await fetch("./data/questions.json");

    if(!res.ok) {
        throw new Error("Can't load questions")
    }

    return await res.json();
}

async function startQuiz() {
    const data = await loadQuestions();
    
    const builder = new QuestionBuilder();
    new Quiz(data, backgroundElement, builder);
}

startQuiz();