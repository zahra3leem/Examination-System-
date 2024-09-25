import { getUsers, setLogInUser } from "./setGetUser.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  if (!email.value) {
    email.classList.add("is-invalid");
    email.parentNode.nextElementSibling.textContent = "This field is required";
  } else if (!validateEmail(email.value)) {
    email.classList.add("is-invalid");
    email.parentNode.nextElementSibling.textContent =
      "Please enter a valid email address.";
  } else {
    const users = getUsers();
    let user = users.find((user) => user.email === email.value);
    if (user) {
      if (user.password != password.value) {
        password.classList.add("is-invalid");
        password.parentNode.nextElementSibling.textContent = " Password is incorrect";
        console.log(password.parentNode.nextElementSibling.textContent)
      } else {
        setLogInUser(user);
        if (user.role === "I") {
          window.location.replace("homeInstructor.html");
        } else if (user.role === "S") {
          window.location.replace("homeUser.html");
        }
      }
    } else {
      email.classList.add("is-invalid");
      email.parentNode.nextElementSibling.textContent = "Email  is incorrect";
    }
  }
});
function validateEmail(email) {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return reg.test(email);
}

document.querySelectorAll("input").forEach(function (field) {
  field.addEventListener("input", function () {
    field.classList.remove("is-invalid");
    field.parentNode.nextElementSibling.textContent = "";
  });
});
