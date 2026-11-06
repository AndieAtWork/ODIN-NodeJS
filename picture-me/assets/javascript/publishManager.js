$(document).ready(() => {

    const uploadBtn = $("#upload-btn");
    const uploader = $("#image");
    const bar = $("#bar");

    const submitPictureBtn = $("#submit-picture-btn"); 
    const submitPostBtn = $("#submit-post-btn");
    const editPostBtn = $("#edit-post-btn");

    const editUpload = $("#delete-upload-btn");

    const filename = $("#filename");

    var barInterval = null;
    var width = 0;
    var duration = 2000;
    var startTime = null;

    editUpload.on("click", () => {
        JsLoadingOverlay.show();
        window.location.href = "/blog/publish_post";
    });

    uploadBtn.on("click", (event) => {
    uploader.click();
    });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            console.log("File selected:", event.target.files[0]);

            var name = event.target.files[0].name;
            filename.html(name);
            submitPictureBtn.attr("disabled", true);
            bar.css("width", "0%");

            startTime = null;
            width = 0;

            requestAnimationFrame(animateBar);
        });
    }

    function animateBar(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        width = Math.min((elapsed / duration) * 100, 100);

        bar.css("width", width + "%");

        if (width < 100) {
            requestAnimationFrame(animateBar);
        }
        if (width >= 100){
            submitPictureBtn.attr("disabled", false);
        }
    }

    $(".publishing-btn").on("click", (event) => {
        JsLoadingOverlay.show();
    })

    function updateCounter(container, countElement, max){
        var text = container.val();
        text = text.substring(0, max);
        container.val(text);
        countElement.text(text.length);
    }

    updateCounter($("#title"), $("#title-counter"), 100);
    updateCounter($("#description"), $("#text-counter"), 2000);

    $("#title").on("input", () => {
        updateCounter($("#title"), $("#title-counter"), 100);
    })
    $("#description").on("input", () => {
        updateCounter($("#description"), $("#text-counter"), 2000);
    })
});