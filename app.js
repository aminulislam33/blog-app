require('dotenv').config()

const express = require('express');
const path = require('path');
const Blog = require('./models/blog');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const CookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    });

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(CookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});