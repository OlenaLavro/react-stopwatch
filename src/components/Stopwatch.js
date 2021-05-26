import React, { useState, useEffect } from "react";
import "../App.css";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import StopwatchDisplay from "./StopwatchDisplay";

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastClickedTimeOnWaitBtn, setLastClickedTimeOnWaitBtn] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(0);
  };

  const handleWait = () => {
    const timeNow = new Date().getTime();
    if (timeNow - lastClickedTimeOnWaitBtn < 300) {
      setIsRunning(false);
    }

    setLastClickedTimeOnWaitBtn(timeNow);
  };

  useEffect(() => {
    const unsubscribe = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe))
      .subscribe(() => {
        if (isRunning) {
          setTime((value) => value + 1);
        }
      });
    return () => {
      unsubscribe.next();
      unsubscribe.complete();
    };
  }, [isRunning]);

  return (
    <div className="stopwatch-container">
      <header className="header">Stopwatch</header>

      <main className="main">
        <StopwatchDisplay time={time} />

        <div className="button-list">
          {!isRunning && (
            <button className="button" onClick={() => handleStart()}>
              START
            </button>
          )}
          {isRunning && (
            <button className="button" onClick={() => handleStop()}>
              STOP
            </button>
          )}
          <button className="button" onClick={() => handleWait()}>
            WAIT
          </button>
          <button className="button" onClick={() => handleReset()}>
            RESET
          </button>
        </div>
      </main>
    </div>
  );
}

export default Stopwatch;
