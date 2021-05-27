import React, { useState, useEffect } from "react";
import "../App.css";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, buffer, filter, debounceTime, map } from "rxjs/operators";
import StopwatchDisplay from "./StopwatchDisplay";

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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
    const startClick$ = fromEvent(
      document.getElementById("start-btn"),
      "click"
    ).subscribe(() => setIsRunning(true));

    const resetClick$ = fromEvent(
      document.getElementById("reset-btn"),
      "click"
    ).subscribe(() => {
      setTime(0);
    });

    const stopClick$ = fromEvent(
      document.getElementById("stop-btn"),
      "click"
    ).subscribe(() => {
      setIsRunning(false);
      setTime(0);
    });

    const waitEvent$ = fromEvent(document.getElementById("wait-btn"), "click");
    const buffWaitClick$ = waitEvent$.pipe(debounceTime(300));
    const waitClick$ = waitEvent$.pipe(
      buffer(buffWaitClick$),
      map((list) => {
        return list.length;
      }),
      filter((x) => x === 2)
    );
    waitClick$.subscribe(() => {
      setIsRunning(false);
    });

    return () => {
      startClick$.unsubscribe();
      stopClick$.unsubscribe();
      resetClick$.unsubscribe();
      waitClick$.unsubscribe();
    };
  }, []);

  return (
    <div className="stopwatch-container">
      <header className="header">Stopwatch</header>

      <main className="main">
        <StopwatchDisplay time={time} />

        <div className="button-list">
          {true && (
            <button className="button" id="start-btn">
              START
            </button>
          )}
          {true && (
            <button className="button" id="stop-btn">
              STOP
            </button>
          )}
          <button className="button" id="wait-btn">
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
