import React, { useEffect, useState } from "react";
import Ticker from "./components/Ticker";

const goodFeedback = [
    "Bro's literally HIM", "W", "Bro's built diff fr 😮‍💨",
    "Let him cook🗣️🗣️ 👨‍🍳", "Looks like someone knows what they voted for 👀"
];
const badFeedback = [
    "Bro's cooked", "Yikes...", "Bro is on something fr 💀",
    "Nah this ain’t it chief 🚫", "Womp womp"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getBackground = (correct, wrong) =>
    `linear-gradient(-45deg, rgba(0, 255, 0, ${Math.min(correct * 10, 100) / 100}) 0%, rgba(255, 0, 0, ${Math.min(wrong * 10, 100) / 100}) 100%)`;

const Game = () => {
    const [state, setState] = useState({
        bill: null,
        party: "",
        guessResult: null,
        hasGuessed: false,
        correctStreak: 0,
        wrongStreak: 0,
        correctGuesses: 0,
        totalGuesses: 0,
        summaryChunks: [],
        currentPage: 0,
        isSummaryVisible: false,
        key: 0,
    });

    const [billQueue, setBillQueue] = useState([]);

    const fetchBills = async () => {
        const res = await fetch("/api/random-bills");
        const data = await res.json();
        setBillQueue(data);
        loadBill(data[0]);
    };

    const loadBill = (bill) => {
        const summary = bill.summary;
        const chunks = Array.from({ length: Math.ceil(summary.length / 600) }, (_, i) =>
            summary.slice(i * 600, (i + 1) * 600)
        );

        setState((s) => ({
            ...s,
            bill: {
                title: bill.title,
                legislationNumber: bill.legislationNumber,
                url: bill.url,
                cosponsors: bill.cosponsors,
                summary
            },
            party: bill.party,
            summaryChunks: chunks,
        }));

        window.Party = bill.party;
    };

    useEffect(() => {
        if (billQueue.length === 0) {
            fetchBills();
        } else {
            loadBill(billQueue[0]);
        }
    }, [state.key]);

    const handleGuess = (guess) => {
        const correct = guess === state.party;
        const feedback = getRandom(correct ? goodFeedback : badFeedback);

        setState((s) => ({
            ...s,
            guessResult: {
                message: correct
                    ? `Correct! 🎉 the bill was ${s.party}`
                    : `Yikes... the bill was ${s.party}`,
                isCorrect: correct,
                feedback,
            },
            correctStreak: correct ? s.correctStreak + 1 : 0,
            wrongStreak: correct ? 0 : s.wrongStreak + 1,
            correctGuesses: correct ? s.correctGuesses + 1 : s.correctGuesses,
            totalGuesses: s.totalGuesses + 1,
            hasGuessed: true,
        }));
    };

    const handleNext = () => {
        const newQueue = billQueue.slice(1);
        setBillQueue(newQueue);
        setState((s) => ({
            ...s,
            guessResult: null,
            hasGuessed: false,
            bill: null,
            summaryChunks: [],
            currentPage: 0,
            key: s.key + 1,
        }));
    };

    const showSummary = () => (
        <div className="mt-4 text-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md w-full max-w-7xl text-left mx-auto">
                <p className="text-2xl font-semibold text-gray-800 text-center">Summary:</p>
                <p className="text-m">{state.summaryChunks[state.currentPage]}</p>
            </div>

            {state.summaryChunks.length > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setState(s => ({ ...s, currentPage: Math.max(s.currentPage - 1, 0) }))}
                        className={`bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition ${state.currentPage === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={state.currentPage === 0}>
                        Previous Page
                    </button>
                    <button
                        onClick={() => setState(s => ({ ...s, currentPage: Math.min(s.currentPage + 1, s.summaryChunks.length - 1) }))}
                        className={`bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition ${state.currentPage === state.summaryChunks.length - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={state.currentPage === state.summaryChunks.length - 1}>
                        Next Page
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-8" style={{ background: getBackground(state.correctStreak, state.wrongStreak) }}>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Let’s Play the Game!</h1>

            <div className="absolute top-4 right-4 text-sm">
                <a href="/data" className="text-blue-600 underline">Where is this data coming from?</a>
            </div>

            <div className="absolute top-4 left-4 text-xl font-semibold text-gray-800">
                <p>Streak: {state.correctStreak}{state.correctStreak >= 3 && " 🔥"}</p>
                <p>
                    Accuracy: {state.totalGuesses === 0 ? "0" : Math.round((state.correctGuesses / state.totalGuesses) * 100)}%
                    {(state.correctGuesses / state.totalGuesses) >= .8 && " 🔥😎"}
                    {(state.correctGuesses / state.totalGuesses) <= .6 && " 😬"}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
                {state.bill ? (
                    <div className="mb-4 text-center">
                        <p className="text-2xl font-semibold text-gray-800 mb-2">
                            {state.bill.title || "Untitled bill"}
                        </p>
                        {state.hasGuessed && (
                            <p><a href={state.bill.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Read more</a></p>
                        )}
                    </div>
                ) : <p>Loading...</p>}

                {state.guessResult && (
                    <div
                        className={`mt-4 text-xl font-semibold text-center p-4 rounded-lg ${state.guessResult.isCorrect ? "bg-green-500" : "bg-red-500"} text-white`}
                    >
                        <p>{state.guessResult.message}</p>
                        <p>{state.guessResult.feedback}</p>
                    </div>
                )}

                {state.isSummaryVisible && showSummary()}

                <div className="flex justify-center items-center mt-4 gap-6 flex-wrap">
                    <button
                        className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition"
                        onClick={() => setState(s => ({ ...s, isSummaryVisible: !s.isSummaryVisible }))}>
                        {state.isSummaryVisible ? "Hide Summary" : "Show Summary"}
                    </button>

                    <div className="flex gap-4">
                        <button className={`rounded-full px-6 py-3 ${state.hasGuessed ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            disabled={state.hasGuessed} onClick={() => handleGuess("Democratic")}>
                            Guess Democrat
                        </button>
                        <button className={`rounded-full px-6 py-3 ${state.hasGuessed ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-white`}
                            disabled={state.hasGuessed} onClick={() => handleGuess("Republican")}>
                            Guess Republican
                        </button>
                    </div>

                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-full transition"
                        onClick={handleNext}>
                        Next
                    </button>
                </div>
            </div>

            <div className="absolute bottom-5 w-full left-0">
                <Ticker bgStyle=""></Ticker>
            </div>
        </div>
    );
};

export default Game;
