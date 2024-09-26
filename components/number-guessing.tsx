"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NumberGuess() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<number | string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [difficultyMode, setDifficultyMode] = useState<string>("");
  const [maxAttempt, setMaxAttempt] = useState<number>(0);
  const [selectAlert, setSelectAlert] = useState<string>("");
  const [range, setRange] = useState<number>(10);
  const [hint, setHint] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (gameStarted && !paused) {
      const randomNumber = Math.floor(Math.random() * range) + 1;
      setTargetNumber(randomNumber);
    }
  }, [gameStarted, paused, range]);

  useEffect(() => {
    if (gameStarted && !paused) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer === 0) {
        setGameOver(true);
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [gameStarted, paused, timer]);

  const startGame = (): void => {
    if (difficultyMode === "") {
      setSelectAlert("Please Select Difficulty Mode");
      return;
    }
    setGameStarted(true);
    setPaused(false);
    setGameOver(false);
    setAttempts(0);
    setSelectAlert("");
    setUserGuess("");
    setTimer(30);
    setHint("");

    switch (difficultyMode) {
      case "easy":
        setMaxAttempt(10);
        break;
      case "medium":
        setMaxAttempt(6);
        break;
      case "hard":
        setMaxAttempt(3);
        break;
      default:
        setMaxAttempt(10);
    }
  };

  const pauseGame = (): void => {
    setPaused(true);
  };

  const resumeGame = (): void => {
    setPaused(false);
  };

  const GameResult = (): void => {
    const parsedUserGuess = Number(userGuess);

    if (!isNaN(parsedUserGuess)) {
      if (parsedUserGuess === targetNumber) {
        setGameOver(true);
        setHint(`Congratulations! You guessed the correct number: ${targetNumber}`);
      } else {
        setAttempts((prevAttempts) => prevAttempts + 1);
        if (parsedUserGuess > targetNumber) {
          setHint("Too high!");
        } else {
          setHint("Too low!");
        }
      }
    }

    if (attempts + 1 >= maxAttempt) {
      setGameOver(true);
    }
  };

  const tryAgain = (): void => {
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
    setDifficultyMode("");
    setSelectAlert("");
    setHint("");
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setUserGuess(parseInt(e.target.value));
  };

  const onDifficultyChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDifficultyMode(e.target.value);
  };

  const toggleTheme = (): void => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-blue-300 to-purple-300"}`}>
      <div className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md transition-transform duration-300 ${darkMode ? "border border-gray-700" : "border border-gray-300"}`}>
        <Button onClick={toggleTheme} className={`font-bold py-2 px-4 rounded mb-4 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">Number Guessing Game</h1>
        <p className="text-center text-gray-600 mb-6">Try to guess the number between 1 and {range}!</p>

        {!gameStarted && (
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <label className="block text-black text-center mb-2">Select Difficulty:</label>
              <div className="flex justify-center space-x-4">
                <label className="text-black">
                  <input type="radio" name="difficultyMode" value="easy" onChange={onDifficultyChange} />
                  Easy (10 attempts)
                </label>
                <label className="text-black">
                  <input type="radio" name="difficultyMode" value="medium" onChange={onDifficultyChange} />
                  Medium (6 attempts)
                </label>
                <label className="text-black">
                  <input type="radio" name="difficultyMode" value="hard" onChange={onDifficultyChange} />
                  Hard (3 attempts)
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-black text-center mb-2">Select Number Range:</label>
              <input
                type="range"
                min="10"
                max="100"
                value={range}
                onChange={(e) => setRange(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-black">Range: 1 - {range}</p>
            </div>
            {selectAlert && <p className="text-center text-red-600">{selectAlert}</p>}
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all">
              Start Game
            </Button>
          </div>
        )}

        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-4">
              {paused ? (
                <Button onClick={resumeGame} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all">
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseGame} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all">
                  Pause
                </Button>
              )}
            </div>
            <div className="flex justify-center mb-4">
              <Input
                type="number"
                value={userGuess}
                onChange={onInputChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs text-black"
                placeholder="Enter your guess"
              />
              <Button
                onClick={GameResult}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4 transition-all"
              >
                Guess
              </Button>
            </div>
            <div className="text-center text-black">
              <p>Attempts: {attempts}</p>
              <p>Max Attempts: {maxAttempt}</p>
              <p className={`font-bold text-xl ${hint.includes("Congratulations") ? "text-green-600" : "text-red-600"}`}>{hint}</p>
              <p>Time left: {timer} seconds</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div>
            <div className="text-center mb-4 text-black">
              <p className={`font-bold text-xl ${hint.includes("Congratulations") ? "text-green-600" : "text-red-600"}`}>{hint}</p>
            </div>
            <Button onClick={tryAgain} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all">
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Added "Made by Aaraiz" footer */}
      <footer className="mt-4 text-center text-gray-500">
        <p className="text-sm">Made by Aaraiz</p>
      </footer>
    </div>
  );
}
