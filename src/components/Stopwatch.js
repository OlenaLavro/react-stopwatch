import React, { useState, useEffect } from "react";
import "../App.css";
import { interval, Subject, fromEvent, asyncScheduler } from "rxjs";
import { takeUntil, throttleTime, withLatestFrom } from "rxjs/operators";
import StopwatchDisplay from "./StopwatchDisplay";

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastClickedTimeOnWaitBtn, setLastClickedTimeOnWaitBtn] = useState(0);

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
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

  useEffect(() => {
    const startClick = fromEvent(
      document.getElementById("start-btn"),
      "click"
    ).subscribe(() => setIsRunning(true));

    const resetClick = fromEvent(
      document.getElementById("reset-btn"),
      "click"
    ).subscribe(() => {
      setTime(0);
    });

    return () => {
      startClick.unsubscribe();
      resetClick.unsubscribe();
    };
  }, []);

  return (
    <div className="stopwatch-container">
      <header className="header">Stopwatch</header>

      <main className="main">
        <StopwatchDisplay time={time} />

        <div className="button-list">
          {!isRunning && (
            <button className="button" id="start-btn">
              START
            </button>
          )}
          {isRunning && (
            <button
              className="button"
              id="stop-btn"
              onClick={() => handleStop()}
            >
              STOP
            </button>
          )}
          <button className="button" onClick={() => handleWait()}>
            WAIT
          </button>
          <button className="button" id="reset-btn">
            RESET
          </button>
        </div>
      </main>
    </div>
  );
}

export default Stopwatch;
