const postTitleInput = document.getElementById("title");
const postContentInput = document.getElementById("content");
const postBtn = document.querySelector(".publish");
const newPostIndicator = document.querySelector(".new-post");

if (postBtn) {
  postBtn.addEventListener("click", (e) => {
    const postTitle = postTitleInput.value;
    const postContent = postContentInput.value;

    if (postTitle && postContent) {
      let postCategory = prompt("Please Enter Post Category");
      if (postCategory) {
        console.log(postCategory);
        fetch(`/create-post?category=${encodeURIComponent(postCategory)}`, {
          method: "POST",
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
              window.location.href = `${
                result.redirect_url
              }?post_message=${encodeURIComponent(result.message)}`;
              newPostIndicator.style.display = "block";
            }
            console.log(result);
          })
          .catch((err) => console.log(err));
      }
    }
  });
}
