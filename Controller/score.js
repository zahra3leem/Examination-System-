import {
  getLogInUser,
  updateLastRating,
  logoutUser,
  isLoggedIn,
} from "./setGetUser.js";
document.addEventListener("DOMContentLoaded", function () {
  if (!isLoggedIn("student")) {
    window.location.href = "login.html";
  }
  let question = JSON.parse(sessionStorage.getItem("QuestionList"));
  let user = getLogInUser();
  const correctAnswers = ((q) => {
    return q.map((question) => {
      return question.options
        .map((answer, index) => (answer.isCorrect ? index : null))
        .filter((index) => index !== null);
    });
  })(question);
  let userAnswerList = JSON.parse(sessionStorage.getItem("answerList")) || [];

  function getScore(correctAnswers, userAnswerList) {
    let score = 0;

    userAnswerList.forEach((answer) => {
      if (answer !== null) {
        const { questionNum, arrAnswer } = answer;
        const correctAnswer = correctAnswers[questionNum];

        console.log(arrAnswer, correctAnswer);
        if (
          correctAnswer !== null &&
          arraysEqual(arrAnswer.sort(), correctAnswer.sort())
        ) {
          score++;
        }
      }
    });

    return score;
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  const header = sessionStorage.getItem("scorePage");
  if (header === "RunTimeOut") {
    document.getElementsByClassName("result-header")[0].innerText =
      "Run Time Out";
  } else {
    document.getElementsByClassName("result-header")[0].innerText =
      "Quiz Results";
  }
  let testId = sessionStorage.getItem("TestId");
  console.log(testId);
  const score = getScore(correctAnswers, userAnswerList);
  console.log(user.lastRating);
  let lastScore =
    user.lastRating.find((ls) => {
      console.log(ls, "hi");
      if (ls.Id == testId) {
        console.log("hi");
        return true;
      }
    })?.LastScore || 0;
  lastScore = (lastScore / question.length) * 100
  const percentage = (score / question.length) * 100;
  let passingScore = question.length / 2;

  document.getElementById("last-points").style.backgroundColor = " #dfdcdc"

  if (percentage < 50) {
    document.getElementById("your-score").style.backgroundColor = "red"
  }
  document.getElementById("last-points").innerText = lastScore.toFixed(2) + "%";
  document.getElementById("your-score").innerText = percentage.toFixed(2) + "%";

  if (score >= passingScore) {
    document.getElementById("result-icon").classList.add("text-success");
    document.getElementById("result-icon").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" width="100px" height="100px" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill="#3AAF3C" d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0z"/><path fill="#0DA10D" fill-rule="nonzero" d="M391.27 143.23h19.23c-81.87 90.92-145.34 165.89-202.18 275.52-29.59-63.26-55.96-106.93-114.96-147.42l22.03-4.98c44.09 36.07 67.31 76.16 92.93 130.95 52.31-100.9 110.24-172.44 182.95-254.07z"/><path fill="#fff" fill-rule="nonzero" d="M158.04 235.26c19.67 11.33 32.46 20.75 47.71 37.55 39.53-63.63 82.44-98.89 138.24-148.93l5.45-2.11h61.06c-81.87 90.93-145.34 165.9-202.18 275.53-29.59-63.26-55.96-106.93-114.96-147.43l64.68-14.61z"/></svg>';

    document.getElementById(
      "result-message"
    ).innerText = `Congratulations, ${user.firstName} ${user.lastName}! You have successfully passed the quiz.`;
  } else {
    document.getElementById("result-icon").classList.add("text-danger");
    document.getElementById("result-icon").innerHTML =
      '<svg width="120px" height="120px" viewBox="0 0 512 512" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="3.072"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#da3434;} .st1{fill:none;stroke:#da3434;stroke-width:32;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> <g id="Layer_1"></g> <g id="Layer_2"> <g> <path class="st0" d="M263.24,43.5c-117.36,0-212.5,95.14-212.5,212.5s95.14,212.5,212.5,212.5s212.5-95.14,212.5-212.5 S380.6,43.5,263.24,43.5z M367.83,298.36c17.18,17.18,17.18,45.04,0,62.23v0c-17.18,17.18-45.04,17.18-62.23,0l-42.36-42.36 l-42.36,42.36c-17.18,17.18-45.04,17.18-62.23,0v0c-17.18-17.18-17.18-45.04,0-62.23L201.01,256l-42.36-42.36 c-17.18-17.18-17.18-45.04,0-62.23v0c17.18-17.18,45.04-17.18,62.23,0l42.36,42.36l42.36-42.36c17.18-17.18,45.04-17.18,62.23,0v0 c17.18,17.18,17.18,45.04,0,62.23L325.46,256L367.83,298.36z"></path> </g> </g> </g></svg>';
    document.getElementById(
      "result-message"
    ).innerText = `Sorry, ${user.firstName} ${user.lastName}. You didn’t pass the quiz. Better luck next time!`;
  }
  updateLastRating(user, score, testId); //
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
  document.getElementById("toTest").addEventListener("click", function () {
    sessionStorage.removeItem("answerList");
    sessionStorage.removeItem("Timer");
    sessionStorage.removeItem("startTime");
    sessionStorage.removeItem("shuffled");
    sessionStorage.removeItem("QuestionList");
    sessionStorage.removeItem("TestId");
    sessionStorage.removeItem("scorePage");
    window.location.href = "homeUser.html";
  });
  const questions = question

  const userAnswers = userAnswerList
  userAnswers.forEach((item, index) => {
    if (item === null) {
      userAnswers[index] = { "questionNum": index, "arrAnswer": null };
    }
  });
  console.log(userAnswers)
  $(document).ready(function() {
    const quizContainer = $('#quiz-container');
    let totalCorrectAnswers = 0;

    questions.forEach((question, index) => {
      const questionHtml = `
        <div class="question mb-3" id="question${index}" style="    border-radius: 8px;">
          <h5>${index + 1}. ${question.text}  </h5>
          <h5 class="question-score text-end" id="score${index}">0/1</h5>
          ${question.options.map((option, optionIndex) => `
            <div class="form-check mb-2" style="    border-radius: 8px;">
              <input class="form-check-input" type="checkbox" name="question${index}" id="question${index}-option${optionIndex}" value="${optionIndex}" disabled>
              <label class="form-check-label" for="question${index}-option${optionIndex}">
                ${option.text}
              </label>
            </div>
          `).join('')}
        </div>
      `;
      
      quizContainer.append(questionHtml);
    });

    userAnswers.forEach(answer => {
      const questionNum = answer.questionNum;
      const selectedOptions = answer.arrAnswer || [];
      const correctOptions = questions[questionNum].options
        .map((option, index) => option.isCorrect ? index.toString() : null)
        .filter(index => index !== null);
        

      // ضبط الخيارات المحددة
      selectedOptions.forEach(optionIndex => {
        const $option = $(`#question${questionNum}-option${optionIndex}`);
      $option.prop('checked', true);
      const $parent = $option.parent();
        $(`#question${questionNum}-option${optionIndex}`).prop('checked', true);
        if (questions[questionNum].options[optionIndex].isCorrect) {
          $(`#question${questionNum}-option${optionIndex}`).parent().addClass('correct-answer');
          $parent.append('<i class="fa-solid fa-check correct-icon"></i>');
        } else {
          $(`#question${questionNum}-option${optionIndex}`).parent().addClass('wrong-answer');
          $parent.append('<i class="fa-solid fa-xmark wrong-icon"></i>');

        }
      });

      // تلوين الإجابات الصحيحة المتبقية
      correctOptions.forEach(optionIndex => {
        if (!selectedOptions.includes(optionIndex)) {
          $(`#question${questionNum}-option${optionIndex}`).parent().addClass('correct-answer');
        }
      });

      // تحديد إذا كانت الإجابات كلها صحيحة
      const allCorrect = selectedOptions.length === correctOptions.length &&
                         selectedOptions.every(option => correctOptions.includes(option));
      
      // تلوين حدود السؤال
      if (allCorrect) {
        $(`#question${questionNum}`).addClass('correct-question');
        totalCorrectAnswers++;
        $(`#score${questionNum}`).text("1/1");
      } else {
        $(`#question${questionNum}`).addClass('wrong-question');
        $(`#score${questionNum}`).text("0/1");
      }
    });

    // عرض النتيجة الإجمالية
    $('#total-score').text(`${totalCorrectAnswers}/${questions.length}`);
  });

});
