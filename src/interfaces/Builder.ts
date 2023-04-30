export interface Builder {
    addTitle(title: string, questionNumber: number): Builder;
    addOptions(possibleAnswers: Record<string, string>, callbackListener: (e: MouseEvent) => void): Builder;
    addAnswerInput(onSubmitEventListener: (e: SubmitEvent) => void): Builder;
    getQuestion(): HTMLDivElement;
    reset(): void;
}