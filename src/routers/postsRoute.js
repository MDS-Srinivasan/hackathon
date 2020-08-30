const express = require("express");
const Post = require("../models/Post");
const Author = require("../models/Author");
const PostRouter = express.Router();

PostRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json({
      posts
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});
PostRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.findById(id).populate("author");
    res.status(200).json({
      posts
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});
PostRouter.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { title, content, authorId } = req.body;
    const result = await new Post({
      title,
      content,
      author: authorId
    }).save();
    res.status(200).json({
      result
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = PostRouter;
