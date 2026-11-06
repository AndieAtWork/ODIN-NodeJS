console.log("javascript corriendo");

const modal = document.getElementById("image-modal");
const imageContainer = $("#image-container");
const openButtons = $(".private-modal-open");
const closeButton = $("#close-button");

const deleteModal = document.getElementById("delete-modal");

openButtons.on("click", (event) => {
    //console.log(event.currentTarget)
    //console.log(event.currentTarget.id);

    let username = window.location.href.split("/")[window.location.href.split("/").length - 1];
    console.log("username: " + username);
    let post_id = event.currentTarget.id.split("-")[1]
    imageContainer.html(
        `<img 
        src="${"/blog/" + username + "/" + post_id}" 
        id="private-post-image" 
        draggable="false"
        oncontextmenu="return false;"
        >`);
    modal.showModal();
});

closeButton.on("click", () => {
  console.log("close", modal);
  modal.close();
});

$(".private-post-image").on("contextmenu", function (event) {
  event.preventDefault();
  return false;
});
$(".private-post-image").on("dragstart", function (event) {
  event.preventDefault();
});

function editPost(id){
  console.log(id);
  let username = window.location.href.split("/")[window.location.href.split("/").length - 1];
  console.log(username);
  window.location.href = "/blog/" + username + "/" + id + "/edit";
}

function deletePost(id){
  deleteModal.showModal();
  let username = window.location.href.split("/")[window.location.href.split("/").length - 1];
  console.log(username);
  $("#delete-form").attr("action", "/blog/" + username + "/" + id + "/delete");
}

$("#delete-modal-close").on("click", () => {
  deleteModal.close();
})