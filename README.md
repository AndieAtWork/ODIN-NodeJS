# ODIN Project NodeJS Course
My first approach at NodeJS. This course was particularly long, consisting of 8 modules with more than one project each. I decided to add finishing touches to three of them (the third being Blogger which gets it's own repository.
Contents:
- Express
- Express Validator
- Express Routers
- Express Session
- EJS
- .env Files
- PostgreSQL (pg)
- Use of middleware
- Passport
- bcryptjs
- Prisma
- Cloudinary for uploading and retrieving files
- JWT
- CORS
- The making of an API to be used by an external client

This time all the CSS *is* fully made by me, so I'll take the credit whatever it's worth.

## PictureMe
PictureMe is an aproximation to what fotolog felt like in my childhood, though it has limited capabilities of course because that wasn't the point.
Through PictureMe you can browse through other people's blogs and you can sign up + login into your own, inside which you can create new posts, edit old posts and delete them.
The main functionality is uploading photos and being able to upload secret photos only logged in users can access.
Technologies used:
- Cloudinary of course! To upload, view and delete images
- Passport.js. for recognizing the logged in user
- bcryptjs for the passwords
- Express validator for when you create a new account or publish/edit posts
- SQL
- Awesome implementation: When the pictures that are "secret" are seen, the scr of the image appears as a link to the same app instead of a cloudinary url. You can't steal the original link. (And you can't download it because it doesn't let you open the right click menu). Of course there's always a way, for example using developer tools, but it was interesting to implement.



## Waldo


## Blogger (Just a peak, go check out its own repository!)
