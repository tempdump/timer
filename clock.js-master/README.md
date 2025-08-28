# Digital Clock

-   Simple digital clock made with JavaScript that
    doesn't require any JQuery library

# Usage

-   Copy the minified version from dist folder in your scripts or javascript folder
-   Import the script at the buttom of your HTML page :

```html
<script src="./scripts/clock.min.js"></script>
```

-   Use this div where you want to display the clock :

```html
<div class="clock"></div>
```
Description:
Digital Clock is a small JavaScript library that adds a retro LED-style 7-segment digital clock to your website. Supports both 12-hour and 24-hour display modes.

How to use it:
1. Download the clock.min.js file and include it in your HTML document:

<script src="/path/to/clock.min.js"></script>
2. Add a div element with the class “clock” to your HTML where you want the clock to appear:

<div class="clock"></div>
3. By default, the clock uses the 24-hour format. You can dynamically change the hour mode by clicking the click.

load () {
  for( let i = 0; i < this.clockElement.length; i++ ) { this.clockElement[i].innerHTML = svgClock; this.clockElement[i].setAttribute('mode', '12h'); this.clockElement[i].childNodes[1].getElementById('modeControlArea').addEventListener('click', event => {
          this.changeHourMode(event.target.parentNode.parentNode);
      });
  }
}
How it works:
The Clock class handles the creation, display, and animation of the digital clock.

The svgClock constant holds the SVG markup for the clock’s structure. It consists of paths and ellipses that form the segments of the digits and the separating dots. Each segment and dot has a unique ID for manipulation.

The Clock class utilizes the setInterval function to update the clock display every second (clock.tick()) and animate the separating dots every 500 milliseconds (clock.separators()).

The tick function updates the time, hour mode, and calls display functions for hours, minutes, and seconds.

The display functions (displayHours, displayMinutes, displaySeconds) use helper functions (segment1 through segment6) to control the opacity of individual SVG elements, effectively turning segments on or off to represent the correct digits.

The segmentOn and segmentOff properties control the brightness of active and inactive segments.

The hourMode function manages the display of the 12h/24h indicator and the AM/PM indicator if in 12h mode. It manipulates the opacity of the relevant SVG segments.

The changeHourMode function allows for dynamic switching between 12h and 24h modes.
