export default function initTest() {
  const cashedAnswerList = JSON.parse(sessionStorage.getItem("answerList"));
  // console.log(cashedAnswerList);
  let questionList = JSON.parse(sessionStorage.getItem("QuestionList"));
  let submitBtn = document.getElementById("submitBtn");
  
  let isShuffled = sessionStorage.getItem("shuffled") || false;
  shuffleArray(questionList);
  
  let curQuest = 0;
  const markedQuestions = [];
  const answerList = cashedAnswerList
  ? cashedAnswerList
  : Array.from({ length: questionList.length }, () => null);
  if(!cashedAnswerList){
    sessionStorage.setItem('answerList', JSON.stringify(answerList));
  }
  console.log(answerList);
  submitCheck();
  // Array.from({ length: questionList.length }, () => null);
  function submitCheck() {
    // Check if any element is null or if arrAnswer is null or an empty array
    let hasInvalidAnswer = answerList.some(
      (answer) =>
        answer === null ||
        answer.arrAnswer === null ||
        answer.arrAnswer.length === 0
    );

    if (hasInvalidAnswer) {
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "gray";
      console.log("disable");
    } else {
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";

      console.log("enable");
    }
  }
  function shuffleArray(array) {
    if (!isShuffled) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    sessionStorage.setItem("shuffled", true);
  }
  function renderQuestion() {
    const question = questionList[curQuest];
    document.getElementById("question-title").innerText = `Question ${
      curQuest + 1
    }:`;
    if(question.type === "multiple"){

      document.getElementById("question-text").innerHTML = `${question.text} <span class="text-danger">(Remember this is a multiple choice question.)</span>`;
    }else{
      document.getElementById("question-text").innerText = question.text;

    }

    const answersForm = document.getElementById("answers-form");

    answersForm.innerHTML = "";

    question.options.forEach((answer, index) => {
      const optionId = `option-${index}`;
      const div = document.createElement("div");
      div.className = "form-check mb-2";

      if (question.type === "single") {
        div.innerHTML = `
      <input class="form-check-input" type="radio" name="answer-${
        answer.questionNumber
      }" id="${optionId}"
      ${
        answerList[answer.questionNumber - 1]?.arrAnswer.includes(String(index))
          ? "checked"
          : ""
      }/>
      <label class="form-check-label" for="${optionId}">${answer.text}</label>
      `;
      } else if (question.type === "multiple") {
        console.log(
          answerList[answer.questionNumber - 1]?.arrAnswer,
          String(index)
        );
        div.innerHTML = `
      <input class="form-check-input" type="checkbox" name="answer-${
        answer.questionNumber
      }" id="${optionId}" 
      ${
        answerList[answer.questionNumber - 1]?.arrAnswer.includes(String(index))
          ? "checked"
          : ""
      }
      />
      <label class="form-check-label" for="${optionId}">${answer.text}</label>
      `;
      }
      answersForm.appendChild(div);
    });
    updateMarkedButton();
    updatePagination();
  }

  function updateMarkedButton() {
    if (markedQuestions.includes(curQuest)) {
      document.getElementById("mark").checked = true;
    } else {
      document.getElementById("mark").checked = false;
    }
  }

  function updatePagination() {
    document
      .getElementById("prev-page")
      .children[0].classList.toggle("hidden-btn", curQuest === 0);

    document
      .getElementById("next-page")
      .classList.toggle("hidden-btn", curQuest === questionList.length - 1);
  }

  function prevPage(e) {
    e.preventDefault();

    if (curQuest > 0) {
      curQuest--;
      renderQuestion();
    }
  }

  function nextPage(e) {
    // console.log(curQuest + 1);
    e.preventDefault();

    if (curQuest < questionList.length - 1) {
      curQuest++;
      renderQuestion();
    }
  }

  function markQuestion() {
    if (!markedQuestions.includes(curQuest)) {
      markedQuestions.push(curQuest);
      updateMarkedQuestions();
    } else {
      markedQuestions.splice(markedQuestions.indexOf(curQuest), 1);
      updateMarkedQuestions();
    }
  }

  function updateMarkedQuestions() {
    const markedQuestionsList = document.getElementById("marked-questions");
    markedQuestionsList.innerHTML = "";
    markedQuestions.forEach((questionIndex) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.classList.add("btn");
      a.textContent = `Question ${questionIndex + 1}`;
      a.addEventListener("click", function () {
        curQuest = questionIndex;
        renderQuestion();
      });
      li.appendChild(a);
      markedQuestionsList.appendChild(li);
    });
  }

  function updateSelectedAnswers(e) {
    // console.log(e.target);
    const questId = e.target.name.split("-")[1] - 1;
    const answerId = e.target.id.split("-")[1];
    if (e.target.type === "radio") {
      answerList[questId] = { questionNum: questId, arrAnswer: [answerId] };
    } else if (e.target.type === "checkbox") {
      if (answerList[questId] === null) {
        const arrAnswer = [];
        arrAnswer.push(answerId);
        answerList[questId] = { questionNum: questId, arrAnswer };
      } else {
        if (!answerList[questId].arrAnswer.includes(answerId)) {
          answerList[questId].arrAnswer.push(answerId);
        } else {
          answerList[questId].arrAnswer.splice(
            answerList[questId].arrAnswer.indexOf(answerId),
            1
          );
        }
      }
    }
    // updateUserAnswerList(answerList);
    console.log(answerList);
    submitCheck();
    sessionStorage.setItem("answerList", JSON.stringify(answerList));
  }

  renderQuestion();
  document.getElementById("prev-page").addEventListener("click", prevPage);
  document.getElementById("next-page").addEventListener("click", nextPage);

  document.getElementById("mark").addEventListener("click", markQuestion);
  document
    .getElementById("answers-form")
    .addEventListener("change", updateSelectedAnswers);

  submitBtn.addEventListener("click", () => {
    sessionStorage.setItem("scorePage", "submit");
    location.replace("../View/score.html");
  });
}
