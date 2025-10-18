import { useEffect, useState } from "react";

function App() {
  const DEFAULT_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const toggleStart = () => setIsRunning(isRunning => !isRunning);

  const formatTime = time => {
    const minutes = Math.floor(time/60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    let intervalId;

    if(isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId); 
  }, [isRunning, timeLeft]);

  return (
    <div style={{textAlign: 'center'}} className="">
      <h1>Pomodoro Timer</h1>
      <h1 className="timer">{formatTime(timeLeft)}</h1>
      <button
        onClick={toggleStart}
      >{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  );
}

export default App;
