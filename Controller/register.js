import { setUser, getUsers, setInstructor } from "./setGetUser.js";

const users = getUsers();

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let formValid = true;

    const nameFields = document.querySelectorAll(".name");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const userRoleField = document.getElementById("role");

    const fields = document.querySelectorAll("#registerForm input");

    fields.forEach((field) => {
      if (!field.value.trim()) {
        formValid = false;
        field.classList.add("is-invalid");
        field.parentElement.nextElementSibling.textContent = "This field is required";
      } else {
        field.classList.remove("is-invalid");
        field.parentElement.nextElementSibling.textContent = "";
      }
    });

    if (passwordField.value.trim()) {
      if (passwordField.value.length < 8) {
        formValid = false;
        passwordField.classList.add("is-invalid");
        passwordField.parentElement.nextElementSibling.textContent =
          "Password must be at least 8 characters long.";
      } else if (passwordField.value !== confirmPasswordField.value) {
        formValid = false;
        confirmPasswordField.classList.add("is-invalid");
        confirmPasswordField.parentElement.nextElementSibling.textContent =
          "Passwords do not match.";
      }
    }

    if (emailField.value.trim()) {
      if (!validateEmail(emailField.value)) {
        formValid = false;
        emailField.classList.add("is-invalid");
        emailField.parentElement.nextElementSibling.textContent =
          "Please enter a valid email address.";
      } else {
        users.forEach((user) => {
          if (emailField.value === user.email) {
            formValid = false;
            emailField.classList.add("is-invalid");
            emailField.parentElement.nextElementSibling.textContent =
              "This email already exists. Please log in.";
          }
        });
      }
    }

    nameFields.forEach((nameField) => {
      if (nameField.value.trim() && !validateName(nameField.value)) {
        console.log("hi");
        formValid = false;
        nameField.classList.add("is-invalid");
        nameField.parentElement.nextElementSibling.textContent =
          "Name should only contain alphabetic characters.";
      }
    });

    if (formValid) {
      if (userRoleField.value === "S") {
        setUser(
          nameFields[0].value,
          nameFields[1].value,
          emailField.value,
          passwordField.value
        );
      } else if (userRoleField.value === "I") {
        setInstructor(
          nameFields[0].value,
          nameFields[1].value,
          emailField.value,
          passwordField.value
        );
      }
      location.replace("../View/login.html");
    }
  });

function validateEmail(email) {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return reg.test(email);
}

function validateName(name) {
  const reg = /^[a-zA-Z]+$/;
  return reg.test(name);
}

document.querySelectorAll("#registerForm input").forEach(function (field) {
  field.addEventListener("input", function () {
    field.classList.remove("is-invalid");
    field.parentElement.nextElementSibling.textContent = "";
  });
});
