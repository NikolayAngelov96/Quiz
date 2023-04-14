import {Question} from "./types/Question";
import {createElement} from "./utils/helperFunctions";

export class Quiz {
    private container: HTMLElement;
    private questions: Question[];
    private answers: string[];
    private correctAnswers!: string[];
    private currentQuestionIndex: number;

    constructor(data: Question[], backgroundContainer: HTMLElement) {
        this.container = backgroundContainer;
        this.questions = data;
        this.answers = [];
        this.currentQuestionIndex = 0;

        this.generateCorrectAnswers();
        this.createQuestion(this.questions[this.currentQuestionIndex]);
    }

    private generateCorrectAnswers() {
        this.correctAnswers = [];

        for (let question of this.questions) {
            this.correctAnswers.push(question.correctAnswer);
        }
    }

    private createQuestion({title, possibleAnswers}: Question) {
        const questionEl = createElement<HTMLDivElement>("div", {className: "container"},
            createElement<HTMLSpanElement>("span", {className: "number"}, `${this.currentQuestionIndex + 1}`),
            createElement<HTMLParagraphElement>("p", {className: "question"}, title)
        );

        const answersContainer = createElement<HTMLDivElement>("div", {className: "option-container"});

        for (let choice in possibleAnswers) {
            const el = createElement<HTMLButtonElement>("button", {className: "option"},
                createElement<HTMLSpanElement>("span", {className: "index"}, choice),
                createElement<HTMLSpanElement>("span", {}, possibleAnswers[choice])
            );

            el.dataset.choice = choice;

            answersContainer.appendChild(el);
        }

        this.container.replaceChildren(questionEl, answersContainer);
    }
}