import { isLoggedIn, getLogInUser } from "./setGetUser.js";
import { loadExam } from "./Exams.js";
import { logoutUser } from "./setGetUser.js";

function loadTests() {
  const testsDiv = document.querySelector(".testss");
  let testsArr = JSON.parse(localStorage.getItem("tests")) || [];

  // Clear existing content in the testsDiv to prevent duplication
  testsDiv.innerHTML = "";

  testsArr.forEach((test) => {
    const testDiv = document.createElement("div");
    testDiv.className = "col-md-4";
    const innerDiv = document.createElement("div");
    innerDiv.className = "card mb-4";
    const img = document.createElement("img");
    img.className = "card-img-top";
    img.style.boxShadow = "5px 0px 8px #eeeeee";

    img.src = test.img;

    const card = document.createElement("div");
    //style="  box-shadow: 5px 5px 5px #eeee,-5px -5px -5px #eeee;
    card.style.boxShadow = "5px 5px 5px #eeeeee";
    card.className = "card-body";
    card.innerHTML = `
      <h5 class="card-title">${test.name}</h5>
      <p class="card-text"><strong>Type:</strong> ${test.type}</p>
      <p class="card-text"><strong>Duration:</strong> ${test.timer} minutes</p>
      <p class="card-text"><strong>Questions:</strong> ${test.numOfQuestions}</p>
      <p class="card-text"><strong>Difficulty:</strong> ${test.difficulty}</p>`;
    const div = document.createElement("div");
    div.className = "d-flex justify-content-end";
    const a = document.createElement("a");
    a.className = "btn btn-custom";
    a.href = "#";
    a.textContent = "Start Test";
    div.appendChild(a);
    a.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.setItem("QuestionList", JSON.stringify(test.questions));
      sessionStorage.setItem("TestId", test.id);
      sessionStorage.setItem("Timer", test.timer);
      const startTime = new Date().getTime();
      sessionStorage.setItem("startTime", startTime);
      window.location.href = "test.html";
    });
    card.appendChild(div);
    innerDiv.appendChild(img);
    innerDiv.appendChild(card);
    testDiv.appendChild(innerDiv);
    testsDiv.appendChild(testDiv);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn("student")) {
    window.location.href = "login.html";
  }
  await loadExam();
  const user = getLogInUser();
  const h1 = document.querySelector("#welcome-heading");
  if (user && h1) {
    h1.innerHTML = `Welcome, <span class="text-dark">${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()}!</span>`;
  }
  loadTests();
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
});
