// const http = require("http");
// const fs = require("fs");

// //create a server
// const server = http.createServer((req, res) => {
//   console.log("request made", req.method, req.url);
//   switch (req.url) {
//     case "/":
//       res.setHeader("Content-Type", "text/html");
//       res.write("<p>Welcome to Ibrahim server</p>");
//       res.end();
//       break;
//     case "/about":
//       res.setHeader("Content-Type", "text/html");
//       // res.write("<p>Welcome to my about page</p>");
//       // res.write("<p>Read the recipes the server is made of</p>");
//       fs.readFile("./views/about.html", (err, data) => {
//         //console.log(data.toString());
//         if (err) {
//           console.log(err);
//           res.end();
//         } else {
//           res.end(data);
//         }
//       });

//       break;
//     case "/user":
//       res.setHeader("Content-Type", "text/html");
//       res.write("<p>Welcome to the user page</p>");
//       res.write(
//         "<p>All features and wonderful services that we offered all at your finger</p>"
//       );
//       res.end();
//       break;

//     case "/about-me":
//       res.statusCode = 302;
//       res.setHeader("location", "/about");
//       res.end();
//       break;

//     default:
//       res.setHeader("Content-Type", "text/html");
//       res.statusCode = 404;
//       res.write("<p>Ohh Opps</p>");
//       res.write("<p>The page you are looking for is not found!</p>");
//       res.end();
//   }
// });

// server.listen(4000);

const express = require("express");
const fs = require("fs");
require("dotenv").config();
const { urlencoded } = require("express");
const mongoose = require("mongoose");
const Blog = require("./model.js");

const app = express();
app.use(urlencoded({ extended: false }));

//MongodB URI
const dBURI = process.env.MONGODB_URI;

// register view engine
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));
//connecting to mongodB database
mongoose
  .connect(dBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database....");
    // server listening on port 4000
    app.listen(process.env.PORT || 4000, () =>
      console.log("Server listening on 4000........")
    );
  })
  .catch((err) => console.log("Failed to connect to database", err.message));

// middleware and static files serving
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { title: "About" });
});

app.get("/add-blog", async (req, res) => {
  try {
    const blog = new Blog({
      title: "A new blog about Firebase",
      snippet: "An Authencation and Other Backend Applications provider",
      body: "Firebase from Google have been one of the many service Google provides to make developer experience easier and enjoyable",
    });
    const response = await blog.save(blog);
    res.send(response);
  } catch (e) {
    console.error(e.message);
    res.end(e.message);
  }
});

app.get("/blog", (req, res) => {
  res.redirect("all-blogs");
  res.end();
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// create a new blog
app.get("/create-blog", (req, res) => {
  res.render("create-blog.ejs", { title: "Create Blog" });
});

//get all blog form database
app.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("blog", { title: "All Blogs", blogs });
  } catch (err) {
    console.error(err);
    res.end;
  }
});

//post a new blog
app.post("/add-blog", async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      snippet: req.body.snippet,
      body: req.body.body,
    });
    const content = await blog.save();
    if (content._id) {
      res.redirect("/all-blogs");
      res.end();
    }
  } catch (err) {
    console.error(err);
  }
});

//update blog
app.put("/update-blog", async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req._id, {
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body,
  });
  if (blog.title == req.body.title) {
    res.redirect("/all-blogs");
  }
});

//delete blog
app.delete("/delete-blog/:id", async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  res.json({ redirect: "/all-blogs" });
  res.end();
});

//Route to 404 page
app.use((req, res) => {
  res.render("404.ejs", { title: "Not Found " });
});
