import { Student } from "../Model/student.js";
import { Instructor } from "../Model/instructor.js";

let userList = JSON.parse(localStorage.getItem("userList")) || [];
let instructorList = JSON.parse(localStorage.getItem("instructorList")) || [];

if (instructorList.length === 0) {
  let test = new Instructor("ahmed", "hesham", "ahmed@gmail.com", "123456789");
  let test2 = new Instructor(
    "shosh",
    "mohammed",
    "shosh@gmail.com",
    "123456789"
  );
  instructorList = [test, test2];
  localStorage.setItem("instructorList", JSON.stringify(instructorList));
}

export function setInstructor(fN, lN, e, p) {
  let newUser = new Instructor(fN, lN, e, p);
  instructorList.push(newUser);
  localStorage.setItem("instructorList", JSON.stringify(instructorList));
}

export function getInstructors() {
  return instructorList;
}

if (userList.length === 0) {
  let userTest = new Student(
    "mohmed",
    "hesham",
    "mohmedadm733@gmail.com",
    "123456789"
  );
  let userTest2 = new Student(
    "shady",
    "mohammed",
    "shady@gmail.com",
    "123456789"
  );
  userList = [userTest, userTest2];
  localStorage.setItem("userList", JSON.stringify(userList));
}

export function setUser(fN, lN, e, p) {
  let newUser = new Student(fN, lN, e, p);
  userList.push(newUser);
  localStorage.setItem("userList", JSON.stringify(userList));
}

export function getUsers() {
  return [...userList, ...instructorList];
}

export function updateUserAnswerList(newAnswerList) {
  let user = JSON.parse(sessionStorage.getItem("logInUser"));
  user.answerList = newAnswerList;
  sessionStorage.setItem("logInUser", JSON.stringify(user));
}

export function setLogInUser(user) {
  sessionStorage.setItem("logInUser", JSON.stringify(user));
}

export function getLogInUser() {
  return JSON.parse(sessionStorage.getItem("logInUser"));
}
export function isLoggedIn(type) {
  const user = getLogInUser();
  const t = type === "student" ? "S" : "I";
  return user?.role == t;
}

export function logoutUser() {
  sessionStorage.removeItem("logInUser");
  sessionStorage.removeItem("answerList");
  sessionStorage.removeItem("Timer");
  sessionStorage.removeItem("startTime");
  sessionStorage.removeItem("shuffled");
  sessionStorage.removeItem("QuestionList");
  sessionStorage.removeItem("TestId");
  sessionStorage.removeItem("scorePage");

  location.replace("../View/login.html");
}
export function updateLastRating(user, lastScore, id) {
  userList = userList.map((u) => {
    if (u.email === user.email) {
      const existingRating = u.lastRating.find((rating) => rating.Id === id);

      if (existingRating) {
        existingRating.LastScore = lastScore;
      } else {
        u.lastRating.push({ Id: id, LastScore: lastScore });
      }
    }
    return u;
  });

  localStorage.setItem("userList", JSON.stringify(userList));
  const updatedUser = userList.find((u) => u.email === user.email);
  sessionStorage.setItem("logInUser", JSON.stringify(updatedUser));
}
export function updateInstractorTests(instructor) {
  instructorList = instructorList.map((u) => {
    if (u.email === instructor.email) {
      return { ...u, testList: instructor.testList };
    }
    return u;
  });
  localStorage.setItem("instructorList", JSON.stringify(instructorList));
}
