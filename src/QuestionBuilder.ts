import {Builder} from "./interfaces/Builder";
import {createElement} from "./utils/helperFunctions";

export class QuestionBuilder implements Builder {
    private question!: HTMLDivElement;

    constructor() {
        this.reset();
    }

    public addTitle(title: string, questionNumber: number): QuestionBuilder {
        const element = createElement<HTMLDivElement>("div", {className: "container"},
            createElement<HTMLSpanElement>("span", {className: "number"}, `${questionNumber}`),
            createElement<HTMLParagraphElement>("p", {className: "question"}, title)
        );

        this.question.appendChild(element);

        return this;
    }

    public addOptions(possibleAnswers: Record<string, string>, callbackListener: (e: MouseEvent) => void): QuestionBuilder {
        const container = createElement<HTMLDivElement>("div", {className: "option-container"});

        for (let choice in possibleAnswers) {
            const el = createElement<HTMLButtonElement>("button", {className: "option"},
                createElement<HTMLSpanElement>("span", {className: "index"}, choice),
                createElement<HTMLSpanElement>("span", {}, possibleAnswers[choice])
            );

            el.dataset.choice = choice;

            container.appendChild(el);
        }

        container.addEventListener("click", callbackListener);

        this.question.appendChild(container);

        return this;
    }

    public addAnswerInput(onSubmitEventListener: (e: SubmitEvent) => void): QuestionBuilder {
        const form = createElement<HTMLFormElement>("form", {className: "form"},
            createElement<HTMLInputElement>("input", {className: "answer-input"}),
            createElement<HTMLButtonElement>("button", {}, "Submit")
        );

        form.addEventListener("submit", onSubmitEventListener);

        this.question.appendChild(form);

        return this;
    }

    public reset() {
        this.question = createElement<HTMLDivElement>("div");
    }

    public getQuestion(): HTMLDivElement {
        const element = this.question;
        this.reset();
        return element;
    }
}