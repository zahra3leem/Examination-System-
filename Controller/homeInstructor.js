import { Question } from "../Model/Question.js";
import { Answer } from "../Model/Answer.js";
import { Test } from "../Model/Test.js";
import {
  getLogInUser,
  updateInstractorTests,
  logoutUser,
  isLoggedIn,
} from "../Controller/setGetUser.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = getLogInUser();
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  } else {
    let id = sessionStorage.getItem("testId") || 0;
    const addQuestionButton = document.getElementById("addQuestionButton");
    const questionsList = document.getElementById("questionsList");
    const createTestForm = document.getElementById("createTestForm");
    const testsList = document.getElementById("testsList");

    let questionCount = 0;
    let editMode = false;
    let editIndex = null;

    loadTests();

    addQuestionButton.addEventListener("click", function () {
      questionCount++;
      addQuestion(questionCount);
    });

    createTestForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const testName = document.getElementById("testName").value;
      const testType = document.getElementById("testtype").value;
      const testDifficulty = document.getElementById("testDifficulty").value;
      const timer = Number(document.getElementById("timer").value);

      const questions = [];
      for (let i = 1; i <= questionCount; i++) {
        const questionText = document.getElementById(`questionText${i}`).value;
        const options = Array.from(
          document.querySelectorAll(`#optionsList${i} input`)
        ).map((input) => input.value);
        const optionAnswers = Array.from(
          document.querySelectorAll(`#correctAnswersList${i} input`)
        ).map((input) => input.checked);
        const numberOfTrue = optionAnswers.filter((value) => value).length;
        const type = numberOfTrue > 1 ? "multiple" : "single";
        const option = options.map(
          (el, index) => new Answer(el, optionAnswers[index], i)
        );
        questions.push(new Question(questionText, option, type));
      }

      const testId = editMode ? user.testList[editIndex].id : id;
      const test = new Test(
        testId,
        `${user.firstName} ${user.lastName}`,
        testName,
        `../${testType.toLowerCase()}.png`,
        testType,
        timer,
        questions,
        testDifficulty
      );

      saveTest(test);
      resetForm();
      loadTests();
    });

    // Function to add a question
function addQuestion(index, question = null) {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question-container");
  questionDiv.setAttribute("id", `questionContainer${index}`);

  questionDiv.innerHTML = `
    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
      <div class="d-flex justify-content-between align-items-center">
        <h5>Question ${index}</h5>
        <div class="delete-question" data-index="${index}" style="cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0,0,256,256">
            <g fill="#ff0000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
              <g transform="scale(10.66667,10.66667)">
                <path d="M10,2l-1,1h-4c-0.6,0 -1,0.4 -1,1c0,0.6 0.4,1 1,1h2h10h2c0.6,0 1,-0.4 1,-1c0,-0.6 -0.4,-1 -1,-1h-4l-1,-1zM5,7v13c0,1.1 0.9,2 2,2h10c1.1,0 2,-0.9 2,-2v-13zM9,9c0.6,0 1,0.4 1,1v9c0,0.6 -0.4,1 -1,1c-0.6,0 -1,-0.4 -1,-1v-9c0,-0.6 0.4,-1 1,-1zM15,9c0.6,0 1,0.4 1,1v9c0,0.6 -0.4,1 -1,1c-0.6,0 -1,-0.4 -1,-1v-9c0,-0.6 0.4,-1 1,-1z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="form-group">
        <label for="questionText${index}">Question Text</label>
        <input type="text" class="form-control" id="questionText${index}" placeholder="Enter the question text" required>
      </div>
      <div class="form-group">
        <label>Question Type</label>
        <select class="form-control" id="questionType${index}" required>
          <option value="">Select Type</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
        </select>
      </div>
      <div id="optionsContainer${index}" class="form-group">
        <label id="optionLabel${index}" style="display: none;">Options</label>
        <div id="optionsList${index}">
          <!-- Options will be added here -->
        </div>
      </div>
      <div class="form-group">
        <label id="correctAnswerLabel${index}" style="display: none;">Correct Answers</label>
        <div id="correctAnswersList${index}">
          <!-- Correct answers will be listed here -->
        </div>
      </div>
    </div>
  `;
  questionsList.appendChild(questionDiv);

  const questionTypeSelect = document.getElementById(`questionType${index}`);
  const optionsList = document.getElementById(`optionsList${index}`);
  const correctAnswersList = document.getElementById(`correctAnswersList${index}`);

  questionTypeSelect.addEventListener("change", function () {
    document.getElementById(`optionLabel${index}`).style.display = "block";
    document.getElementById(`correctAnswerLabel${index}`).style.display = "block";

    const type = questionTypeSelect.value;
    optionsList.innerHTML = "";
    correctAnswersList.innerHTML = "";

    if (type === "multiple-choice") {
      for (let i = 0; i < 4; i++) {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("form-group");
        optionDiv.innerHTML = `
          <input type="text" class="form-control mb-2" placeholder="Option ${i + 1}" required>
        `;
        optionsList.appendChild(optionDiv);

        const answerDiv = document.createElement("div");
        answerDiv.classList.add("checkbox-container");
        answerDiv.innerHTML = `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${i}" id="answer${index}_${i}">
            <label class="form-check-label" for="answer${index}_${i}">Option ${i + 1}</label>
          </div>
        `;
        correctAnswersList.appendChild(answerDiv);
      }
    } else if (type === "true-false") {
      const trueOptionDiv = document.createElement("div");
      trueOptionDiv.classList.add("form-group");
      trueOptionDiv.innerHTML = `
        <input type="text" class="form-control mb-2" value="True" disabled>
      `;
      optionsList.appendChild(trueOptionDiv);

      const falseOptionDiv = document.createElement("div");
      falseOptionDiv.classList.add("form-group");
      falseOptionDiv.innerHTML = `
        <input type="text" class="form-control mb-2" value="False" disabled>
      `;
      optionsList.appendChild(falseOptionDiv);

      const trueCheckboxDiv = document.createElement("div");
      trueCheckboxDiv.classList.add("checkbox-container");
      trueCheckboxDiv.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="0" id="trueAnswer${index}">
          <label class="form-check-label" for="trueAnswer${index}">True</label>
        </div>
      `;
      correctAnswersList.appendChild(trueCheckboxDiv);

      const falseCheckboxDiv = document.createElement("div");
      falseCheckboxDiv.classList.add("checkbox-container");
      falseCheckboxDiv.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="1" id="falseAnswer${index}">
          <label class="form-check-label" for="falseAnswer${index}">False</label>
        </div>
      `;
      correctAnswersList.appendChild(falseCheckboxDiv);
    }
  });

  if (question) {
    document.getElementById(`questionText${index}`).value = question.text;
    const type = question.type === "single" && question.options.length === 2 ? "true-false" : "multiple-choice";
    document.getElementById(`questionType${index}`).value = type;
    questionTypeSelect.dispatchEvent(new Event("change"));
    question.options.forEach((option, j) => {
      document.querySelector(`#optionsList${index} .form-group:nth-child(${j + 1}) input`).value = option.text;
    });
    question.options.forEach((answer, j) => {
      if (answer.isCorrect) {
        document.querySelector(`#correctAnswersList${index} .form-check-input[value="${String(j)}"]`).checked = true;
      }
    });
  }

  document.querySelector(`#questionContainer${index} .delete-question`).addEventListener("click", handleDeleteClick);
}

// Function to delete a question
function deleteQuestion(index) {
  const questionDiv = document.getElementById(`questionContainer${index}`);

  if (questionDiv) {
    questionDiv.remove();
    questionCount--;

    // Re-index the remaining questions
    const questionContainers = document.querySelectorAll(".question-container");
    questionContainers.forEach((container, i) => {
      container.setAttribute("id", `questionContainer${i + 1}`);
      container.querySelector("h5").textContent = `Question ${i + 1}`;

      const deleteButton = container.querySelector(".delete-question");
      deleteButton.setAttribute("data-index", i + 1);

      deleteButton.removeEventListener("click", handleDeleteClick);
      deleteButton.addEventListener("click", handleDeleteClick);

      container.querySelector(".form-control[id^='questionText']").id = `questionText${i + 1}`;
      container.querySelector("select[id^='questionType']").id = `questionType${i + 1}`;
      container.querySelector("div[id^='optionsContainer']").id = `optionsContainer${i + 1}`;
      container.querySelector("div[id^='optionsList']").id = `optionsList${i + 1}`;
      container.querySelector("div[id^='correctAnswersList']").id = `correctAnswersList${i + 1}`;
      container.querySelector("label[id^='optionLabel']").id = `optionLabel${i + 1}`;
      container.querySelector("label[id^='correctAnswerLabel']").id = `correctAnswerLabel${i + 1}`;
    });
  }
}

// Function to handle delete button click
function handleDeleteClick(event) {
  const index = parseInt(event.target.closest(".delete-question").getAttribute("data-index"));
  deleteQuestion(index);
}

    function resetForm() {
      createTestForm.reset();
      questionsList.innerHTML = "";
      questionCount = 0;
    }

    function saveTest(test) {
      let tests = getTests();

      if (editMode) {
        user.testList[editIndex] = test;

        const globalIndex = tests.findIndex((t) => t.id === test.id);
        tests[globalIndex] = test;
        console.log(user.testList[editIndex]);
        editMode = false;
        editIndex = null;

        const btn = document.getElementById("createTest");
        btn.textContent = "Create Test";
        btn.classList.remove("btn-warning");
      } else {
        user.testList.push(test);
        tests.push(test);
        id++;
      }

      sessionStorage.setItem("testId", id);
      sessionStorage.setItem("logInUser", JSON.stringify(user));
      localStorage.setItem("tests", JSON.stringify(tests));
    }

    function getTests() {
      const tests = localStorage.getItem("tests");
      return tests ? JSON.parse(tests) : [];
    }

    function loadTests() {
      const tests = user.testList;
      testsList.innerHTML = "";
      tests.forEach((test, index) => {
        const testDiv = document.createElement("div");
        testDiv.classList.add("test-item");
        testDiv.innerHTML = `
            <h4>${test.name}</h4>
            <p>${test.type}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>${test.difficulty}</p>
              <p>${test.timer} min</p>
            </div>
            <div class="test-actions">
                <button class="btn btn-secondary edit-test" data-index="${index}">Edit</button>
                <button class="btn btn-danger delete-test" data-index="${index}">Delete</button>
            </div>
        `;
        testsList.appendChild(testDiv);
      });
    
      document.querySelectorAll(".edit-test").forEach((button) => {
        button.addEventListener("click", function () {
          editIndex = button.getAttribute("data-index");
          const test = user.testList[editIndex];
          document.getElementById("testName").value = test.name;
          document.getElementById("testtype").value = test.type;
          document.getElementById("timer").value = test.timer;
          document.getElementById("testDifficulty").value = test.difficulty;
          questionsList.innerHTML = "";
          test.questions.forEach((question, i) => {
            questionCount = i + 1;
            addQuestion(questionCount, question);
          });
          let btn = document.getElementById("createTest");
          btn.textContent = "Save Edit";
          btn.classList.add("btn-warning");
          editMode = true;
        });
      });
    
      document.querySelectorAll(".delete-test").forEach((button) => {
        button.addEventListener("click", function (e) {
          const index = e.target.getAttribute("data-index");
          console.log(`Deleting test at index ${index}`);  
    
          if (user.testList[index]) {
            const globalIndex = getTests().findIndex((t) => t.id === user.testList[index].id);
            if (globalIndex > -1) {
              let tests = getTests();
              tests.splice(globalIndex, 1);
              localStorage.setItem("tests", JSON.stringify(tests));
            }
    
            user.testList.splice(index, 1);
            sessionStorage.setItem("logInUser", JSON.stringify(user));
            loadTests();
          } else {
            console.error(`Test at index ${index} does not exist in user.testList`);
          }
        });
      });
    }
    
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", function () {
      updateInstractorTests(user);
      logoutUser();
    });
  }
});
