import {Question} from "./types/Question";
import {createElement} from "./utils/helperFunctions";

export class Quiz {
    private container: HTMLElement;
    private readonly questions: Question[];
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
        const questionEl = this.createTitle(title);

        const answersContainer = this.createAnswerOptions(possibleAnswers);
        answersContainer.addEventListener("click", this.onChooseAnswer.bind(this));

        this.container.replaceChildren(questionEl, answersContainer);
    }

    private createTitle(title: string) {
        return createElement<HTMLDivElement>("div", {className: "container"},
            createElement<HTMLSpanElement>("span", {className: "number"}, `${this.currentQuestionIndex + 1}`),
            createElement<HTMLParagraphElement>("p", {className: "question"}, title)
        );
    }

    private createAnswerOptions(possibleAnswers: Record<string, string>[]) {
        const container = createElement<HTMLDivElement>("div", {className: "option-container"});

        for (let choice in possibleAnswers) {
            const el = createElement<HTMLButtonElement>("button", {className: "option"},
                createElement<HTMLSpanElement>("span", {className: "index"}, choice),
                createElement<HTMLSpanElement>("span", {}, possibleAnswers[choice])
            );

            el.dataset.choice = choice;

            container.appendChild(el);
        }

        return container;
    }

    private onChooseAnswer({target}: MouseEvent) {
        if (target instanceof HTMLButtonElement && target.parentElement !== null) {
            const choice = target.dataset.choice;

            if (choice) {
                this.answers.push(choice);

                document.querySelectorAll("button").forEach(btn => btn.disabled = true);

                this.checkAnswer(target);

                setTimeout(() => {
                    this.nextQuestion();
                }, 1000);
            }
        }
    }

    private nextQuestion() {
        if (this.currentQuestionIndex == this.questions.length - 1) {
            // TODO: Handle end result
            this.displayEndResult();
        } else {
            this.currentQuestionIndex++;
            this.createQuestion(this.questions[this.currentQuestionIndex]);
        }
    }

    private getCountOfCorrectAnswers() {
        let count = 0;

        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i] == this.correctAnswers[i]) {
                count++;
            }
        }

        return count;
    }

    private displayEndResult() {
        const totleQuestions = this.questions.length;
        const correctlyGuessedQuestions = this.getCountOfCorrectAnswers();

        const endSection = createElement<HTMLDivElement>("div", {className: "result-section"},
            createElement<HTMLParagraphElement>("p", {className: "results"}, `${correctlyGuessedQuestions}/${totleQuestions}`),
            createElement<HTMLButtonElement>("button", {className: "option"}, "Try again")
        );

        this.container.replaceChildren(endSection);
    }

    private checkAnswer(button: HTMLButtonElement) {
        const chosedAnswer = this.answers[this.answers.length - 1];
        const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;

        button.style.boxShadow = "none";

        if(chosedAnswer === correctAnswer) {
            button.classList.add("correct")
        } else {
            button.classList.add("wrong");
            (document.querySelector(`[data-choice="${correctAnswer}"]`) as HTMLButtonElement).classList.add("correct");
        }
    }
}