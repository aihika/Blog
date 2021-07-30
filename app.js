//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mysql = require('mysql');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aihika0903',
});

connection.query(
  "CREATE DATABASE blog_app"
)

connection.query(
  "USE blog_app"
)

connection.query(
  "CREATE TABLE posts (id INT AUTO_INCREMENT, title TEXT, content TEXT, PRIMARY KEY (id))"
)

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get("/", function(req, res) {
  connection.query(
    "SELECT * FROM posts",
    (error, results) => {
      console.log(results);
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: results,
      });
    }
  )
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/posts", function(req, res) {
  connection.query(
    "SELECT * FROM posts",
    (error, results) => {
      console.log(results);
      res.render("posts", {
        posts: results,
      });
    }
  )
});

app.get("/edit/:postId", function(req, res) {
  connection.query(
    "SELECT * FROM posts WHERE id=?",
    [req.params.postId],
    (error, results) => {
      res.render("edit", {
        post: results[0],
      })
    }
  )
})

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
  }
  connection.query(
    "INSERT INTO posts (title, content) VALUES(?, ?)",
    [post.title, post.content],
    (error, results) => {
      res.redirect("/");
    }
  );
})

app.get("/posts/:postTitle", function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postTitle);

  connection.query(
    "SELECT * FROM posts",
    (error, results) => {
      results.forEach((post) => {
        const storedTitle = _.lowerCase(post.title);
    
        if (storedTitle === requestedTitle) {
          res.render("post", {
            title: post.title,
            content: post.content
          })
        }

      })
    }
  )
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM users',
    (error, results) => {
      console.log(results);
      res.render("home");
    }
  );
});

app.post("/update/:postId", function(req, res) {
  connection.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [req.body.postTitle, req.body.postContent, req.params.postId],
    (error, results) => {
      res.redirect("/")
    }
  )
})

app.post("/delete/:postId", function(req, res) {
  connection.query(
    "DELETE FROM posts WHERE id = ?",
    [req.params.postId],
    (error, results) => {
      res.redirect("/posts")
    }
  )
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
