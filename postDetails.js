setupUI();

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
console.log(id);

getPost();
function getPost() {
axios.get(`${baseUrl}/posts/${id}`).then((response) => {
const post = response.data.data;
const comments = post.comments;
const author = post.author;
document.getElementById("username-span").innerHTML = author.username;
let postTitle = "";
if (post.title != null) {
    postTitle = post.title;
}
let commentsContent = ``;
for (comment of comments) {
    commentsContent += `
            <!-- COMMENT -->
            <div class="p-3" style="background-color: rgb(187, 187, 187)">
            <!-- PROFILE PIC + USERNAME -->
            <div>
                <img
                src="${comment.author.profile_image}"
                class="rounded-circle"
                alt=""
                onerror= "this.src = './profile_pics/user-pic.png'"
                style="width: 40px; height: 40px;"
                />
                <b>${comment.author.username}</b>
            </div>
            <!--// PROFILE PIC + USERNAME //-->
            <!-- COMMENT'S BODY -->
            <div>
                ${comment.body}
            </div>
            <!--// COMMENT'S BODY //-->
            </div>
            <!--// COMMENT //-->
    `;
}
const postContent = `
            <!-- POST CARD -->
        <div class="card shadow">
            <div class="card-header">
            <img
                class="user-pic rounded-circle border border-3"
                src="${author.profile_image}"
                alt=""
                onerror= "this.src = './profile_pics/user-pic.png'"
                style="width: 40px; height: 40px;"
            />
            <b>@${author.username}</b>
            </div>
            <div class="card-body">
            <img
                class="w-100"
                src="${post.image}"
                alt=""
            />
            <h6 style="color: rgb(193, 193, 193)" class="mt-1">
                ${post.created_at}
            </h6>
            <h4>${postTitle}</h4>
            <p>
                ${post.body}
            </p>
            <hr />
            <div>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pen"
                viewBox="0 0 16 16"
                >
                <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
                />
                </svg>
                <span> (${post.comments_count}) Comments </span>
            </div>
            </div>
            <div id="comments">
            ${commentsContent}
            </div>
            <div class="input-group mb-3">
            <input id="comment-input" type="text" class="form-control" placeholder="Add your comment..">
            <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">send</button>
            </div>
        </div>
        <!--// POST CARD //-->`;

document.getElementById("post").innerHTML = postContent;
});
}

function createCommentClicked() {
let commentBody = document.getElementById("comment-input").value;
let params = {
body: commentBody,
};
let token = localStorage.getItem("token");
let url = `${baseUrl}/posts/${id}/comments`;

axios
.post(url, params, {
    headers: {
    authorization: `Bearer ${token}`,
    },
})
.then((response) => {
    console.log(response.data);
    showAlert("The comment has been created seccessfully", "success");
    getPost();
})
.catch((error) => {
    const errorMessage = error.response.data.message;
    showAlert(errorMessage, "danger");
    console.log(error);
});
}
