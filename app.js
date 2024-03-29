//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { result } = require("lodash");


const homeStartingContent = "Welcome to our Blog Website. You can add blogs by clicking on Compose button in Navigation Bar.";
const aboutContent = "This is the first website I made while learning mongoDB and EJS. ";
const contactContent = "Your can contact me on yashnishal@gmail.com";

const app = express();

mongoose.connect("mongodb+srv://admin-yash:Test123@cluster0.addjr.mongodb.net/blogDB",{
  useNewUrlParser: true
});

const postSchema = {
  title : String,
  content : String
};

const Post = mongoose.model("post",postSchema);

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


// root
app.get('/', function(req, res) {

  Post.find({},(er, result) => {
    res.render("home",{
      startingContent : homeStartingContent,
      posts : result
    });
  });
});





// about
app.get("/about", function(req, res) {
  res.render("about",{
    aboutContent : aboutContent
  });
});


// contact
app.get("/contact", function(req, res) {
  res.render("contact",{
    contactContent : contactContent
  });
});


// Compose
app.get("/compose", function(req, res) {
  res.render("compose",{});
});

app.post('/compose', function(req ,res) {

  const post = new Post({
    title : req.body.postTitle,
    content : req.body.postBody
  });

  post.save( er => {
    if(!er) {
      res.redirect("/");
    }
  });
});


// posts/routes
app.get("/posts/:postId", function(req, res) {
  let requestedPostId = req.params.postId;

  Post.findOne({_id : requestedPostId}, function(e,result){
    res.render("post",{
      title : result.title,
      content : result.content
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
