# rounded-clock
Simple Rounded Clock With HTML, CSS And Javascript,
Description:
A modern digital clock with a circular countdown representing how many seconds are left to the next minute.

How to use it:
1. Build the HTML for the clock.

<div class="box">
  <!-- countdown circle -->
  <svg class="clock-container">
    <circle class="clock-shape"></circle>
    <circle class="clock-shape main-circle"></circle>
  </svg>
  <!-- digital clock -->
  <div class="content">
    <span class="time hour">
      12
    </span>
    <b class="colon">:</b>
    <span class="time min">
      00
    </span>
  </div>
</div>
2. The required CSS styles for the clock.

/* required font */
@font-face {
  font-family: 'DS-DIGI';
  src: url('DS-DIGI.TTF');
}
/* override variables here  */
:root {
  --clockSize: 30rem;
  --bgColor: #111;
  --mainColor: #37f;
  --loadingSize: 0;
  --dashArray: 876;
}
body {
  background: var(--bgColor);
  font-family: 'DS-DIGI', sans-serif;
}
/* clock styles here  */
.box {
  margin: 0;
  padding: 0;
  position: relative;
  margin-top: 10rem;
}
.clock-container {
  background: transparent;
  margin: 0;
  padding: 0;
  width: var(--clockSize);
  height: var(--clockSize);
  display: flex;
  align-items: center;
  justify-content: center;
}
.clock-shape {
  fill: transparent;
  stroke-width: calc(var(--clockSize) * 0.05);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-dasharray: var(--dashArray);
  stroke-dashoffset: 0;
  stroke-linecap: round;
  transition: 1s;
}
.main-circle {
  stroke: var(--mainColor);
  stroke-dashoffset: calc(var(--dashArray) - (var(--dashArray) * (var(--loadingSize) / 60)));
}
.content {
  color: var(--mainColor);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5.5rem;
}
.sec {
  animation: secAnimation 1s infinite;
}
@keyframes secAnimation {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}
3. The JavaScript to enable the clock.

'use strict';
function resizeClock() {
  // COLLECTING ALL DATAS FROM HTML
  var circle = document.querySelectorAll('.clock-shape');
  var clockSize = getComputedStyle(document.documentElement).getPropertyValue('--clockSize');
  var circleSize = 'calc(' + clockSize + ' / 2)';
  var circleRadius = 'calc((' + clockSize + ' / 2) - 1rem)';
  // RESIZING THE CIRCLE SIZE ACRODING TO THE SVG SIZE
  for (let i = 0; i < circle.length; i++) {
    circle[i].setAttribute('cy', circleSize);
    circle[i].setAttribute('cx', circleSize);
    circle[i].setAttribute('r', circleRadius);
  }
}
clockFun()
function clockFun() {
  // GETTING THE TIME
  let time = new Date();
  let hour = time.getHours();
  let sec = time.getSeconds();
  let min = time.getMinutes();
  // STYLING THE HOURS AND MINUTES
  hour = (hour > 12) ? hour - 12 : hour;
  hour = (hour < 10) ? '0' + hour : hour;
  min = (min < 10) ? '0' + min : min;
  // UPDATEING THE CIRCLE LOADER VALUE WITH SECONDS
  document.documentElement.style.setProperty('--loadingSize', sec);
  // SELECTING THE HOUR, MINUTE AND COLON
  const hourTxt = document.querySelector('.hour');
  const minTxt = document.querySelector('.min');
  var colon = document.querySelector('.colon');
  // UPDATING THEM WITH HOUR AND MINUTE VALUE
  hourTxt.innerHTML = hour;
  minTxt.innerHTML = min;
  // ADDING SIMPLE SECOND EFFECT TO THE COLON
  if (!colon.classList.contains('sec')) {
    colon.classList.add('sec')
  }
  // CALLING THIS FUNCTION TO UP TO DATE THE TIME
  setInterval(clockFun, 1000);
}
