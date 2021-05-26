import React from "react";
import "../App.css";

function StopwatchDisplay(props) {
  return (
    <div className="stopwatch-wrapper">
      <div className="stopwatch-display">
        <div className="hours">
          {("0" + Math.floor((props.time / (60 * 60)) % 24)).slice(-2)}
        </div>
        <div className="delimiter">:</div>
        <div className="minutes">
          {("0" + Math.floor(props.time / 60)).slice(-2)}
        </div>
        <div className="delimiter">:</div>
        <div className="seconds">
          {("0" + Math.floor(props.time % 60)).slice(-2)}
        </div>
      </div>
    </div>
  );
}

export default StopwatchDisplay;
