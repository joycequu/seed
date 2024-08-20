/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Story = require("./models/story");
const Comment = require("./models/comment");
const User = require("./models/user");
const Document = require("./models/document");
const ProfilePic = require("./models/profilepic");
const Post = require('./models/post');

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user && req.body.socketid)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});


// health check API route: if this doesn't return 200, the server is down :(
router.get("/health", (_req, res) => {
  res.status(200);
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/stories", (req, res) => {
  // empty selector means get all documents
  Story.find({}).then((stories) => res.send(stories));
});

router.post("/story", auth.ensureLoggedIn, (req, res) => {
  const newStory = new Story({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
    created_at: Date(),
  });

  newStory.save().then((story) => res.send(story));
});

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });
  newComment.save().then((comment) => res.send(comment));
});

// router.get("/chat", (req, res) => {
//   let query;
//   if (req.query.recipient_id === "ALL_CHAT") {
//     // get any message sent by anybody to ALL_CHAT
//     query = { "recipient._id": "ALL_CHAT" };
//   } else {
//     // get messages that are from me->you OR you->me
//     query = {
//       $or: [
//         { "sender._id": req.user._id, "recipient._id": req.query.recipient_id },
//         { "sender._id": req.query.recipient_id, "recipient._id": req.user._id },
//       ],
//     };
//   }

//   Message.find(query).then((messages) => res.send(messages));
// });

/* NEW CODE */

// Import multer
const multer = require("multer");
// We'll use this later to specify how we want to upload files.
const upload = multer();

// Other API routes probably goes here. Don't forget to define the router as well (this is meant to be added to an existing api.js).

// Here, we're saying that we have a route uploadFile. 
// uploadFile expects 1 file to be uploaded, and for the form field that file is uploaded to to be named file (that's what the upload.single("file") means). 
// Then, we declare our callback for how we'll handle the request like normal.
router.post("/uploadFile", upload.single("file"), (req, res) => {
  const image = new ProfilePic({ creator_id: req.user._id, name: req.body.name, file: Buffer.from(req.file.buffer) });
  image.save()
  .then((result) => { User.findOneAndUpdate({_id : req.user._id}, {profilepicid: result._id}).then(res.status(200).send({})); })
  .catch((err) => { 
    console.log(`Failed to save image to database: ${err}`); 
    res.status(500).send({ error: "failed to upload!" }); 
  });

});

// This code has no error handling and should really check that o !== null.
router.get("/file", (req, res) => {
  ProfilePic.findOne({ _id : req.query.imageid })
    .then((o) => {res.send({file: o.file.toString('base64')})})
    .catch((error) => { 
      console.log(`Failed to search for file in MongoDB: ${error}`);
      res.status(400)
        .send({error: "Failed to search for file in MongoDB"});
    });
});

// This is for uploading image with each post***
// BELOW IS FOR POSTS

// Here, we're saying that we have a route uploadFile. 
// uploadFile expects 1 file to be uploaded, and for the form field that file is uploaded to to be named file (that's what the upload.single("file") means). 
// Then, we declare our callback for how we'll handle the request like normal.
router.post("/uploadPost", upload.single("file"), (req, res) => {
  const newPost = new Post({
    creator_id: req.user._id,
    creator_name: req.user.name,
    name: req.body.name,
    file: Buffer.from(req.file.buffer),
    caption: req.body.caption,
    created_at: Date(),
  });
  newPost.save()
    .then((result) => { res.status(200).send({}); })
    .catch((err) => { 
      console.log(`Failed to save post to database: ${err}`); 
      res.status(500).send({ error: "failed to upload!" }); 
    });
});

// get all of the posts from Post
router.get("/posts", (req, res) => {
  // empty selector means get all documents
  Post.find({}).then((posts) => res.send(posts));
});

// This code has no error handling and should really check that o !== null.
router.get("/post", (req, res) => {
  Post.findOne({ _id : req.query.imageid })
    .then((o) => {res.send({file: o.file.toString('base64')})})
    .catch((error) => { 
      console.log(`Failed to search for file in MongoDB: ${error}`);
      res.status(400)
        .send({error: "Failed to search for file in MongoDB"});
    });
});

//POST message
// router.post("/message", auth.ensureLoggedIn, (req, res) => {
//   console.log(`Received a chat message from ${req.user.name}: ${req.body.content}`);

//   // insert this message into the database
//   const message = new Message({
//     recipient: req.body.recipient,
//     sender: {
//       _id: req.user._id,
//       name: req.user.name,
//     },
//     content: req.body.content,
//   });
//   message.save();

//   if (req.body.recipient._id == "ALL_CHAT") {
//     socketManager.getIo().emit("message", message);
//   } else {
//     socketManager.getSocketFromUserID(req.user._id).emit("message", message);
//     if (req.user._id !== req.body.recipient._id) {
//       socketManager.getSocketFromUserID(req.body.recipient._id).emit("message", message);
//     }
//   }
// });

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socketManager.getAllConnectedUsers() });
});

// router.post("/spawn", (req, res) => {
//   if (req.user) {
//     socketManager.addUserToGame(req.user);
//   }
//   res.send({});
// });

// router.post("/despawn", (req, res) => {
//   if (req.user) {
//     socketManager.removeUserFromGame(req.user);
//   }
//   res.send({});
// });

// router.get("/isrunnable", (req, res) => {
//   res.send({ isrunnable: ragManager.isRunnable() });
// });

// router.post("/document", (req, res) => {
//   const newDocument = new Document({
//     content: req.body.content,
//   });

//   const addDocument = async (document) => {
//     try {
//       await document.save();
//       await ragManager.addDocument(document);
//       res.send(document);
//     } catch (error) {
//       console.log("error:", error);
//       res.status(500);
//       res.send({});
//     }
//   };

//   addDocument(newDocument);
// });

// router.get("/document", (req, res) => {
//   Document.find({}).then((documents) => res.send(documents));
// });

// router.post("/updateDocument", (req, res) => {
//   const updateDocument = async (id) => {
//     const document = await Document.findById(id);
//     if (!document) res.send({});
//     try {
//       document.content = req.body.content;
//       await document.save();
//       await ragManager.updateDocument(document);
//       res.send({});
//     } catch (error) {
//       console.log("error:", error);
//       res.status(500);
//       res.send({});
//     }
//   };
//   updateDocument(req.body._id);
// });

// router.post("/deleteDocument", (req, res) => {
//   const deleteDocument = async (id) => {
//     const document = await Document.findById(id);
//     if (!document) res.send({});
//     try {
//       await ragManager.deleteDocument(id);
//       await document.remove();
//       res.send({});
//     } catch {
//       // if deleting from the vector db failed (e.g., it doesn't exist)
//       await document.remove();
//       res.send({});
//     }
//   };
//   deleteDocument(req.body._id);
// });

// router.post("/query", (req, res) => {
//   const makeQuery = async () => {
//     try {
//       const queryresponse = await ragManager.retrievalAugmentedGeneration(req.body.query);
//       res.send({ queryresponse });
//     } catch (error) {
//       console.log("error:", error);
//       res.status(500);
//       res.send({});
//     }
//   };
//   makeQuery();
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
