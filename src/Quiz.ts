import {Question} from "./interfaces/Question";
import {createElement} from "./utils/helperFunctions";
import {Builder} from "./interfaces/Builder";

export class Quiz {
    private container: HTMLElement;
    private readonly questions: Question[];
    private answers: string[];
    private correctAnswers!: string[];
    private currentQuestionIndex: number;

    private builder: Builder;

    constructor(data: Question[], backgroundContainer: HTMLElement, builder: Builder) {
        this.container = backgroundContainer;
        this.questions = data;
        this.answers = [];
        this.currentQuestionIndex = 0;

        this.builder = builder;

        this.generateCorrectAnswers();
        this.createQuestion(this.questions[this.currentQuestionIndex]);
    }

    private generateCorrectAnswers() {
        this.correctAnswers = [];

        for (let question of this.questions) {
            this.correctAnswers.push(question.correctAnswer);
        }
    }

    private createQuestion(questionData: Question) {
        let question: HTMLDivElement;

        if(this.isQuestionWithOptions(questionData)) {
            question = this.createQuestionWithOptions(questionData);
        } else {
            question = this.createOpenEndedQuestion(questionData);
        }

        this.container.replaceChildren(question);
    }


    private createQuestionWithOptions({title, possibleAnswers}: Question): HTMLDivElement {
        return this.builder
            .addTitle(title, this.currentQuestionIndex + 1)
            .addOptions(possibleAnswers, this.onChooseAnswer.bind(this))
            .getQuestion();
    }

    private createOpenEndedQuestion({title}: Question) {
        return this.builder
            .addTitle(title, this.currentQuestionIndex + 1)
            .addAnswerInput(this.onFormSubmit.bind(this))
            .getQuestion();
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

    private onFormSubmit(e: SubmitEvent) {
        e.preventDefault();

        console.log("IT works");
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

        if (chosedAnswer === correctAnswer) {
            button.classList.add("correct")
        } else {
            button.classList.add("wrong");
            (document.querySelector(`[data-choice="${correctAnswer}"]`) as HTMLButtonElement).classList.add("correct");
        }
    }

    private isQuestionWithOptions(question: Question): boolean {
        return "possibleAnswers" in question;
    }
}