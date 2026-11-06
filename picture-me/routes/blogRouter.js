const { Router } = require("express");

const upload = require("../middleware/upload");

const blogController = require("../controllers/blogController");
const blogRouter = Router();

blogRouter.get("/publish_post", blogController.publishGet); // publish picture

blogRouter.post("/publish_post", blogController.publishPost) // publish post with picture

blogRouter.post("/publish_post_image", upload.single("image"), blogController.publishPostImage) // posts image before posting whilte post

blogRouter.get("/:username/:image", blogController.blogSecretImageGet) // username's blog secret image

blogRouter.get("/:username/:image/edit", blogController.blogImageGet) // get post data for editing

blogRouter.get("/:username", blogController.blogGet); // username's blog

blogRouter.post("/:username/:image", blogController.blogImageEdit); // edit post (not put so i can put it in a form)

blogRouter.post("/:username/:image/delete", blogController.blogImageDelete); // delete post

module.exports = blogRouter;