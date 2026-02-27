/* eslint-disable no-console */

import axios from "axios";

interface Answer {
    index: number;
    text: string;
}

interface AwarenessAnswer extends Answer {
    isCorrect?: boolean;
}

interface FreetimeAnswer extends Answer {
    followerReward: number;
    moneyReward: number;
    partyReward: number;

    successProbability: number;
    successText: string;
    failureText: string;
}

interface MultipleAnswer extends FreetimeAnswer {
    insightRequirement: number;
}

interface Question {
    id: string;
    isTutorial: boolean;
    text: string;
    insightReward: number;
}

interface AwarnessQuestion extends Question {
    type: "awareness";
    answers: AwarenessAnswer[];
}

interface FreetimeQuestion extends Question {
    type: "freetime";
    answers: FreetimeAnswer[];
}

interface MultipleQuestion extends Question {
    type: "multiple";
    answers: MultipleAnswer[];
}

interface ForecastQuestion extends Question {
    type: "forecast";
    minValueText: string;
    maxValueText: string;
}

type QuestionType = AwarnessQuestion | ForecastQuestion | FreetimeQuestion | MultipleQuestion;

async function main(): Promise<void>
{
    const response = await axios.get<QuestionType[]>("/questions.json");
    const questions = response.data;
    /* for (const question of questions)
    {
        if (question.type != "awareness") { continue; }
        console.log("Domanda: " + question.text);
        for (const answer of question.answers)
        {
            if (!answer.isCorrect) { continue; }
            console.log("Risposta: " + answer.text);
        }
    } */

    let followerRewardSum = 0;
    for (const question of questions)
    {
        if (question.type === "awareness") { continue; }
        if (question.type === "forecast") { continue; }

        for (const answer of question.answers)
        {
            if (answer.successProbability >= 0.5) { continue; }
            followerRewardSum += answer.followerReward;
        }
    }
    console.log("Somma: " + followerRewardSum);
}

main();
