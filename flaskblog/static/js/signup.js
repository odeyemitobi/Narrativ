// FLAG FOR TRACKING USERNAME AND EMAIL VALIDATION.
let isUsernameValid = false;
let isEmailValid = false;

// Selectors
const body = document.body;

const emailInput = document.getElementById("email-input");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const form = document.querySelector(".form");
const feedback = document.querySelector(".feedback--success");

const spinner = document.querySelector(".spinner-container");
const submitBtn = document.querySelector(".signup-btn");

// HELPER FUNCTIONS
const setLabel = (labelElement, text, color) => {
  labelElement.textContent = text;
  labelElement.style.color = color;
};

const clearFormInput = function () {
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
};

// VALIDATE USERNAME FUNCTION.
const validateUsername = function (e) {
  const usernameRegex = /^[a-z][a-z0-9]{0,9}$/;
  const usernameLabel = document.querySelector(".username-label");

  const usernameValue = e.target.value;

  if (usernameValue.length === 0) {
    setLabel(usernameLabel, "Username is required", "red");
    isUsernameValid = false;
  } else if (!/^[a-z]/.test(usernameValue)) {
    setLabel(usernameLabel, "Username must start with a letter", "red");
    isUsernameValid = false;
  } else if (!usernameRegex.test(usernameValue)) {
    setLabel(
      usernameLabel,
      "Username can contain letters and numbers, up to 10 characters",
      "red"
    );
    isUsernameValid = false;
  } else {
    setLabel(usernameLabel, "Username", "black");
    isUsernameValid = true;
  }
};

// VALIDATE EMAIL FUNCTION.
const validateEmail = function (e) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailLabel = document.querySelector(".email-label");

  const emailValue = e.target.value;

  if (emailValue.length === 0) {
    setLabel(emailLabel, "Email is required", "red");
    isEmailValid = false;
  } else if (!/@/.test(emailValue)) {
    setLabel(emailLabel, "Email must contain an '@' symbol", "red");
    isEmailValid = false;
  } else if (!/\.[a-zA-Z]{2,}$/.test(emailValue)) {
    setLabel(emailLabel, "Email domain must be valid, e.g., '.com'", "red");
    isEmailValid = false;
  } else if (!emailRegex.test(emailValue)) {
    setLabel(emailLabel, "Email format is invalid", "red");
    isEmailValid = false;
  } else {
    setLabel(emailLabel, "Email", "black");
    isEmailValid = true;
  }
};

// USER REGISTRATION.
const registerUser = function (e) {
  e.preventDefault();

  // Input Values
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const feedbackSpan = feedback.children[1];

  if (isUsernameValid && isEmailValid) {
    // Display the modal and spinner immediately
    body.classList.add("modal-active");
    spinner.style.display = "block";

    // Proceed with form submission logic
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {

        console.log(typeof(result))
        console.log(result)

        // Hide the spinner
        body.classList.remove("modal-active");
        spinner.style.display = "none";

        // Check for errors
        if (result.errors) {
          if (result.errors["username_and_email_taken"]) {
            feedbackSpan.textContent = `${result.errors["username_and_email_taken"]}`;
          } else if (result.errors["username_taken"]) {
            feedbackSpan.textContent = result.errors["username_taken"];
          } else if (result.errors["email_taken"]) {
            feedbackSpan.textContent = result.errors["email_taken"];
          }

          feedback.classList.add("feedback--error");
          feedback.style.visibility = "visible";
        } else {
          // Show success feedback
          clearFormInput();
          feedback.classList.remove("feedback--error");
          feedbackSpan.textContent = `${result.welcome_message} ${result.username},!`;
          feedback.style.visibility = "visible";
        }
      })
      .catch((error) => {
        // Hide the spinner on error
        clearFormInput();
        body.classList.remove("modal-active");
        spinner.style.display = "none";
        feedback.classList.add("error");
        feedbackSpan.textContent =
          "An unexpected error occurred. Please try again.";
        feedback.style.visibility = "visible";
      });
  }
};
// Function calls
//check for tag availablity before attaching eventlistners to avoid attaching event listners on null datatype.
console.log('signup.js')
if (form) form.addEventListener("submit", registerUser);
// Call the validation functions to set up the input event listeners
if (emailInput) emailInput.addEventListener("input", validateEmail);
if (usernameInput) usernameInput.addEventListener("input", validateUsername);

