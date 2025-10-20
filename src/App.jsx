import { useEffect, useState } from "react";
import "./App.css";

import showNotification from "./utils/notification";
import playBeep from "./utils/playAudio";

function App() {
  const DEFAULT_TIME = 25 * 60;
  const DEFAULT_BREAK = 5 * 60;

  const [defaultDuration, setDefaultDuration] = useState(() => {
    const stored = localStorage.getItem("defaultDuration");
    return stored ? parseInt(stored, 10) : DEFAULT_TIME;
  });

  const [defaultBreakDuration, setDefaultBreakDuration] = useState(() => {
    const stored = localStorage.getItem("defaultBreakDuration");
    return stored ? parseInt(stored, 10) : DEFAULT_BREAK;
  });

  const [sessionCount, setSessionCount] = useState(() => {
    const stored = localStorage.getItem("sessionCount");
    return stored ? parseInt(stored, 10) : 0;
  });

  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const toggleStart = () => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
    setIsRunning((prev) => !prev);
  }

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(defaultDuration);
  };

  const resetSessionCount = () => {
    setSessionCount(0);
    localStorage.setItem("sessionCount", 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    let intervalId;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playBeep();
      showNotification(isBreak ? 'Work Session Started!' : 'Break time!');

      if (isBreak) {
        setTimeLeft(defaultDuration);
        setIsBreak(false);
      } else {
        setTimeLeft(defaultBreakDuration);
        setIsBreak(true);

        setSessionCount((prevCount) => {
          const newCount = prevCount + 1;
          localStorage.setItem("sessionCount", newCount);
          return newCount;
        });
      }

      setTimeout(() => setIsRunning(true), 1000); // 1 sec delay before starting next session
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, isBreak, defaultDuration, defaultBreakDuration]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6">Pomodoro Timer</h1>

      <div className="text-2xl font-bold mb-4">
        Mode:{" "}
        <span className={isBreak ? "text-green-400" : "text-red-500"}>
          {isBreak ? "Break" : "Work"}
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">
          Session Count: <span className="text-yellow-400">{sessionCount}</span>
        </div>
        <button
          onClick={resetSessionCount}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 mx-5 rounded transition"
        >
          Reset Session Count
        </button>
      </div>

      <div className="mb-6 flex justify-around items-center gap-4">
        <div className="text-left">
          <label htmlFor="work-length" className="block text-lg font-medium">
            Work (min)
          </label>
          <input
            id="work-length"
            type="number"
            min={1}
            max={120}
            disabled={isRunning}
            value={defaultDuration / 60}
            onChange={(e) => {
              const newMinutes = parseInt(e.target.value, 10);
              if (!isNaN(newMinutes)) {
                const newDuration = newMinutes * 60;
                setDefaultDuration(newDuration);
                if (!isBreak) {
                  setTimeLeft(newDuration);
                }
                localStorage.setItem("defaultDuration", newDuration);
              }
            }}
            className="w-20 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="text-left">
          <label htmlFor="break-length" className="block text-lg font-medium">
            Break (min)
          </label>
          <input
            id="break-length"
            type="number"
            min={1}
            max={60}
            disabled={isRunning}
            value={defaultBreakDuration / 60}
            onChange={(e) => {
              const newMinutes = parseInt(e.target.value, 10);
              if (!isNaN(newMinutes)) {
                const newDuration = newMinutes * 60;
                setDefaultBreakDuration(newDuration);
                if (isBreak) {
                  setTimeLeft(newDuration);
                }
                localStorage.setItem("defaultBreakDuration", newDuration);
              }
            }}
            className="w-20 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className={`mb-8 text-7xl font-mono font-bold select-none ${
          isBreak ? "text-green-500" : "text-red-500"
        }`}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="space-x-4">
        <button
          onClick={toggleStart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg font-semibold transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          disabled={!isRunning && timeLeft === defaultDuration}
          className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded text-lg font-semibold transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
