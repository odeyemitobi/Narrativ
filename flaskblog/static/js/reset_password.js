const passwordInput = document.querySelector('.password')
const confirmPasswordInput = document.querySelector('.confirm-password')
const form = document.getElementById('form')

const feedback = document.querySelector(".feedback");
const body = document.body;

const spinner = document.querySelector(".spinner-container");

form.addEventListener('submit', (e) => {

    e.preventDefault()

    if (passwordInput.value === confirmPasswordInput.value) {
        console.log('yes you fit submit')
        // Display the modal and spinner immediately
        body.classList.add("modal-active");
        spinner.style.display = "block";


        let password = passwordInput.value

        resetUrl = window.location.href

        console.log(resetUrl)

        fetch(resetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })

        }).then(response => response.json())
            .then(result => {
                // Hide the spinner
                body.classList.remove("modal-active");
                spinner.style.display = "none";
                console.log(result)

                if (result.status == "success") {
                    feedback.children[1].textContent = result.message
                    feedback.classList.remove('feedback--error')
                    feedback.classList.add('feedback--success')
                    feedback.children[0].classList.remove('fa-exclamation-circle')
                    feedback.children[0].classList.add('fa-check-circle')
                    feedback.style.visibility = 'visible'

                    setTimeout(() => {
                        window.location.replace(result.redirect_url)
                    }, 10000)
                }
                else {
                    feedback.classList.remove('feedback--success')
                    feedback.classList.add('feedback--error')
                    feedback.style.visibility = 'visible'
                    feedback.children[1].textContent = result.message
                    feedback.children[0].classList.remove('fa-check-circle')
                    feedback.children[0].classList.add('fa-exclamation-circle')
                    feedback.style.display = 'flex'

                    setTimeout(() => {
                        window.location.replace(result.redirect_url)
                    }, 10000)
                }
            })
            .catch(err => console.error(err))
    }
    else {
        feedback.classList.remove('feedback--success')
        feedback.classList.add('feedback--error')
        feedback.style.visibility = 'visible'
        feedback.children[0].classList.remove('fa-check-circle')
        feedback.children[0].classList.add('fa-exclamation-circle')
        feedback.children[1].textContent = 'Password Dose not match'

        console.log('oga dem no correct')
    }
})