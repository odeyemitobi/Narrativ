const userEmail = document.getElementById('email')
const form = document.querySelector('.reset-form')
const feedback = document.querySelector('.feedback')
const spinner = document.querySelector(".spinner-container");
const body = document.body

let isEmailValid = false;
const setLabel = (labelElement, text, color) => {
    labelElement.textContent = text;
    labelElement.style.color = color;
};

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


userEmail.addEventListener('input', validateEmail)



form.addEventListener('submit', (e) => {

    e.preventDefault()
    const email = userEmail.value


    // add spinner
    body.classList.add("modal-active");
    spinner.style.display = "block";



    if (isEmailValid) {
        fetch(`/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),



        })
            .then((response) => response.json())
            .then((result) => {

                // Hide the spinner
                body.classList.remove("modal-active");
                spinner.style.display = "none";


                if (result.status == "success") {
                    feedback.children[1].textContent = result.message
                    feedback.classList.remove('feedback--error')
                    feedback.classList.add('feedback--success')
                    feedback.children[0].classList.remove('fa-exclamation-circle')
                    feedback.children[0].classList.add('fa-check-circle')
                    feedback.style.visibility = 'visible'
                }
                else {
                    feedback.classList.remove('feedback--success')
                    feedback.classList.add('feedback--error')
                    feedback.style.visibility = 'visible'
                    feedback.children[1].textContent = result.message
                    feedback.children[0].classList.remove('fa-check-circle')
                    feedback.children[0].classList.add('fa-exclamation-circle')


                    feedback.style.display = 'flex'
                }
                console.log(result);
            })
            .catch((err) => console.log(err));
    }
})


// < !--action="{{ url_for('users.send_email_link') }}" -- >

