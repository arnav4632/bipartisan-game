import React, { useEffect, useState, useMemo } from "react";
import Ticker from "./components/Ticker";

const goodFeedback = [
    "Bro's literally HIM", "W", "Bro's built diff fr 😮‍😫",
    "Let him cook🗣️🗣️ 👨‍🍳", "Looks like someone knows what they voted for 👀"
];
const badFeedback = [
    "Bro's cooked", "Yikes...", "Bro is on something fr 💀",
    "Nah this ain’t it chief ❌", "Womp womp"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getBackground = (correct, wrong) =>
    `linear-gradient(-45deg, rgba(0, 255, 0, ${Math.min(correct * 10, 100) / 100}) 0%, rgba(255, 0, 0, ${Math.min(wrong * 10, 100) / 100}) 100%)`;

const Game = () => {
    const [bill, setBill] = useState(null);
    const [party, setParty] = useState("");
    const [guessResult, setGuessResult] = useState(null);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [correctStreak, setCorrectStreak] = useState(0);
    const [wrongStreak, setWrongStreak] = useState(0);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [billQueue, setBillQueue] = useState([]);

    const summaryChunks = useMemo(() => {
        if (!bill?.summary) return [];
        return Array.from({ length: Math.ceil(bill.summary.length / 600) }, (_, i) =>
            bill.summary.slice(i * 600, (i + 1) * 600)
        );
    }, [bill]);

    const fetchBills = async () => {
        const res = await fetch("/api/random-bills");
        const data = await res.json();
        setBillQueue(data);
        loadBill(data[0]);
    };

    const loadBill = (b) => {
        setBill({
            title: b.title,
            legislationNumber: b.legislationNumber,
            url: b.url,
            cosponsors: b.cosponsors,
            summary: b.summary
        });
        setParty(b.party);
        setCurrentPage(0);
        window.Party = b.party;
    };

    useEffect(() => {
        if (billQueue.length === 0) fetchBills();
    }, []);

    const handleGuess = (guess) => {
        const correct = guess === party;
        const feedback = getRandom(correct ? goodFeedback : badFeedback);

        setGuessResult({
            message: correct ? `Correct! 🎉 the bill was ${party}` : `Yikes... the bill was ${party}`,
            isCorrect: correct,
            feedback
        });

        setCorrectStreak(correct ? correctStreak + 1 : 0);
        setWrongStreak(correct ? 0 : wrongStreak + 1);
        setCorrectGuesses(correct ? correctGuesses + 1 : correctGuesses);
        setTotalGuesses(totalGuesses + 1);
        setHasGuessed(true);
    };

    const handleNext = () => {
        const nextQueue = billQueue.slice(1);
        setBillQueue(nextQueue);
        setGuessResult(null);
        setHasGuessed(false);
        setBill(null);
        setCurrentPage(0);
        if (nextQueue.length > 0) loadBill(nextQueue[0]);
    };

    const SummaryViewer = () => (
        <div className="mt-4 text-center">
            <div className="bg-gray-200 p-4 rounded-md shadow-md w-full max-w-7xl text-left mx-auto">
                <p className="text-2xl font-semibold text-gray-800 text-center">Summary:</p>
                <p className="text-m">{summaryChunks[currentPage]}</p>
            </div>

            {summaryChunks.length > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                        className={`bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition ${currentPage === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={currentPage === 0}>
                        Previous Page
                    </button>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, summaryChunks.length - 1))}
                        className={`bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition ${currentPage === summaryChunks.length - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={currentPage === summaryChunks.length - 1}>
                        Next Page
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-8" style={{ background: getBackground(correctStreak, wrongStreak) }}>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Let’s Play the Game!</h1>

            <div className="absolute top-4 right-4 text-sm">
                <a href="/data" className="text-blue-600 underline">Where is this data coming from?</a>
            </div>

            <div className="absolute top-4 left-4 text-xl font-semibold text-gray-800">
                <p>Streak: {correctStreak}{correctStreak >= 3 && " 🔥"}</p>
                <p>
                    Accuracy: {totalGuesses === 0 ? "0" : Math.round((correctGuesses / totalGuesses) * 100)}%
                    {(correctGuesses / totalGuesses) >= .8 && " 🔥😎"}
                    {(correctGuesses / totalGuesses) <= .6 && " 😬"}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
                {bill ? (
                    <div className="mb-4 text-center">
                        <p className="text-2xl font-semibold text-gray-800 mb-2">
                            {bill.title || "Untitled bill"}
                        </p>
                        {hasGuessed && (
                            <p><a href={bill.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Read more</a></p>
                        )}
                    </div>
                ) : <p>Loading...</p>}

                {guessResult && (
                    <div className={`mt-4 text-xl font-semibold text-center p-4 rounded-lg ${guessResult.isCorrect ? "bg-green-500" : "bg-red-500"} text-white`}>
                        <p>{guessResult.message}</p>
                        <p>{guessResult.feedback}</p>
                    </div>
                )}

                {isSummaryVisible && <SummaryViewer />}

                <div className="flex justify-center items-center mt-4 gap-6 flex-wrap">
                    <button
                        className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition"
                        onClick={() => setIsSummaryVisible(!isSummaryVisible)}>
                        {isSummaryVisible ? "Hide Summary" : "Show Summary"}
                    </button>

                    <div className="flex gap-4">
                        <button
                            className={`rounded-full px-6 py-3 ${hasGuessed ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            disabled={hasGuessed} onClick={() => handleGuess("Democratic")}>Guess Democrat</button>
                        <button
                            className={`rounded-full px-6 py-3 ${hasGuessed ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-white`}
                            disabled={hasGuessed} onClick={() => handleGuess("Republican")}>Guess Republican</button>
                    </div>

                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-full transition"
                        onClick={handleNext}>Next</button>
                </div>
            </div>

            <div className="absolute bottom-5 w-full left-0">
                <Ticker bgStyle="" />
            </div>
        </div>
    );
};

export default Game;
