export interface Question {
    id: string;
    title: string;
    possibleAnswers: Record<string, string>;
    correctAnswer: string;
}