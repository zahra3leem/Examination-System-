export default function initTimer() {
  const minutes = Number(sessionStorage.getItem("Timer"));
  let duration = 1000 * minutes * 60;
  var countdownDisplay = document.getElementById("countdown-display");
  
  let startTime = sessionStorage.getItem("startTime");
  if (!startTime) {
    startTime = new Date().getTime();
    sessionStorage.setItem("startTime", startTime);
  }

  var timer = setInterval(function () {
    var now = new Date().getTime();
    var elapsedTime = now - startTime;
    var remainingTime = duration - elapsedTime;

    var percent = (elapsedTime / duration) * 100;

    // Update progress bar
    var progressBar = document.getElementsByClassName("progress-bar")[0];
    progressBar.style.width = Math.min(100, percent) + "%";

    if (percent >= 70) {
      progressBar.classList.add("bg-danger", "blink");
      countdownDisplay.classList.add("text-danger")
    }

    if (remainingTime <= 0) {
      clearInterval(timer);
      sessionStorage.setItem("scorePage", "RunTimeOut");
      location.replace("../View/score.html");
    } else {
      // Convert remaining time to minutes and seconds
      var minutesLeft = Math.floor(remainingTime / (1000 * 60));
      var secondsLeft = Math.floor((remainingTime % (1000 * 60)) / 1000);
      var minutesFormatted = String(minutesLeft).padStart(2, '0');
      var secondsFormatted = String(secondsLeft).padStart(2, '0');
      // Update the countdown display
      if (countdownDisplay) {
        countdownDisplay.textContent = `${minutesFormatted}:${secondsFormatted}`;
      }
    }
  }, 1000);
}
