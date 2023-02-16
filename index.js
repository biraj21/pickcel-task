import { renderFile } from "eta";
import express from "express";
import dbPool from "./util/database.js";
import Image from "./models/image.js";
import Post from "./models/post.js";

const app = express();
app.engine("eta", renderFile);
app.set("view engine", "eta");

app.get("/", async (req, res, next) => {
  try {
    const posts = await Post.getAll();
    res.render("index", { posts });
  } catch (err) {
    next(err);
  }
});

app.get("/posts/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    postId = Number(postId);

    const post = await Post.getById(postId);
    if (!post) {
      next();
      return;
    }

    const images = await Image.getByPostId(postId);
    if (images) {
      post.images = images;
    }

    res.render("post", { post });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(502).send("internal server error");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`server running on post ${PORT}`));
