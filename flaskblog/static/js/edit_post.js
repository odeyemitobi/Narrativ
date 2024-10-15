let postTitleInput = document.getElementById("title");
let postContentInput = document.getElementById("content");
const editBtn = document.querySelector(".publish");
const feedback = document.querySelector(".feedback");
const postID = window.location.href.split("/").at(-1);
let isvalid = false;
const prefetchPost = function () {
  const postID = window.location.href.split("/").at(-1);
  console.log(postID);
  fetch(`/post-details/${postID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status == "success") {
        postTitleInput.value = result.post_title;
        postContentInput.value = result.post_content;
      }
      console.log(result);
    })
    .catch((err) => console.error(err));
};

let originalPost = {
  title: "",
  content: "",
};


const editPost = function () {
  editBtn.addEventListener("click", (e) => {
    let postTitle = postTitleInput.value;
    let postContent = postContentInput.value;

    // save the post details, just incase user mistakenly updated the post with empty inputs.
    if (postTitle != "" && postContent != "") {
      console.log("see where i dee");
      originalPost.title = postTitle;
      originalPost.content = postContent;
    }

    // update count
    if (postTitle.length > 0 && postContent.length > 0) {
      fetch(`/edit-post/${postID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postTitle,
          postContent,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status == "success") {
            window.location.href = `${result.redirect_url
              }?post_message=${encodeURIComponent(result.message)}`;
            }
        })
        .catch((err) => console.log(err));
    } else {
      alert(
        "Oops! The post content cannot be empty. Please provide some text before submitting."
      );
      console.log("postTefewfewfa", postTitle);
      console.log("original content", originalPost.content);
      console.log("original title", originalPost.title);

      postTitleInput.value = originalPost.title;
      postContentInput.value = originalPost.content
    }
  });
};
prefetchPost();
editPost();
// console.log('we good', postContentInput.value)



