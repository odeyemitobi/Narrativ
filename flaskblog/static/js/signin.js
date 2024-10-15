// Function to initialize the form and event listeners
const initializeForm = () => {
  // Flag to track the validation state
  let isUsernameValid = false;
  let isEmailValid = false;

  // Selectors
  const body = document.body;
  console.log(body);

  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  console.log(emailInput);
  console.log(passwordInput);
  const form = document.querySelector(".form");
  const feedback = document.querySelector(".feedback--error");
  const spinner = document.querySelector(".spinner-container");

  // Helper function
  const setLabel = (labelElement, text, color) => {
    labelElement.textContent = text;
    labelElement.style.color = color;
  };

  const clearFormInput = function () {
    emailInput.value = "";
    passwordInput.value = "";
  };

  // Check if required elements are available
  if (emailInput && passwordInput && form && feedback) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;
      clearFormInput();

      console.log(email, password);

      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "failure") {
            console.log(feedback.children);
            feedback.children[1].textContent = result.login_message;
            feedback.style.visibility = "visible";
          }
          if (result.status === "success") {
            window.location.href = `${result.redirect_url}?login_message=${encodeURIComponent(result.login_message)}`;
          }
          console.log(result);
        })
        .catch((error) => console.log(error));
    });
  }
};

// Initialize the form after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", initializeForm);
