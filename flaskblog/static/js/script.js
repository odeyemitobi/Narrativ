// //  cancel flash messages from flask
// function cancelFlashMessage() {
//     document.addEventListener('DOMContentLoaded', function() {
//         let cancelSuccessFlash = document.querySelector('.success-flash-btn');
//         let cancelErrorFlash = document.querySelector('.error-flash-btn');
//         let cancelInfoFlash = document.querySelector('.info-flash-btn');

//         if (cancelSuccessFlash) {
//             cancelSuccessFlash.addEventListener('click', function() {
//                 document.querySelector('.success-remove-bg').style.display = 'none';
//             });
//         }

//         if (cancelErrorFlash) {
//             cancelErrorFlash.addEventListener('click', function() {
//                 document.querySelector('.error-remove-bg').style.display = 'none';
//             });
//         }

//         if (cancelInfoFlash) {
//             cancelInfoFlash.addEventListener('click', function() {
//                 document.querySelector('.info-remove-bg').style.display = 'none';
//             });
//         }
//     });
// }

//  Delete post logic
// function deletePost() {
//     let revelDeleteModal = document.querySelectorAll('.delete-btn')
//     if (revelDeleteModal) {
//         revelDeleteModal.forEach(element => {
//             element.addEventListener('click', function(){
//                 document.querySelector('.none').style.display = 'flex'
//                 document.body.style.backgroundColor = '#00000066';

//                 // dynamically construct url for delete view function in the form action
//                 let postId = element.getAttribute('data-post-id');
//                 let form = document.querySelector(".delete_form");
//                 form.action = `/delete/${postId}`;
//             })
//         })
//     }
// }

// function cancelModal(){
//     let cancelDeleteModal = document.querySelectorAll('.cancel-delete-modal')
//     if (cancelDeleteModal){
//         cancelDeleteModal.forEach(element => {
//             element.addEventListener('click', function(){
//                 document.querySelector('.none').style.display = 'none'
//                 document.body.style.backgroundColor = ''
//             })
//         });
//     }

// }

// // Function call
// cance l FlashMessage();
// deletePost();
// cancelModal();

// i wanna import signup.js
import "./signup.js";
import "./signin.js";
import "./home.js";

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <p>&copy; 2024 Narrativ. All rights reserved.</p>
                    <div class="social-links">
                       <a href="https://www.youtube.com/@CSFree-353" target="_blank" class="social-link" aria-label="YouTube">
                        <i class="fab fa-youtube"></i>
                        </a>
                        <a href="https://github.com/odeyemitobi/Narrativ" target="_blank" class="social-link" aria-label="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/oluwadamilola-owolabi/ target="_blank" class="social-link" aria-label="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </footer>
        `;
  }
}

// Define the new custom element
customElements.define("custom-footer", Footer);

const mobileMenu = document.querySelector(".mobile-handburger");
const dropdown = document.querySelector(".user-action");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    console.log("just clicked");
    dropdown.classList.toggle("hide-dropdown");
  });
}

window.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fas"))
    if (dropdown) dropdown.classList.add("hide-dropdown");
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 10 && !dropdown.classList.contains("hide-dropown"))
    dropdown.classList.add("hide-dropdown");
});
