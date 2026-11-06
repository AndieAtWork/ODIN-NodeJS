const { body, validationResult, matchedData } = require("express-validator");
const { uploadToCloudinary } = require("../lib/cloudinary");
const { uploadToCloudinaryPrivate, cloudinaryPrivate } = require("../lib/cloudinary_private");
const pool = require("../db");

const cloudinary = require("cloudinary").v2;

const validatePost = [
    body("title").trim()
      .isLength({ min: 1, max: 50 }).withMessage(`Your title must be between 1 and 50 characters long.`),

    body("description").trim()
      .optional({ values: "falsy" })
      .isLength({ max: 500 })
      .withMessage("Your description cannot be more than 500 characters long.")
];

exports.publishGet = (req, res) => {
  const errors = req.session.messages || [];
  req.session.messages = [];
  if (res.locals && res.locals.currentUser){
    res.render("publish", {
      editing: false,
      finished: false
    });
  }else{
    res.render("login");
  }
};

exports.publishPostImage = async (req, res, next) => {
  if (!req.file){
    var errorList = [{ msg: "You must upload an image (JPEG or PNG)." }]
    return res.status(400).render("publish", {
      errors: errorList,
      finished: false
    });
  }

  console.log(req.body);

  var private = 0;
  if (req.body.private && req.body.private == "on"){
    private = 1
  }

  try {
    // Subir imagen a Cloudinary desde el buffer en memoria
    //console.log("CLOUDINARY")
    //console.log(req.file)
    var cloudinaryResult = null;
    if (private == 0){
      cloudinaryResult = await uploadToCloudinary(req.file.buffer, "picture_me_posts");
    }else{
      cloudinaryResult = await uploadToCloudinaryPrivate(req.file.buffer, "picture_me_posts");
    }

    // Datos relevantes que devuelve Cloudinary:
    const imageUrl = cloudinaryResult.secure_url; // URL HTTPS publica
    const imageId = cloudinaryResult.public_id;   // Token/ID unico en Cloudinary

    console.log({
      imageurl: imageUrl,
      imageid: imageId,
      private: private,
      finished: true,
      filename: req.file.originalname
    })

    res.render("publish", {
      imageurl: imageUrl,
      imageid: imageId,
      private: private,
      finished: true,
      filename: req.file.originalname
    })
  } catch (err) {
    console.log("ERROR")
    next(err);
  }
}

exports.publishPost = [
  ...validatePost,
  async (req, res, next) => {
    const errors = validationResult(req);
    let errorList = errors.array();

    console.log("PUBLISHING");
    console.log(errorList);

    console.log("BODY");
    console.log(req.body);

    let imageUrl = req.body.imageurl;
    let imageId = req.body.imageid;
    let private = req.body.privateStatus;
    let filename = req.body.storedFilename;

    if (errorList.length > 0) {
      return res.status(400).render("publish", {
        errors: errorList,
        imageurl: imageUrl,
        imageid: imageId,
        private: private,
        finished: true,
        filename: filename,
        formData: req.body
      });
    }

    try {

      await pool.query(
        "INSERT INTO blog_post (title, text, posted_date, image_url, image_id, user_id, private) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [req.body.title, req.body.description, new Date(), imageUrl, imageId, res.locals.currentUser.user_id, private]
      );

      const url = res.locals.currentUser.username.toLowerCase();
      res.redirect("/blog/" + url);
    } catch (err) {
      next(err);
    }
  }
]

exports.blogGet = async (req, res) => {
  const username = req.params.username
  const { rows } = await pool.query(
    "SELECT * FROM blog_user WHERE LOWER(username) = $1 LIMIT 1",
    [username.toLowerCase()]
  );
  let blogUser = rows[0]

  const { rows: pictures } = await pool.query(
    `SELECT blog_post.* 
    FROM blog_post
    INNER JOIN blog_user ON blog_post.user_id = blog_user.user_id
    WHERE LOWER(blog_user.username) = LOWER($1)
    ORDER BY posted_date DESC`,
    [username.toLowerCase()]
  );

  console.log(blogUser)

  res.render("blog", { 
    blogUser, 
    pictures 
  });
};

exports.blogSecretImageGet = async (req, res, next) => {
  const username = req.params.username
  const postId = req.params.image

  if (res.locals && res.locals.currentUser){
    // Only users can see secret images. You need an account
  }else{
    return res.sendStatus("403");
  }

  console.log(username)
  console.log(postId)

  try {

    const { rows } = await pool.query(
      `SELECT image_id
      FROM blog_post
      INNER JOIN blog_user ON blog_post.user_id = blog_user.user_id 
      WHERE post_id = $1 and private = 1
      and LOWER(blog_user.username) = $2`,
      [postId, username.toLowerCase()]
    );
    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    // If you don't have access: pending
    // if (req.user.idMember !== post.idMember) {
    //   return res.sendStatus(403);
    // }

    const post = rows[0];

    // Crear URL firmada SOLO en el servidor
    const cloudinaryUrl = cloudinaryPrivate.url(
      post.image_id,
      {
        resource_type: "image",
        type: "authenticated",
        sign_url: true
      }
    );

    // Pedir imagen a Cloudinary
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      return res.sendStatus(404);
    }

    const contentType = response.headers.get("content-type");
    const buffer = Buffer.from(await response.arrayBuffer());

    // Entregar imagen al navegador
    res.set("Content-Type", contentType);
    res.send(buffer);

  } catch (error) {
    next(error);
  }
  
}

exports.blogImageGet = async (req, res, next) => {
  const username = req.params.username;
  const image = req.params.image;

  if (res.locals && res.locals.currentUser && res.locals.currentUser.username.toLowerCase() == username.toLowerCase()){
  
    try{

      const { rows } = await pool.query(
        `SELECT blog_post.*
        FROM blog_post
        INNER JOIN blog_user ON blog_post.user_id = blog_user.user_id 
        WHERE post_id = $1
        and LOWER(blog_user.username) = $2`,
        [image, username.toLowerCase()]
      );
      if (rows.length === 0) {
        return res.sendStatus(404);
      }
      
      const post = rows[0];

      res.render("publish" , {
        editing: true,
        image: image,
        title: post.title,
        text: post.text,
        imageurl: post.image_url
      });

    } catch (error) {
      next(error);
    }

  }else{
    res.render("/");
  }
};

exports.blogImageEdit = async (req, res, next) => {
  const username = req.params.username;
  const image = req.params.image;

  if (res.locals && res.locals.currentUser && res.locals.currentUser.username.toLowerCase() == username.toLowerCase()){

    var title = req.body.title;
    var text = req.body.description;
    var url = req.body.imageurl;

    console.log(req.body);

    if (title.trim().length == 0){
      var errorList = [{ msg: "You must enter a title." }]
      return res.status(400).render("publish", {
        errors: errorList,
        editing: true,
        imageurl: url,
        formData: req.body,
        image: image
      });
    }

    try{

      await pool.query("UPDATE blog_post SET title = $1, text = $2 WHERE blog_post.post_id = $3",
      [title, text, image]);

      const url = res.locals.currentUser.username.toLowerCase();
      res.redirect("/blog/" + url);

    }catch(error){
      next(error);
    }

  }else{
    res.render("/");
  }
};

exports.blogImageDelete = async (req, res, next) => {
  const username = req.params.username;
  const image = req.params.image;

  if (res.locals && res.locals.currentUser && res.locals.currentUser.username.toLowerCase() == username.toLowerCase()){
    
    try{
      const { rows: exists } = await pool.query("SELECT * FROM blog_post where blog_post.post_id = $1 and blog_post.user_id = $2",
        [image, res.locals.currentUser.user_id]
      )

      console.log([image, res.locals.currentUser.user_id])
      console.log(exists)
      if (exists.length > 0){

        var id = exists[0].image_id
        await pool.query("DELETE from blog_post WHERE blog_post.post_id = $1", [image]);
        await cloudinary.uploader.destroy(id);

        res.redirect("/blog/" + username)

      }else{
        console.log("ERROR 404");
        res.redirect("/blog/" + username)
      }
      
    }catch(error){
      next(error)
    }
    
  }else{
    res.render("/");
  }
};
