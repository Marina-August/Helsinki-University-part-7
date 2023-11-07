const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const userId = request.user;
  if (!userId) {
    response.status(401).json("JsonWebTokenError");
  }
  const user = await User.findById(userId);
  if (body.likes === undefined) {
    body.likes = 0;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userId,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const userId = request.user;
  if (!userId) {
    response.status(401).json("JsonWebTokenError");
  }
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    next(Error(`Blog not found!`));
  }

  if (blog.user.toString() === userId.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    next(Error(`Permission denied. Can delete own blogs only!`));
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
    }).populate("user", { username: 1, name: 1 });
    if (!updatedBlog) {
      next(Error(`Information has already been removed from server.`));
    } else {
      response.json(updatedBlog);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;
  const userId = request.user;
  if (!userId) {
    response.status(401).json("JsonWebTokenError");
  }
  const user = await User.findById(userId);
  console.log()
  const comment = new Comment({
    text: body.text,
    blog: request.params.id,
    user: userId,
  });

  const savedComment = await comment.save();

  response.status(201).json(savedComment);
});

blogsRouter.get("/:id/comments", async (request, response) => {
  const blogId = request.params.id;
  const comments = await Comment.find({ blog: blogId }).populate("user", { username: 1, name: 1 });
  response.json(comments);
});



module.exports = blogsRouter;
