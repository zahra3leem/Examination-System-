// Import necessary functions from other files
import { isLoggedIn } from "./setGetUser.js";
import timer from "./timer.js";
import test from "./test.js";
import { logoutUser } from "./setGetUser.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in and redirect to the login page if not
  if (!isLoggedIn("student")) {
    window.location.href = "login.html";
  }
  timer();
  test();
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
});
