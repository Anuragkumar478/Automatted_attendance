import React, { useState, useEffect, useRef } from "react";

const StudentAttendance = () => {
  const [rollNumber, setRollNumber] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const timerRef = useRef(null);
  const rollNumberRef = useRef(null);
  const scoreRef = useRef(null);

  // Function to generate random roll numbers (1-50)
  const generateRollNumber = () => {
    return Math.floor(Math.random() * 50) + 1;
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setRollNumber(generateRollNumber());
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerRef.current);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameStarted, timeLeft, gameOver, score, highScore]);

  // Handle button clicks with animations
  const handleClick = (choice) => {
    if (gameOver || !gameStarted) return;

    // Add animation to roll number container
    if (rollNumberRef.current) {
      rollNumberRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        if (rollNumberRef.current) {
          rollNumberRef.current.classList.remove("animate-pulse");
        }
      }, 300);
    }

    // Add score animation
    if (scoreRef.current) {
      scoreRef.current.classList.add("animate-bounce");
      setTimeout(() => {
        if (scoreRef.current) {
          scoreRef.current.classList.remove("animate-bounce");
        }
      }, 300);
    }

    // Show feedback
    let points = 0;
    let message = "";
    
    if (choice === "present") {
      points = 1 + Math.floor(streak / 3); // Bonus points for streaks
      setStreak(streak + 1);
      message = `Present! +${points}`;
      setScore(score + points);
    } else {
      points = -1;
      setStreak(0);
      message = `Absent! ${points}`;
      setScore(score + points);
    }
    
    setFeedback(message);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);

    // Generate new roll number
    setRollNumber(generateRollNumber());
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setStreak(0);
    setGameStarted(true);
    setRollNumber(generateRollNumber());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
          🎓 Attendance Challenge
        </h1>
        
        {!gameStarted ? (
          <div className="text-center animate-fade-in">
            <p className="text-lg mb-6">Mark students present as quickly as you can!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Game
            </button>
            {highScore > 0 && (
              <p className="mt-6 text-yellow-300">High Score: {highScore}</p>
            )}
          </div>
        ) : !gameOver ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-center bg-black/30 rounded-xl p-3 flex-1 mr-2">
                <p className="text-sm opacity-80">Time</p>
                <p className={`text-2xl font-mono ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
                  {timeLeft}s
                </p>
              </div>
              <div className="text-center bg-black/30 rounded-xl p-3 flex-1 mx-2">
                <p className="text-sm opacity-80">Score</p>
                <p ref={scoreRef} className="text-2xl font-mono text-yellow-400">
                  {score}
                </p>
              </div>
              <div className="text-center bg-black/30 rounded-xl p-3 flex-1 ml-2">
                <p className="text-sm opacity-80">Streak</p>
                <p className="text-2xl font-mono text-pink-400">
                  {streak}x
                </p>
              </div>
            </div>

            <div 
              ref={rollNumberRef}
              className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-inner p-8 mb-6 text-center border border-white/10 transition-all duration-300"
            >
              <h2 className="text-sm uppercase tracking-widest opacity-70">Roll Number</h2>
              <p className="text-6xl font-bold mt-2 text-white">{rollNumber}</p>
            </div>

            <div className="flex justify-around mb-4">
              <button
                onClick={() => handleClick("present")}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <span className="mr-2">✅</span> Present
              </button>
              <button
                onClick={() => handleClick("absent")}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-lg font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <span className="mr-2">❌</span> Absent
              </button>
            </div>

            {showFeedback && (
              <div className={`text-center mt-4 text-xl font-bold animate-bounce ${feedback.includes("+") ? "text-green-400" : "text-red-400"}`}>
                {feedback}
              </div>
            )}
          </>
        ) : (
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-red-300">⏰ Time's Up!</h2>
            <div className="bg-black/20 rounded-2xl p-6 mb-6">
              <p className="text-lg mb-2">Final Score</p>
              <p className="text-5xl font-bold text-yellow-400">{score}</p>
              {score > highScore && (
                <p className="mt-2 text-green-400 animate-pulse">New High Score! 🎉</p>
              )}
            </div>
            <button
              onClick={restartGame}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg mb-4"
            >
              Play Again
            </button>
            <p className="text-sm opacity-70 mt-4">High Score: {highScore}</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentAttendance;