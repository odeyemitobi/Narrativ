// Selectors
const feedback = document.querySelector(".feedback");
const categories = document.querySelectorAll(".post-recommendation p");
const postContainer = document.querySelector('.home-article');

// Get query parameters
const urlparam = new URLSearchParams(window.location.search);
const login_message = urlparam.get("login_message");
const post_message = urlparam.get("post_message");

// Check if feedback element is available and set messages
if (feedback) {
  if (login_message) {
    feedback.children[1].textContent = login_message;
    feedback.style.visibility = "visible";
  } else if (post_message) {
    feedback.children[1].textContent = post_message;
    feedback.style.visibility = "visible";
  }
} else {
  console.error("Feedback element is missing.");
}

// Function to remove a query parameter
const removeQueryParam = (param) => {
  let url = new URL(window.location);
  let params = new URLSearchParams(url.search);
  params.delete(param);
  url.search = params.toString();
  window.history.replaceState({}, document.title, url.toString());
};



// Function to get user details
const getUserDetail = () => {
  const userDataElement = document.getElementById('current_user');
  console.log('userdata', userDataElement)
  if (userDataElement) {
    const currentUser = JSON.parse(userDataElement.textContent);
    localStorage.setItem('username', JSON.stringify(currentUser.username));
    localStorage.setItem('is_authenticated', JSON.stringify(currentUser.is_authenticated));
    localStorage.setItem('is_active', JSON.stringify(currentUser.is_active));
    localStorage.setItem('id', JSON.stringify(currentUser.id));
    localStorage.setItem('email', JSON.stringify(currentUser.email));
  } else {
    console.error("User data element is missing.");
  }
};

// Function to delete a post
const deletePost = (e) => {
  if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
    e.preventDefault(); // Prevent default behavior if needed
    let deleteButton = e.target.closest('.delete-btn'); // Find the closest .delete-btn if clicked inside it
    let body = document.body;
    body.classList.add('modal-active');
    body.classList.add('overflow');
    document.querySelector('.delete-modal').classList.remove('hide-modal');
    let delete_url = deleteButton.getAttribute("data-post-id");
    let form = document.querySelector(".delete_form");
    if (form) {
      form.action = delete_url;
    }
  }
};

// Function to cancel the modal
const cancelModal = () => {
  let cancelDeleteModal = document.querySelectorAll(".cancel-delete-modal");
  if (cancelDeleteModal.length) {
    cancelDeleteModal.forEach((element) => {
      element.addEventListener("click", () => {
        document.querySelector('.delete-modal').classList.toggle('hide-modal');
        document.body.classList.remove('modal-active');
        document.body.classList.remove('overflow');
      });
    });
  } else {
    console.error("Cancel delete modal elements are missing.");
  }
};


const PostNotFound = function (message) {
  const postNotFound = document.createElement('h1');
  postNotFound.textContent = message
  postNotFound.classList.add('category-not-found');
  postContainer.innerHTML = '';
  postContainer.appendChild(postNotFound);
}
// Function to render home posts
// Function to render home posts
const renderHomePosts = () => {
  fetch(`/filter_posts`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.posts) {
        const all_posts = data.posts;
        let innerhtml = '';
        all_posts.forEach((post) => {
          const isOwner = post.author === username;
          console.log('username', username);

          innerhtml += `
            <main class="home-main">
              <div class="home-main-div">
                <h4>${post.author}</h4>
                <p>${post.created_at}</p>
                <div class="new-post">
                  <p>new</p>
                </div>
              </div>
              <div class="post-div">
                <h1 id="title">${post.title}</h1>
                <p id="content">${post.content}</p>
              </div>
              ${isOwner ? `
                <div class="cta" style="display: flex;">
                  <a href="${post.edit_url}" class="edit-btn">
                    <i class="fas fa-edit"></i> Update
                  </a>
                  <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
                </div>
              ` : ''}
            </main>`;
        });
        postContainer.innerHTML = innerhtml;

        // Display a message if no posts are found
      } else PostNotFound(data.message);

      console.log(data);
    })
    .catch((err) => {
      console.error('Failed to fetch posts:', err);
      // Handle unexpected errors

    });
};

// REC// RECOMMENDATION
categories.forEach((e) => {
  e.addEventListener("click", () => {
    let category = e.textContent;

    fetch(`/filter_posts?category=${encodeURIComponent(category)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          const all_posts = data.posts;
          let innerhtml = '';

          all_posts.forEach((post) => {
            const isOwner = post.author === username;
            console.log('username', username);
            innerhtml += `
              <main class="home-main">
                <div class="home-main-div">
                  <h4>${post.author}</h4>
                  <p>${post.created_at}</p>
                  <div class="new-post">
                    <p>new</p>
                  </div>
                </div>
                <div class="post-div">
                  <h1 id="title">${post.title}</h1>
                  <p id="content">${post.content}</p>
                </div>
                ${isOwner ? `
                  <div class="cta" style="display: flex;">
                    <a href="${post.edit_url}" class="edit-btn">
                      <i class="fas fa-edit"></i> Update
                    </a>
                    <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
                  </div>
                ` : ''}
              </main>`;
          });


          postContainer.innerHTML = innerhtml;


        } else {

          // Display a message if no posts are found
          PostNotFound(data.message);

        }
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
      });
  });

});





// FUNCTION CALLS
getUserDetail();
// Get username from local storage after setting it in getUserDetail function
let username = localStorage.getItem('username');
// Trim username from local storage
if (username) {
  username = username.trim().replace(/^"|"$/g, ''); // trim spaces and remove quotes
}

// Usage: Remove the 'post_message' query parameter
removeQueryParam('post_message');

// Render home posts
renderHomePosts();

// Event listeners
cancelModal();

// Event listener to delete a post
if (postContainer) {
  postContainer.addEventListener('click', deletePost);
}

